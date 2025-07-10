/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Plus,
	ClipboardList,
	AlertTriangle,
	CheckCircle,
	Calendar,
} from "lucide-react";
import { getProductionEntries, getSnacks } from "@/lib/firestore";
import { useEffect } from "react";
import { ProductionEntry, SnackProduced } from "./DayReportsComplete";

export default function Production() {
	const [productionEntries, setProductionEntries] = useState<ProductionEntry[]>(
		[]
	);
	const [snacks, setSnacks] = useState<SnackProduced[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAddProduction, setShowAddProduction] = useState(false);
	const [newProduction, setNewProduction] = useState<ProductionEntry[]>([]);
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().split("T")[0]
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [productionData, snackData] = await Promise.all([
					getProductionEntries(),
					getSnacks(),
				]);
				setProductionEntries(productionData);
				setSnacks(snackData);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const addProductionItem = () => {
		setNewProduction([...newProduction]);
	};

	const removeProductionItem = (index: any) => {
		setNewProduction(newProduction.filter((_, i) => i !== index));
	};

	const calculateTotalRevenue = (productions: any) => {
		return productions.reduce((total: any, item: any) => {
			const snack = snacks.find((s) => s.snackName === item.snackName);
			return total + (snack ? snack.sellingPrice * item.quantity : 0);
		}, 0);
	};

	const getTodayProduction = () => {
		const today = new Date().toISOString().split("T")[0];
		return productionEntries.find((entry) => entry.date === today);
	};

	const todayProduction = getTodayProduction();

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>
						Daily Production Entry
					</h1>
					<p className='text-gray-600'>
						Record daily snack production and track inventory usage
					</p>
				</div>
				<Dialog
					open={showAddProduction}
					onOpenChange={setShowAddProduction}
				>
					<DialogTrigger asChild>
						<Button>
							<Plus className='h-4 w-4 mr-2' />
							Add Production
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-2xl'>
						<DialogHeader>
							<DialogTitle>Add Production Entry</DialogTitle>
							<DialogDescription>
								Record today's snack production quantities
							</DialogDescription>
						</DialogHeader>
						<div className='space-y-4'>
							<div>
								<Label htmlFor='productionDate'>Production Date</Label>
								<Input
									id='productionDate'
									type='date'
									value={selectedDate}
									onChange={(e) => setSelectedDate(e.target.value)}
								/>
							</div>

							<div>
								<div className='flex justify-between items-center mb-2'>
									<Label>Production Items</Label>
									<Button
										type='button'
										variant='outline'
										size='sm'
										onClick={addProductionItem}
									>
										<Plus className='h-4 w-4 mr-1' />
										Add Item
									</Button>
								</div>

								<div className='space-y-2 max-h-60 overflow-y-auto'>
									{newProduction.map((item, index) => (
										<div
											key={index}
											className='flex gap-2 items-center p-2 border rounded'
										>
											<select className='flex-1 p-2 border rounded'>
												<option value=''>Select snack</option>
												{snacks.map((snack) => (
													<option
														key={snack.snackName}
														value={snack.snackName}
													>
														{snack.snackName} (Tk{snack.sellingPrice})
													</option>
												))}
											</select>
											<Input
												type='number'
												placeholder='Quantity'
												className='w-24'
											/>
											<Button
												type='button'
												variant='ghost'
												size='icon'
												onClick={() => removeProductionItem(index)}
											>
												×
											</Button>
										</div>
									))}
								</div>
							</div>

							<Alert>
								<AlertTriangle className='h-4 w-4' />
								<AlertDescription>
									Adding production will automatically deduct ingredients from
									inventory based on recipes.
								</AlertDescription>
							</Alert>

							<Button className='w-full'>Record Production</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{/* Today's Status */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center'>
						<Calendar className='h-5 w-5 mr-2' />
						Today's Production Status
					</CardTitle>
					<CardDescription>
						{new Date().toLocaleDateString("en-GB", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{todayProduction ? (
						<div className='space-y-4'>
							<div className='flex items-center text-green-600'>
								<CheckCircle className='h-5 w-5 mr-2' />
								<span className='font-medium'>
									Production recorded for today
								</span>
							</div>
							<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
								{todayProduction?.snacksProduced?.map((item, index) => (
									<div
										key={index}
										className='text-center p-3 bg-gray-50 rounded-lg'
									>
										<p className='font-semibold'>{item.snackName}</p>
										<p className='text-2xl font-bold text-blue-600'>
											{item.quantity}
										</p>
										<p className='text-sm text-gray-600'>Tk{item.revenue}</p>
									</div>
								))}
							</div>
							<div className='text-center p-4 bg-green-50 rounded-lg'>
								<p className='text-sm text-green-600'>Total Revenue</p>
								<p className='text-3xl font-bold text-green-800'>
									Tk{todayProduction.totalRevenue}
								</p>
							</div>
						</div>
					) : (
						<div className='text-center py-8'>
							<ClipboardList className='h-12 w-12 text-gray-400 mx-auto mb-4' />
							<p className='text-gray-600 mb-4'>
								No production recorded for today
							</p>
							<Button onClick={() => setShowAddProduction(true)}>
								Record Today's Production
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Production History */}
			<div>
				<h2 className='text-xl font-semibold mb-4'>Production History</h2>
				<div className='space-y-4'>
					{productionEntries.map((entry, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
						>
							<Card>
								<CardHeader>
									<div className='flex justify-between items-center'>
										<div>
											<CardTitle className='text-lg'>
												{new Date(entry.date).toLocaleDateString("en-GB", {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</CardTitle>
											<CardDescription>
												{entry.snacksProduced?.length} items produced
											</CardDescription>
										</div>
										<Badge
											variant='outline'
											className='text-green-600'
										>
											Tk{entry.totalRevenue}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
										{entry.snacksProduced?.map((item, itemIndex) => (
											<div
												key={itemIndex}
												className='text-center p-3 bg-gray-50 rounded-lg'
											>
												<p className='font-medium text-gray-900'>
													{item.snackName}
												</p>
												<p className='text-xl font-bold text-blue-600'>
													{item.quantity}
												</p>
												<p className='text-sm text-gray-600'>
													Tk{item.revenue}
												</p>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
}
