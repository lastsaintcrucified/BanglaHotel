/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	BarChart3,
	TrendingUp,
	DollarSign,
	Package,
	Users,
	Calendar,
	Download,
	PieChart,
	Activity,
	Target,
} from "lucide-react";
import {
	getEmployees,
	getProducts,
	getProductionEntries,
	getSnacks,
	getExpenses,
} from "@/lib/firestore";
import Image from "next/image";

export type ExpenseBreakdown = {
	category: string;
	amount: number;
	count: number;
	subcategories: Record<string, number>;
	percentage: number;
};
export type Day = {
	date: string;
	revenue: number;
	cost: number;
	profit: number;
	itemsProduced: number;
};
export type ReportSummary = {
	summary: {
		totalRevenue: number;
		totalCost: number;
		netProfit: number;
		profitMargin: number;
		totalSnacksProduced: number;
		employeeCosts: number;
		averageDailyRevenue: number;
		bestPerformingDay: Day | null;
		worstPerformingDay: Day | null;
		totalExpenses: number;
	};
	snackPerformance: any[]; // Replace `any` with a defined type if possible
	// ingredientUsage: any[];
	employeeSummary: any[];
	dailyTrends: any[];
	topProducts: any[];
	expenseBreakdown: ExpenseBreakdown[] | [];
	realExpenseBreakdown: ExpenseBreakdown[] | [];
};
export default function ReportsComplete() {
	const [dateRange, setDateRange] = useState({
		from: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
			.toISOString()
			.split("T")[0],
		to: new Date().toISOString().split("T")[0],
	});

	const [reportData, setReportData] = useState<ReportSummary>({
		summary: {
			totalRevenue: 0,
			totalCost: 0,
			netProfit: 0,
			profitMargin: 0,
			totalSnacksProduced: 0,
			employeeCosts: 0,
			averageDailyRevenue: 0,
			bestPerformingDay: null,
			worstPerformingDay: null,
			totalExpenses: 0,
		},
		snackPerformance: [],
		// ingredientUsage: [],
		employeeSummary: [],
		dailyTrends: [],
		topProducts: [],
		expenseBreakdown: [],
		realExpenseBreakdown: [],
	});

	const [loading, setLoading] = useState(false);
	const [reportType, setReportType] = useState("summary");
	const [filterBy, setFilterBy] = useState("all");

	const generateReport = async () => {
		setLoading(true);
		try {
			const [employees, products, productionEntries, snacks, expenses] =
				await Promise.all([
					getEmployees(),
					getProducts(),
					getProductionEntries(dateRange.from, dateRange.to),
					getSnacks(),
					getExpenses(dateRange.from, dateRange.to),
				]);

			// Calculate summary metrics with null checks
			const totalRevenue = productionEntries.reduce(
				(sum, entry) => sum + (entry.totalRevenue || 0),
				0
			);
			const totalCost = productionEntries.reduce(
				(sum, entry) => sum + (entry.totalCost || 0),
				0
			);
			const netProfit = totalRevenue - totalCost;
			const profitMargin =
				totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

			// Calculate real expense breakdown from Firebase data

			const expensesByCategory: Record<string, ExpenseBreakdown> = {};
			const totalExpenses = expenses.reduce((sum, expense) => {
				const amount = expense.amount || 0;
				if (!expensesByCategory[expense.category]) {
					expensesByCategory[expense.category] = {
						category: expense.category,
						amount: 0,
						count: 0,
						subcategories: {},
						percentage: 0,
					};
				}
				expensesByCategory[expense.category].amount += amount;
				expensesByCategory[expense.category].count += 1;

				if (
					!expensesByCategory[expense.category].subcategories[
						expense.subcategory
					]
				) {
					expensesByCategory[expense.category].subcategories[
						expense.subcategory
					] = 0;
				}
				expensesByCategory[expense.category].subcategories[
					expense.subcategory
				] += amount;

				return sum + amount;
			}, 0);

			const realExpenseBreakdown = Object.values(expensesByCategory)
				.map((category: any) => ({
					...category,
					percentage:
						totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0,
				}))
				.sort((a, b) => b.amount - a.amount);

			// Calculate snack performance with null checks
			type SnackStat = {
				name: string;
				quantity: number;
				revenue: number;
				cost: number;
				profit: number;
			};

			const snackStats: Record<string, SnackStat> = {};
			productionEntries.forEach((entry) => {
				if (entry.snacksProduced && Array.isArray(entry.snacksProduced)) {
					entry.snacksProduced.forEach((snack) => {
						if (!snackStats[snack.snackName]) {
							snackStats[snack.snackName] = {
								name: snack.snackName,
								quantity: 0,
								revenue: 0,
								cost: 0,
								profit: 0,
							};
						}
						snackStats[snack.snackName].quantity += snack.quantity || 0;
						snackStats[snack.snackName].revenue += snack.revenue || 0;
						snackStats[snack.snackName].cost += snack.cost || 0;
						snackStats[snack.snackName].profit +=
							(snack.revenue || 0) - (snack.cost || 0);
					});
				}
			});

			// Calculate daily trends with null checks
			const dailyTrends = productionEntries
				.map((entry) => ({
					date: entry.date || new Date().toISOString().split("T")[0],
					revenue: entry.totalRevenue || 0,
					cost: entry.totalCost || 0,
					profit: (entry.totalRevenue || 0) - (entry.totalCost || 0),
					itemsProduced:
						entry.snacksProduced?.reduce(
							(sum, snack) => sum + (snack.quantity || 0),
							0
						) || 0,
				}))
				.sort(
					(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
				);

			// Find best and worst performing days with fallbacks
			const bestDay =
				dailyTrends.length > 0
					? dailyTrends.reduce(
							(best, current) =>
								current.revenue > best.revenue ? current : best,
							dailyTrends[0]
					  )
					: {
							date: dateRange.from,
							revenue: 0,
							cost: 0,
							profit: 0,
							itemsProduced: 0,
					  };

			const worstDay =
				dailyTrends.length > 0
					? dailyTrends.reduce(
							(worst, current) =>
								current.revenue < worst.revenue ? current : worst,
							dailyTrends[0]
					  )
					: {
							date: dateRange.from,
							revenue: 0,
							cost: 0,
							profit: 0,
							itemsProduced: 0,
					  };

			// Calculate employee costs with null checks
			const employeeCosts = employees.reduce((sum, emp) => {
				const dailySalary = (emp.salary || 0) / 30;
				const daysInRange = Math.ceil(
					(new Date(dateRange.to).getTime() -
						new Date(dateRange.from).getTime()) /
						(1000 * 60 * 60 * 24)
				);
				return sum + dailySalary * daysInRange;
			}, 0);

			setReportData({
				summary: {
					totalRevenue: totalRevenue || 0,
					totalCost: totalCost || 0,
					netProfit: netProfit || 0,
					profitMargin: profitMargin || 0,
					totalSnacksProduced: Object.values(snackStats).reduce(
						(sum, snack) => sum + (snack.quantity || 0),
						0
					),
					employeeCosts: employeeCosts || 0,
					averageDailyRevenue:
						dailyTrends.length > 0
							? (totalRevenue || 0) / dailyTrends.length
							: 0,
					bestPerformingDay: bestDay,
					worstPerformingDay: worstDay,
					totalExpenses: totalExpenses || 0,
				},
				snackPerformance: Object.values(snackStats).sort(
					(a, b) => (b.profit || 0) - (a.profit || 0)
				),
				employeeSummary: employees.map((emp) => ({
					...emp,
					estimatedCost:
						((emp.salary || 0) / 30) *
						Math.ceil(
							(new Date(dateRange.to).getTime() -
								new Date(dateRange.from).getTime()) /
								(1000 * 60 * 60 * 24)
						),
				})),
				dailyTrends,
				topProducts: Object.values(snackStats)
					.sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
					.slice(0, 5),
				expenseBreakdown: [
					{
						category: "Ingredients",
						amount: (totalCost || 0) * 0.6,
						percentage: 60,
						count: 0,
						subcategories: {},
					},
					{
						category: "Labor",
						amount: employeeCosts || 0,
						percentage:
							((employeeCosts || 0) /
								((totalCost || 0) + (employeeCosts || 0))) *
								100 || 0,
						count: 0,
						subcategories: {},
					},
					{
						category: "Utilities",
						amount: (totalCost || 0) * 0.15,
						percentage: 15,
						count: 0,
						subcategories: {},
					},
					{
						category: "Other",
						amount: (totalCost || 0) * 0.25,
						percentage: 25,
						count: 0,
						subcategories: {},
					},
				],
				realExpenseBreakdown,
				// ingredientUsage: []
			});
		} catch (error) {
			console.error("Error generating report:", error);
			// Set default empty data on error
			setReportData({
				summary: {
					totalRevenue: 0,
					totalCost: 0,
					netProfit: 0,
					profitMargin: 0,
					totalSnacksProduced: 0,
					employeeCosts: 0,
					averageDailyRevenue: 0,
					bestPerformingDay: null,
					worstPerformingDay: null,
					totalExpenses: 0,
				},
				snackPerformance: [],
				employeeSummary: [],
				dailyTrends: [],
				topProducts: [],
				expenseBreakdown: [],
				realExpenseBreakdown: [],
				// ingredientUsage: [],
			});
		} finally {
			setLoading(false);
		}
	};

	const exportReport = (format: any) => {
		const reportContent = {
			dateRange,
			reportType,
			data: reportData,
			generatedAt: new Date().toISOString(),
		};

		if (format === "json") {
			const blob = new Blob([JSON.stringify(reportContent, null, 2)], {
				type: "application/json",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `hotel-report-${dateRange.from}-to-${dateRange.to}.json`;
			a.click();
		} else if (format === "csv") {
			// Convert to CSV format
			let csvContent = "Date,Revenue,Cost,Profit,Items Produced\n";
			reportData.dailyTrends.forEach((day) => {
				csvContent += `${day.date},${day.revenue},${day.cost},${day.profit},${day.itemsProduced}\n`;
			});

			const blob = new Blob([csvContent], { type: "text/csv" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `hotel-report-${dateRange.from}-to-${dateRange.to}.csv`;
			a.click();
		}
	};

	useEffect(() => {
		generateReport();
	}, []);

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'>
						Complete Reports
					</h1>
					<p className='text-gray-600'>
						Comprehensive business analytics and insights
					</p>
				</div>
				<div className='flex space-x-2'>
					<Select
						value={filterBy}
						onValueChange={setFilterBy}
					>
						<SelectTrigger className='w-32'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Data</SelectItem>
							<SelectItem value='profitable'>Profitable Only</SelectItem>
							<SelectItem value='top-performers'>Top Performers</SelectItem>
						</SelectContent>
					</Select>
					<Button
						variant='outline'
						onClick={() => exportReport("csv")}
					>
						<Download className='h-4 w-4 mr-2' />
						Export CSV
					</Button>
					<Button
						variant='outline'
						onClick={() => exportReport("json")}
					>
						<Download className='h-4 w-4 mr-2' />
						Export JSON
					</Button>
				</div>
			</div>

			{/* Date Range and Generate */}
			<Card className='shadow-lg border-0 bg-gradient-to-r from-blue-50 to-green-50'>
				<CardHeader>
					<CardTitle className='flex items-center text-blue-700'>
						<Calendar className='h-5 w-5 mr-2' />
						Report Configuration
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex flex-wrap gap-4 items-end'>
						<div>
							<Label htmlFor='fromDate'>From Date</Label>
							<Input
								id='fromDate'
								type='date'
								value={dateRange.from}
								onChange={(e) =>
									setDateRange({ ...dateRange, from: e.target.value })
								}
							/>
						</div>
						<div>
							<Label htmlFor='toDate'>To Date</Label>
							<Input
								id='toDate'
								type='date'
								value={dateRange.to}
								onChange={(e) =>
									setDateRange({ ...dateRange, to: e.target.value })
								}
							/>
						</div>
						<div>
							<Label htmlFor='reportType'>Report Type</Label>
							<Select
								value={reportType}
								onValueChange={setReportType}
							>
								<SelectTrigger className='w-40'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='summary'>Summary</SelectItem>
									<SelectItem value='detailed'>Detailed</SelectItem>
									<SelectItem value='financial'>Financial</SelectItem>
									<SelectItem value='operational'>Operational</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button
							onClick={generateReport}
							disabled={loading}
							className='bg-gradient-to-r from-blue-600 to-green-600'
						>
							{loading ? "Generating..." : "Generate Report"}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Key Metrics */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<Card className='shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-green-700'>
										Total Revenue
									</p>
									<p className='text-2xl font-bold text-green-800'>
										Tk{(reportData.summary.totalRevenue || 0).toLocaleString()}
									</p>
									<p className='text-xs text-green-600 mt-1'>
										Avg: Tk
										{Math.round(
											reportData.summary.averageDailyRevenue
										).toLocaleString()}
										/day
									</p>
								</div>
								<div className='p-3 rounded-full bg-green-200'>
									<DollarSign className='h-6 w-6 text-green-700' />
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Card className='shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-blue-700'>
										Net Profit
									</p>
									<p className='text-2xl font-bold text-blue-800'>
										Tk{(reportData.summary.netProfit || 0).toLocaleString()}
									</p>
									<p className='text-xs text-blue-600 mt-1'>
										Margin: {reportData.summary.profitMargin.toFixed(1)}%
									</p>
								</div>
								<div className='p-3 rounded-full bg-blue-200'>
									<TrendingUp className='h-6 w-6 text-blue-700' />
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<Card className='shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-purple-700'>
										Items Produced
									</p>
									<p className='text-2xl font-bold text-purple-800'>
										{(
											reportData.summary.totalSnacksProduced || 0
										).toLocaleString()}
									</p>
									<p className='text-xs text-purple-600 mt-1'>
										{reportData.snackPerformance.length} varieties
									</p>
								</div>
								<div className='p-3 rounded-full bg-purple-200'>
									<Package className='h-6 w-6 text-purple-700' />
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Card className='shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-orange-700'>
										Total Expenses
									</p>
									<p className='text-2xl font-bold text-orange-800'>
										Tk
										{Math.round(
											reportData.summary.totalExpenses || 0
										).toLocaleString()}
									</p>
									<p className='text-xs text-orange-600 mt-1'>
										{reportData.realExpenseBreakdown.length} categories
									</p>
								</div>
								<div className='p-3 rounded-full bg-orange-200'>
									<Users className='h-6 w-6 text-orange-700' />
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			{/* Performance Highlights */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card className='shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-emerald-100'>
					<CardHeader>
						<CardTitle className='flex items-center text-emerald-700'>
							<Target className='h-5 w-5 mr-2' />
							Best Performing Day
						</CardTitle>
					</CardHeader>
					<CardContent>
						{reportData.summary.bestPerformingDay ? (
							<div className='space-y-2'>
								<p className='text-lg font-semibold text-emerald-800'>
									{new Date(
										reportData.summary.bestPerformingDay.date
									).toLocaleDateString("en-GB", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
								<div className='grid grid-cols-2 gap-4 text-sm'>
									<div>
										<p className='text-emerald-600'>Revenue</p>
										<p className='font-bold text-emerald-800'>
											Tk
											{(
												reportData.summary.bestPerformingDay.revenue || 0
											).toLocaleString()}
										</p>
									</div>
									<div>
										<p className='text-emerald-600'>Items</p>
										<p className='font-bold text-emerald-800'>
											{reportData.summary.bestPerformingDay.itemsProduced || 0}
										</p>
									</div>
								</div>
							</div>
						) : (
							<p className='text-emerald-600'>No data available</p>
						)}
					</CardContent>
				</Card>

				<Card className='shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100'>
					<CardHeader>
						<CardTitle className='flex items-center text-red-700'>
							<Activity className='h-5 w-5 mr-2' />
							Improvement Opportunity
						</CardTitle>
					</CardHeader>
					<CardContent>
						{reportData.summary.worstPerformingDay && (
							<div className='space-y-2'>
								<p className='text-lg font-semibold text-red-800'>
									{new Date(
										reportData.summary.worstPerformingDay.date
									).toLocaleDateString("en-GB", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
								<div className='grid grid-cols-2 gap-4 text-sm'>
									<div>
										<p className='text-red-600'>Revenue</p>
										<p className='font-bold text-red-800'>
											Tk
											{(
												reportData.summary.worstPerformingDay.revenue || 0
											).toLocaleString()}
										</p>
									</div>
									<div>
										<p className='text-red-600'>Items</p>
										<p className='font-bold text-red-800'>
											{reportData.summary.worstPerformingDay.itemsProduced || 0}
										</p>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Detailed Reports Tabs */}
			<Tabs
				value={reportType}
				onValueChange={setReportType}
				className='space-y-6'
			>
				<TabsList className='grid w-full grid-cols-4'>
					<TabsTrigger value='summary'>Summary</TabsTrigger>
					<TabsTrigger value='detailed'>Detailed</TabsTrigger>
					<TabsTrigger value='financial'>Financial</TabsTrigger>
					<TabsTrigger value='operational'>Operational</TabsTrigger>
				</TabsList>

				<TabsContent
					value='summary'
					className='space-y-6'
				>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						{/* Top Products */}
						<Card className='shadow-lg'>
							<CardHeader>
								<CardTitle className='flex items-center'>
									<BarChart3 className='h-5 w-5 mr-2' />
									Top Performing Products
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									{reportData.topProducts.map((product, index) => (
										<div
											key={index}
											className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
										>
											<div className='flex items-center space-x-3'>
												<div
													className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
														index === 0
															? "bg-yellow-500"
															: index === 1
															? "bg-gray-400"
															: index === 2
															? "bg-orange-500"
															: "bg-blue-500"
													}`}
												>
													{index + 1}
												</div>
												<div>
													<p className='font-medium'>{product.name}</p>
													<p className='text-sm text-gray-600'>
														{product.quantity} units
													</p>
												</div>
											</div>
											<div className='text-right'>
												<p className='font-semibold text-green-600'>
													Tk{(product.profit || 0).toLocaleString()}
												</p>
												<p className='text-xs text-gray-500'>profit</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Real Expense Breakdown */}
						<Card className='shadow-lg'>
							<CardHeader>
								<CardTitle className='flex items-center'>
									<PieChart className='h-5 w-5 mr-2' />
									Real Expense Breakdown
								</CardTitle>
								<CardDescription>
									Actual expenses from your business operations
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									{reportData.realExpenseBreakdown.map((expense, index) => (
										<div
											key={index}
											className='space-y-2'
										>
											<div className='flex justify-between items-center'>
												<div>
													<span className='font-medium'>
														{expense.category}
													</span>
													<span className='text-xs text-gray-500 ml-2'>
														({expense.count} transactions)
													</span>
												</div>
												<span className='font-semibold'>
													Tk{Math.round(expense.amount).toLocaleString()}
												</span>
											</div>
											<div className='w-full bg-gray-200 rounded-full h-2'>
												<div
													className='bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all'
													style={{
														width: `${Math.min(expense.percentage, 100)}%`,
													}}
												/>
											</div>
											<div className='flex justify-between text-xs text-gray-600'>
												<span>
													{expense.percentage.toFixed(1)}% of total expenses
												</span>
												<span>
													Avg: Tk
													{expense.count > 0
														? Math.round(
																expense.amount / expense.count
														  ).toLocaleString()
														: 0}
													/transaction
												</span>
											</div>
											{/* Show subcategories */}
											<div className='ml-4 space-y-1'>
												{Object.entries(expense.subcategories || {}).map(
													([subcat, amount]) => (
														<div
															key={subcat}
															className='flex justify-between text-xs text-gray-500'
														>
															<span>• {subcat}</span>
															<span>
																Tk{Math.round(amount).toLocaleString()}
															</span>
														</div>
													)
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent
					value='detailed'
					className='space-y-6'
				>
					{/* Daily Trends */}
					<Card className='shadow-lg'>
						<CardHeader>
							<CardTitle>Daily Performance Trends</CardTitle>
							<CardDescription>
								Revenue, cost, and profit trends over the selected period
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								{reportData.dailyTrends.map((day, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
										className='flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow'
									>
										<div>
											<p className='font-medium'>
												{new Date(day.date).toLocaleDateString("en-GB", {
													weekday: "short",
													month: "short",
													day: "numeric",
												})}
											</p>
											<p className='text-sm text-gray-600'>
												{day.itemsProduced} items
											</p>
										</div>
										<div className='grid grid-cols-3 gap-4 text-sm'>
											<div className='text-center'>
												<p className='text-green-600'>Revenue</p>
												<p className='font-semibold'>
													Tk{day.revenue.toLocaleString()}
												</p>
											</div>
											<div className='text-center'>
												<p className='text-red-600'>Cost</p>
												<p className='font-semibold'>
													Tk{day.cost.toLocaleString()}
												</p>
											</div>
											<div className='text-center'>
												<p className='text-blue-600'>Profit</p>
												<p className='font-semibold'>
													Tk{day.profit.toLocaleString()}
												</p>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent
					value='financial'
					className='space-y-6'
				>
					{/* Snack Performance */}
					<Card className='shadow-lg'>
						<CardHeader>
							<CardTitle>Product Financial Performance</CardTitle>
							<CardDescription>
								Revenue and profit analysis by product
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								{reportData.snackPerformance.map((snack, index) => (
									<div
										key={index}
										className='space-y-3 p-4 border rounded-lg'
									>
										<div className='flex justify-between items-center'>
											<h4 className='font-semibold text-lg'>{snack.name}</h4>
											<Badge
												variant='outline'
												className='text-blue-600'
											>
												{snack.quantity} units
											</Badge>
										</div>
										<div className='grid grid-cols-4 gap-4 text-sm'>
											<div className='text-center p-3 bg-green-50 rounded'>
												<p className='text-green-600 font-medium'>Revenue</p>
												<p className='text-lg font-bold text-green-800'>
													Tk{(snack.revenue || 0).toLocaleString()}
												</p>
											</div>
											<div className='text-center p-3 bg-red-50 rounded'>
												<p className='text-red-600 font-medium'>Cost</p>
												<p className='text-lg font-bold text-red-800'>
													Tk{(snack.cost || 0).toLocaleString()}
												</p>
											</div>
											<div className='text-center p-3 bg-blue-50 rounded'>
												<p className='text-blue-600 font-medium'>Profit</p>
												<p className='text-lg font-bold text-blue-800'>
													Tk{(snack.profit || 0).toLocaleString()}
												</p>
											</div>
											<div className='text-center p-3 bg-purple-50 rounded'>
												<p className='text-purple-600 font-medium'>Margin</p>
												<p className='text-lg font-bold text-purple-800'>
													{snack.revenue > 0
														? ((snack.profit / snack.revenue) * 100).toFixed(1)
														: 0}
													%
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent
					value='operational'
					className='space-y-6'
				>
					{/* Employee Summary */}
					<Card className='shadow-lg'>
						<CardHeader>
							<CardTitle className='flex items-center'>
								<Users className='h-5 w-5 mr-2' />
								Employee Cost Analysis
							</CardTitle>
							<CardDescription>
								Staff costs and productivity for the selected period
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='overflow-x-auto'>
								<table className='w-full'>
									<thead>
										<tr className='border-b'>
											<th className='text-left p-3'>Employee</th>
											<th className='text-left p-3'>Position</th>
											<th className='text-right p-3'>Monthly Salary</th>
											<th className='text-right p-3'>Period Cost</th>
											<th className='text-right p-3'>Advances</th>
										</tr>
									</thead>
									<tbody>
										{reportData.employeeSummary.map((employee, index) => (
											<tr
												key={index}
												className='border-b hover:bg-gray-50'
											>
												<td className='p-3'>
													<div className='flex items-center space-x-3'>
														<Image
															src={
																employee.avatar ||
																`/placeholder.svg?height=32&width=32`
															}
															width={32}
															height={32}
															alt={employee.name}
															className='w-8 h-8 rounded-full object-cover'
														/>
														<span className='font-medium'>{employee.name}</span>
													</div>
												</td>
												<td className='p-3'>
													<Badge variant='outline'>
														{employee.position || "Staff"}
													</Badge>
												</td>
												<td className='p-3 text-right font-medium'>
													Tk{(employee.salary || 0).toLocaleString()}
												</td>
												<td className='p-3 text-right font-semibold'>
													Tk
													{Math.round(
														employee.estimatedCost || 0
													).toLocaleString()}
												</td>
												<td className='p-3 text-right'>
													Tk
													{(
														employee.advances?.reduce(
															(sum: any, adv: any) => sum + adv.amount,
															0
														) || 0
													).toLocaleString()}
												</td>
											</tr>
										))}
										<tr className='border-t-2 border-gray-300 font-semibold bg-gray-50'>
											<td
												className='p-3'
												colSpan={3}
											>
												Total
											</td>
											<td className='p-3 text-right'>
												Tk
												{Math.round(
													reportData.summary.employeeCosts || 0
												).toLocaleString()}
											</td>
											<td className='p-3 text-right'>
												Tk
												{reportData.employeeSummary
													.reduce(
														(sum, emp) =>
															sum +
															(emp.advances?.reduce(
																(advSum: any, adv: any) => advSum + adv.amount,
																0
															) || 0),
														0
													)
													.toLocaleString()}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
