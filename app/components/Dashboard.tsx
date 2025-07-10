/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Users,
	Package,
	TrendingUp,
	AlertTriangle,
	ChefHat,
} from "lucide-react";
import {
	getEmployees,
	getProducts,
	getProductionEntries,
} from "@/lib/firestore";
import { useEffect, useState } from "react";

export default function Dashboard() {
	type Employee = { id: string; [key: string]: any };
	type Product = {
		id: string;
		name: string;
		currentStock: number;
		lowStockAlertAt: number;
		unit: string;
	};
	type ProductionEntry = {
		id: string;
		productName: string;
		quantity: number;
		date: string;
		totalRevenue: number;
		totalCost: number;
		[key: string]: any;
	};

	const [dashboardData, setDashboardData] = useState<{
		employees: Employee[];
		lowStockItems: Product[];
		recentProduction: ProductionEntry[];
		stats: {
			totalEmployees: number;
			lowStockCount: number;
			todayProduction: number;
			monthlyProfit: number;
		};
	}>({
		employees: [],
		lowStockItems: [],
		recentProduction: [],
		stats: {
			totalEmployees: 0,
			lowStockCount: 0,
			todayProduction: 0,
			monthlyProfit: 0,
		},
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const [employees, productsRaw, productionEntries] = await Promise.all([
					getEmployees(),
					getProducts(),
					getProductionEntries(),
				]);

				// Type assertion to ensure products have the required properties
				const products = productsRaw as Array<{
					id: string;
					name: string;
					currentStock: number;
					lowStockAlertAt: number;
					unit: string;
				}>;

				const lowStockItems = products.filter(
					(p) => p.currentStock <= p.lowStockAlertAt
				);
				const todayEntries = (productionEntries as ProductionEntry[]).filter(
					(entry) =>
						entry &&
						typeof entry.date === "string" &&
						entry.date === new Date().toISOString().split("T")[0]
				);

				setDashboardData({
					employees,
					lowStockItems,
					recentProduction: (productionEntries as any[])
						.filter(
							(entry): entry is ProductionEntry =>
								entry &&
								typeof entry.productName === "string" &&
								typeof entry.quantity === "number" &&
								typeof entry.date === "string" &&
								typeof entry.totalRevenue === "number" &&
								typeof entry.totalCost === "number"
						)
						.slice(0, 4),
					stats: {
						totalEmployees: employees.length,
						lowStockCount: lowStockItems.length,
						todayProduction: todayEntries.reduce(
							(sum, entry) => sum + entry.totalRevenue,
							0
						),
						monthlyProfit: (productionEntries as ProductionEntry[]).reduce(
							(sum, entry) => sum + (entry.totalRevenue - entry.totalCost),
							0
						),
					},
				});
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchDashboardData();
	}, []);

	const stats = [
		{
			title: "Total Employees",
			value: dashboardData.stats.totalEmployees,
			icon: Users,
			color: "text-blue-600",
			bgColor: "bg-blue-100",
		},
		{
			title: "Low Stock Items",
			value: dashboardData.stats.lowStockCount,
			icon: AlertTriangle,
			color: "text-red-600",
			bgColor: "bg-red-100",
		},
		{
			title: "Today's Production",
			value: `₹${dashboardData.stats.todayProduction}`,
			icon: ChefHat,
			color: "text-green-600",
			bgColor: "bg-green-100",
		},
		{
			title: "Monthly Profit",
			value: `₹${dashboardData.stats.monthlyProfit}`,
			icon: TrendingUp,
			color: "text-purple-600",
			bgColor: "bg-purple-100",
		},
	];

	const lowStockItems = dashboardData.lowStockItems.map((item) => ({
		name: item.name,
		current: item.currentStock,
		unit: item.unit,
		alert: item.lowStockAlertAt,
	}));

	const recentProduction = dashboardData.recentProduction.map((item) => ({
		snack: item.productName,
		quantity: item.quantity,
		date: item.date,
	}));

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
				<p className='text-gray-600'>
					Welcome back! Here's what's happening at your hotel.
				</p>
			</div>

			{/* Stats Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{stats.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<Card key={index}>
							<CardContent className='p-6'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm font-medium text-gray-600'>
											{stat.title}
										</p>
										<p className='text-2xl font-bold text-gray-900'>
											{stat.value}
										</p>
									</div>
									<div className={`p-3 rounded-full ${stat.bgColor}`}>
										<Icon className={`h-6 w-6 ${stat.color}`} />
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Alerts */}
			<Alert className='border-red-200 bg-red-50'>
				<AlertTriangle className='h-4 w-4 text-red-600' />
				<AlertDescription className='text-red-800'>
					<strong>{dashboardData.stats.lowStockCount} items</strong> are running
					low on stock. Check inventory to restock.
				</AlertDescription>
			</Alert>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Low Stock Items */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center'>
							<Package className='h-5 w-5 mr-2' />
							Low Stock Alert
						</CardTitle>
						<CardDescription>
							Items that need immediate attention
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='space-y-3'>
							{lowStockItems.map((item, index) => (
								<div
									key={index}
									className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
								>
									<div>
										<p className='font-medium text-gray-900'>{item.name}</p>
										<p className='text-sm text-gray-600'>
											{item.current} {item.unit} remaining
										</p>
									</div>
									<Badge
										variant={item.current === 0 ? "destructive" : "secondary"}
									>
										{item.current === 0 ? "Out of Stock" : "Low Stock"}
									</Badge>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Recent Production */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center'>
							<ChefHat className='h-5 w-5 mr-2' />
							Recent Production
						</CardTitle>
						<CardDescription>Latest snack production entries</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='space-y-3'>
							{recentProduction.map((item, index) => (
								<div
									key={index}
									className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
								>
									<div>
										<p className='font-medium text-gray-900'>{item.snack}</p>
										<p className='text-sm text-gray-600'>{item.date}</p>
									</div>
									<div className='text-right'>
										<p className='font-semibold text-gray-900'>
											{item.quantity}
										</p>
										<p className='text-sm text-gray-600'>units</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
