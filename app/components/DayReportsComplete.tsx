/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	TrendingUp,
	DollarSign,
	Package,
	Users,
	Download,
	ArrowLeft,
	ArrowRight,
	FileText,
	BarChart3,
	Clock,
	Target,
	AlertCircle,
} from "lucide-react";
import {
	getEmployees,
	getProducts,
	getProductionEntries,
} from "@/lib/firestore";
import Image from "next/image";
type Ingredient = {
	productName: string;
	amountPerUnit: number;
	unit: string;
};

type NutritionalInfo = {
	calories: number;
	carbs: number;
	fat: number;
	protein: number;
};
export interface SnackProduced {
	id?: string;
	name: string;
	description: string;
	category: string;
	costPerUnit: number;
	sellingPrice: number;
	popularity: number;
	difficulty: "Easy" | "Medium" | "Hard";
	preparationTime: number;
	recipe: Ingredient[];
	nutritionalInfo: NutritionalInfo;
}

interface IngredientUsed {
	name: string;
	quantity: number;
	unit: string;
	cost: number;
}

interface EmployeeAttendance {
	name: string;
	avatar?: string;
	status: string;
	hours: number;
}

interface Expense {
	category: string;
	amount: number;
}
type SnackProductionEntry = {
	snackName: string;
	quantity: number;
	cost: number;
	revenue: number;
};
export interface ProductionEntry {
	id?: string; // Firestore document ID
	date: string; // e.g. "2025-06-14"
	customerCount: number;
	netProfit: number;
	totalCost: number;
	totalRevenue: number;

	weather: string;
	notes: string;

	employeesPresent: string[]; // names of employees
	snacksProduced: SnackProductionEntry[];
}

export default function DayReportsComplete() {
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().split("T")[0]
	);
	const [dayData, setDayData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [comparisonData, setComparisonData] = useState<any>(null);
	const [exportFormat, setExportFormat] = useState("pdf");

	const fetchDayData = async (date: string) => {
		setLoading(true);
		try {
			const [employees, products, productionEntries] = await Promise.all([
				getEmployees(),
				getProducts(),
				getProductionEntries(date, date),
			]);

			const typedProductionEntries = productionEntries as ProductionEntry[];
			const dayEntry = typedProductionEntries.find(
				(entry) => entry.date === date
			);

			if (!dayEntry) {
				setDayData({
					date,
					hasData: false,
					totalRevenue: 0,
					totalCost: 0,
					netProfit: 0,
					profitMargin: 0,
					snacksProduced: [],
					ingredientsUsed: [],
					employeeAttendance: employees.map((emp) => ({
						...emp,
						status: "Unknown",
						hours: 0,
					})),
					expenses: [],
					alerts: ["No production data found for this date"],
					recommendations: [
						"Consider recording production data for better tracking",
					],
				});
				return;
			}

			// Calculate ingredient usage based on production
			const ingredientsUsed = [];
			const ingredientMap = new Map();

			dayEntry.snacksProduced?.forEach((snack: SnackProductionEntry) => {
				// This would normally come from recipe data
				const estimatedIngredients = [
					{
						name: "Flour",
						quantity: snack.quantity * 0.05,
						unit: "kg",
						costPerUnit: 55,
					},
					{
						name: "Oil",
						quantity: snack.quantity * 0.02,
						unit: "L",
						costPerUnit: 135,
					},
					{
						name: "Spices",
						quantity: snack.quantity * 0.01,
						unit: "kg",
						costPerUnit: 200,
					},
				];

				estimatedIngredients.forEach((ing) => {
					if (ingredientMap.has(ing.name)) {
						const existing = ingredientMap.get(ing.name);
						existing.quantity += ing.quantity;
						existing.cost += ing.quantity * ing.costPerUnit;
					} else {
						ingredientMap.set(ing.name, {
							name: ing.name,
							quantity: ing.quantity,
							unit: ing.unit,
							cost: ing.quantity * ing.costPerUnit,
						});
					}
				});
			});

			const ingredientsArray = Array.from(ingredientMap.values());

			// Generate alerts and recommendations
			const alerts = [];
			const recommendations = [];

			if ((dayEntry.totalRevenue ?? 0) < 5000) {
				alerts.push("Revenue below average target");
				recommendations.push(
					"Consider promotional activities or menu optimization"
				);
			}

			if ((dayEntry.netProfit ?? 0) < 40) {
				alerts.push("Profit margin below optimal range");
				recommendations.push("Review ingredient costs and pricing strategy");
			}

			// Employee attendance (simulated based on production)
			const employeeAttendance = employees.map((emp) => ({
				...emp,
				status: dayEntry.employeesPresent?.includes(emp.name)
					? "Present"
					: "Absent",
				hours: dayEntry.employeesPresent?.includes(emp.name) ? 8 : 0,
			}));

			const expenses = [
				{
					category: "Ingredients",
					amount: ingredientsArray.reduce((sum, ing) => sum + ing.cost, 0),
				},
				{
					category: "Labor",
					amount:
						employeeAttendance.filter((emp) => emp.status === "Present")
							.length * 500,
				},
				{ category: "Utilities", amount: 300 },
				{ category: "Other", amount: 150 },
			];

			setDayData({
				date,
				hasData: true,
				totalRevenue: dayEntry.totalRevenue || 0,
				totalCost: dayEntry.totalCost || 0,
				netProfit:
					dayEntry.netProfit ||
					(dayEntry.totalRevenue ?? 0) - (dayEntry.totalCost ?? 0) ||
					0,
				profitMargin:
					(dayEntry.totalRevenue ?? 0) > 0
						? ((dayEntry.netProfit ||
								(dayEntry.totalRevenue ?? 0) - (dayEntry.totalCost ?? 0)) /
								(dayEntry.totalRevenue ?? 0)) *
						  100
						: 0,
				snacksProduced: dayEntry.snacksProduced || [],
				ingredientsUsed: ingredientsArray,
				employeeAttendance,
				expenses,
				alerts,
				recommendations,
				notes: dayEntry.notes || "",
				weather: "Sunny", // This could be fetched from weather API
				customerCount: Math.floor((dayEntry.totalRevenue ?? 0) / 25), // Estimated based on average order value
				peakHours: "12:00 PM - 2:00 PM, 7:00 PM - 9:00 PM",
			});

			// Fetch comparison data (previous day)
			const previousDate = new Date(date);
			previousDate.setDate(previousDate.getDate() - 1);
			const prevDateStr = previousDate.toISOString().split("T")[0];

			const prevEntries = await getProductionEntries(prevDateStr, prevDateStr);
			const prevEntry = prevEntries.find((entry) => entry.date === prevDateStr);

			if (prevEntry) {
				setComparisonData({
					revenue: (dayEntry.totalRevenue ?? 0) - (prevEntry.totalRevenue ?? 0),
					profit: (dayEntry.netProfit || 0) - (prevEntry.netProfit || 0),
					items:
						dayEntry.snacksProduced?.reduce(
							(sum: any, snack: any) => sum + snack.quantity,
							0
						) -
						(prevEntry.snacksProduced?.reduce(
							(sum: any, snack: any) => sum + snack.quantity,
							0
						) || 0),
				});
			}
		} catch (error) {
			console.error("Error fetching day data:", error);
			setDayData({
				date,
				hasData: false,
				error: "Failed to load data",
			});
		} finally {
			setLoading(false);
		}
	};

	const navigateDate = (direction: any) => {
		const currentDate = new Date(selectedDate);
		if (direction === "prev") {
			currentDate.setDate(currentDate.getDate() - 1);
		} else {
			currentDate.setDate(currentDate.getDate() + 1);
		}
		const newDate = currentDate.toISOString().split("T")[0];
		setSelectedDate(newDate);
		fetchDayData(newDate);
	};

	const exportReport = () => {
		const reportContent = {
			date: selectedDate,
			data: dayData,
			generatedAt: new Date().toISOString(),
			format: exportFormat,
		};

		if (exportFormat === "json") {
			const blob = new Blob([JSON.stringify(reportContent, null, 2)], {
				type: "application/json",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `daily-report-${selectedDate}.json`;
			a.click();
		} else if (exportFormat === "csv") {
			let csvContent = "Metric,Value\n";
			csvContent += `Date,${selectedDate}\n`;
			csvContent += `Revenue,${dayData?.totalRevenue || 0}\n`;
			csvContent += `Cost,${dayData?.totalCost || 0}\n`;
			csvContent += `Profit,${dayData?.netProfit || 0}\n`;
			csvContent += `Profit Margin,${dayData?.profitMargin || 0}%\n`;

			const blob = new Blob([csvContent], { type: "text/csv" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `daily-report-${selectedDate}.csv`;
			a.click();
		}
	};

	const formatDate = (dateString: any) => {
		return new Date(dateString).toLocaleDateString("en-GB", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	useEffect(() => {
		fetchDayData(selectedDate);
	}, []);

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-96'>
				<div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600'></div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'>
						Daily Report
					</h1>
					<p className='text-gray-600'>Comprehensive daily business analysis</p>
				</div>
				<div className='flex space-x-2'>
					<Select
						value={exportFormat}
						onValueChange={setExportFormat}
					>
						<SelectTrigger className='w-24'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='pdf'>PDF</SelectItem>
							<SelectItem value='csv'>CSV</SelectItem>
							<SelectItem value='json'>JSON</SelectItem>
						</SelectContent>
					</Select>
					<Button
						onClick={exportReport}
						disabled={!dayData?.hasData}
					>
						<Download className='h-4 w-4 mr-2' />
						Export
					</Button>
				</div>
			</div>

			{/* Date Navigation */}
			<Card className='shadow-lg border-0 bg-gradient-to-r from-blue-50 to-green-50'>
				<CardContent className='p-6'>
					<div className='flex items-center justify-between'>
						<Button
							variant='outline'
							onClick={() => navigateDate("prev")}
						>
							<ArrowLeft className='h-4 w-4 mr-2' />
							Previous Day
						</Button>

						<div className='flex items-center space-x-4'>
							<Label htmlFor='reportDate'>Select Date:</Label>
							<Input
								id='reportDate'
								type='date'
								value={selectedDate}
								onChange={(e) => {
									setSelectedDate(e.target.value);
									fetchDayData(e.target.value);
								}}
								className='w-auto'
							/>
						</div>

						<Button
							variant='outline'
							onClick={() => navigateDate("next")}
						>
							Next Day
							<ArrowRight className='h-4 w-4 ml-2' />
						</Button>
					</div>

					<div className='text-center mt-4'>
						<h2 className='text-2xl font-semibold'>
							{formatDate(selectedDate)}
						</h2>
						{dayData?.weather && (
							<p className='text-sm text-gray-600 mt-1'>
								Weather: {dayData.weather}
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Alerts */}
			{dayData?.alerts && dayData.alerts.length > 0 && (
				<div className='space-y-2'>
					{dayData.alerts.map((alert: any, index: any) => (
						<Alert
							key={index}
							className='border-orange-200 bg-orange-50'
						>
							<AlertCircle className='h-4 w-4 text-orange-600' />
							<AlertDescription className='text-orange-800'>
								{alert}
							</AlertDescription>
						</Alert>
					))}
				</div>
			)}

			{!dayData?.hasData ? (
				<Card className='shadow-lg'>
					<CardContent className='p-12 text-center'>
						<FileText className='h-16 w-16 text-gray-400 mx-auto mb-4' />
						<h3 className='text-xl font-semibold text-gray-700 mb-2'>
							No Data Available
						</h3>
						<p className='text-gray-600 mb-4'>
							No production data found for {formatDate(selectedDate)}
						</p>
						<Button onClick={() => fetchDayData(selectedDate)}>
							Refresh Data
						</Button>
					</CardContent>
				</Card>
			) : (
				<>
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
												Tk{dayData.totalRevenue.toLocaleString()}
											</p>
											{comparisonData && (
												<p
													className={`text-xs mt-1 ${
														comparisonData.revenue >= 0
															? "text-green-600"
															: "text-red-600"
													}`}
												>
													{comparisonData.revenue >= 0 ? "+" : ""}Tk
													{comparisonData.revenue.toLocaleString()} vs yesterday
												</p>
											)}
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
												Tk{dayData.netProfit.toLocaleString()}
											</p>
											<p className='text-xs text-blue-600 mt-1'>
												Margin: {dayData.profitMargin.toFixed(1)}%
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
												{dayData.snacksProduced.reduce(
													(sum: any, item: any) => sum + item.quantity,
													0
												)}
											</p>
											<p className='text-xs text-purple-600 mt-1'>
												{dayData.snacksProduced.length} varieties
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
												Customers Served
											</p>
											<p className='text-2xl font-bold text-orange-800'>
												{dayData.customerCount}
											</p>
											<p className='text-xs text-orange-600 mt-1'>
												Avg: Tk
												{dayData.customerCount > 0
													? Math.round(
															dayData.totalRevenue / dayData.customerCount
													  )
													: 0}
												/customer
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

					{/* Business Insights */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<Card className='shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-indigo-100'>
							<CardHeader>
								<CardTitle className='flex items-center text-indigo-700'>
									<Clock className='h-5 w-5 mr-2' />
									Peak Hours
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-indigo-800 font-medium'>
									{dayData.peakHours}
								</p>
								<p className='text-sm text-indigo-600 mt-2'>
									Highest customer traffic periods
								</p>
							</CardContent>
						</Card>

						<Card className='shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-emerald-100'>
							<CardHeader>
								<CardTitle className='flex items-center text-emerald-700'>
									<Target className='h-5 w-5 mr-2' />
									Performance
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-2'>
									<div className='flex justify-between'>
										<span className='text-sm text-emerald-600'>
											Revenue Target
										</span>
										<span className='font-medium text-emerald-800'>
											{dayData.totalRevenue >= 8000 ? "✅" : "⚠️"}{" "}
											{((dayData.totalRevenue / 8000) * 100).toFixed(0)}%
										</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-sm text-emerald-600'>
											Profit Target
										</span>
										<span className='font-medium text-emerald-800'>
											{dayData.profitMargin >= 45 ? "✅" : "⚠️"}{" "}
											{dayData.profitMargin.toFixed(1)}%
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className='shadow-lg border-0 bg-gradient-to-br from-rose-50 to-rose-100'>
							<CardHeader>
								<CardTitle className='flex items-center text-rose-700'>
									<BarChart3 className='h-5 w-5 mr-2' />
									Top Seller
								</CardTitle>
							</CardHeader>
							<CardContent>
								{dayData.snacksProduced.length > 0 && (
									<div>
										<p className='font-medium text-rose-800'>
											{
												dayData.snacksProduced.reduce(
													(top: any, current: any) =>
														current.quantity > top.quantity ? current : top
												).snackName
											}
										</p>
										<p className='text-sm text-rose-600 mt-1'>
											{
												dayData.snacksProduced.reduce(
													(top: any, current: any) =>
														current.quantity > top.quantity ? current : top
												).quantity
											}{" "}
											units sold
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Detailed Sections */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						{/* Production Breakdown */}
						<Card className='shadow-lg'>
							<CardHeader>
								<CardTitle>Production Breakdown</CardTitle>
								<CardDescription>
									Items produced and their performance
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									{dayData.snacksProduced.map((snack: any, index: any) => (
										<motion.div
											key={index}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.1 }}
											className='space-y-2'
										>
											<div className='flex justify-between items-center'>
												<span className='font-medium'>{snack.snackName}</span>
												<Badge variant='outline'>{snack.quantity} units</Badge>
											</div>
											<div className='grid grid-cols-3 gap-2 text-sm'>
												<div className='text-center p-2 bg-green-50 rounded'>
													<p className='text-green-600'>Revenue</p>
													<p className='font-semibold'>Tk{snack.revenue}</p>
												</div>
												<div className='text-center p-2 bg-red-50 rounded'>
													<p className='text-red-600'>Cost</p>
													<p className='font-semibold'>Tk{snack.cost}</p>
												</div>
												<div className='text-center p-2 bg-blue-50 rounded'>
													<p className='text-blue-600'>Profit</p>
													<p className='font-semibold'>
														Tk{snack.revenue - snack.cost}
													</p>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Ingredients Used */}
						<Card className='shadow-lg'>
							<CardHeader>
								<CardTitle>Ingredients Consumed</CardTitle>
								<CardDescription>Raw materials used today</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									{dayData.ingredientsUsed.map(
										(ingredient: any, index: any) => (
											<div
												key={index}
												className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'
											>
												<div>
													<p className='font-medium'>{ingredient.name}</p>
													<p className='text-sm text-gray-600'>
														{ingredient.quantity.toFixed(2)} {ingredient.unit}
													</p>
												</div>
												<div className='text-right'>
													<p className='font-semibold'>
														Tk{Math.round(ingredient.cost)}
													</p>
												</div>
											</div>
										)
									)}
									<div className='border-t pt-3 mt-3'>
										<div className='flex justify-between items-center font-semibold'>
											<span>Total Ingredient Cost</span>
											<span>
												Tk
												{Math.round(
													dayData.ingredientsUsed.reduce(
														(sum: any, item: any) => sum + item.cost,
														0
													)
												)}
											</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Employee Attendance */}
						<Card className='shadow-lg'>
							<CardHeader>
								<CardTitle className='flex items-center'>
									<Users className='h-5 w-5 mr-2' />
									Employee Attendance
								</CardTitle>
								<CardDescription>Staff attendance and hours</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									{dayData.employeeAttendance.map(
										(employee: any, index: any) => (
											<div
												key={index}
												className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
											>
												<div className='flex items-center space-x-3'>
													<Image
														src={
															employee.avatar ||
															`/placeholder.svg?height=32&width=32`
														}
														alt={employee.name}
														width={32}
														height={32}
														className='w-8 h-8 rounded-full object-cover'
													/>
													<div>
														<p className='font-medium'>{employee.name}</p>
														<p className='text-sm text-gray-600'>
															{employee.hours} hours
														</p>
													</div>
												</div>
												<Badge
													variant={
														employee.status === "Present"
															? "default"
															: "secondary"
													}
												>
													{employee.status}
												</Badge>
											</div>
										)
									)}
								</div>
							</CardContent>
						</Card>

						{/* Expense Breakdown */}
						<Card className='shadow-lg'>
							<CardHeader>
								<CardTitle>Expense Breakdown</CardTitle>
								<CardDescription>Daily cost categories</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									{dayData.expenses.map((expense: any, index: any) => (
										<div
											key={index}
											className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'
										>
											<span className='font-medium'>{expense.category}</span>
											<span className='font-semibold'>Tk{expense.amount}</span>
										</div>
									))}
									<div className='border-t pt-3 mt-3'>
										<div className='flex justify-between items-center font-semibold text-lg'>
											<span>Total Expenses</span>
											<span>
												Tk
												{dayData.expenses.reduce(
													(sum: any, item: any) => sum + item.amount,
													0
												)}
											</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Recommendations */}
					{dayData.recommendations && dayData.recommendations.length > 0 && (
						<Card className='shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100'>
							<CardHeader>
								<CardTitle className='flex items-center text-yellow-700'>
									<Target className='h-5 w-5 mr-2' />
									Recommendations
								</CardTitle>
								<CardDescription>
									Suggestions to improve performance
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='space-y-2'>
									{dayData.recommendations.map((rec: any, index: any) => (
										<div
											key={index}
											className='flex items-start space-x-2'
										>
											<div className='w-2 h-2 bg-yellow-500 rounded-full mt-2'></div>
											<p className='text-yellow-800'>{rec}</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Notes */}
					{dayData.notes && (
						<Card className='shadow-lg'>
							<CardHeader>
								<CardTitle className='flex items-center'>
									<FileText className='h-5 w-5 mr-2' />
									Daily Notes
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-700 whitespace-pre-wrap'>
									{dayData.notes}
								</p>
							</CardContent>
						</Card>
					)}
				</>
			)}
		</div>
	);
}
