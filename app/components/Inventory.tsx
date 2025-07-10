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
import { Textarea } from "@/components/ui/textarea";
import {
	Plus,
	Package,
	AlertTriangle,
	TrendingDown,
	Search,
} from "lucide-react";
import { getProducts, Product } from "@/lib/firestore";
import { useEffect } from "react";

export default function Inventory() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const productData = await getProducts();
				setProducts(productData);
			} catch (error) {
				console.error("Error fetching products:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

	const [showAddProduct, setShowAddProduct] = useState(false);
	const [showAddStock, setShowAddStock] = useState(false);
	const [showWastage, setShowWastage] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredProducts = products.filter((product) =>
		product.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const getStockStatus = (product: Product) => {
		if (product.currentStock === 0)
			return { status: "Out of Stock", color: "destructive" as const };
		if (product.currentStock <= product.lowStockAlertAt)
			return { status: "Low Stock", color: "secondary" as const };
		return { status: "In Stock", color: "default" as const };
	};

	const getStockPercentage = (product: Product) => {
		return Math.round((product.currentStock / product.initialStock) * 100);
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>
						Inventory Management
					</h1>
					<p className='text-gray-600'>
						Track and manage your ingredient stock levels
					</p>
				</div>
				<Dialog
					open={showAddProduct}
					onOpenChange={setShowAddProduct}
				>
					<DialogTrigger asChild>
						<Button>
							<Plus className='h-4 w-4 mr-2' />
							Add Product
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Product</DialogTitle>
							<DialogDescription>
								Add a new ingredient to your inventory
							</DialogDescription>
						</DialogHeader>
						<div className='space-y-4'>
							<div>
								<Label htmlFor='productName'>Product Name</Label>
								<Input
									id='productName'
									placeholder='e.g., Flour, Sugar, Oil'
								/>
							</div>
							<div>
								<Label htmlFor='unit'>Unit</Label>
								<Input
									id='unit'
									placeholder='e.g., kg, L, g'
								/>
							</div>
							<div>
								<Label htmlFor='initialStock'>Initial Stock</Label>
								<Input
									id='initialStock'
									type='number'
									placeholder='50'
								/>
							</div>
							<div>
								<Label htmlFor='alertLevel'>Low Stock Alert Level</Label>
								<Input
									id='alertLevel'
									type='number'
									placeholder='10'
								/>
							</div>
							<div>
								<Label htmlFor='wastage'>Estimated Wastage %</Label>
								<Input
									id='wastage'
									type='number'
									placeholder='2'
								/>
							</div>
							<Button className='w-full'>Add Product</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{/* Search Bar */}
			<div className='flex items-center space-x-4'>
				<div className='flex-1 max-w-md'>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
						<Input
							placeholder='Search products...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-10'
						/>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{loading ? (
					<div>Loading...</div>
				) : (
					filteredProducts.map((product) => {
						const stockStatus = getStockStatus(product);
						const stockPercentage = getStockPercentage(product);

						return (
							<motion.div
								key={product.name}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								<Card className='hover:shadow-lg transition-shadow'>
									<CardHeader>
										<div className='flex justify-between items-start'>
											<div>
												<CardTitle className='text-lg flex items-center'>
													<Package className='h-5 w-5 mr-2' />
													{product.name}
												</CardTitle>
												<CardDescription>Unit: {product.unit}</CardDescription>
											</div>
											<Badge variant={stockStatus.color}>
												{stockStatus.status}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className='space-y-4'>
										<div className='space-y-2'>
											<div className='flex justify-between text-sm'>
												<span>Current Stock</span>
												<span className='font-semibold'>
													{product.currentStock} {product.unit}
												</span>
											</div>
											<div className='w-full bg-gray-200 rounded-full h-2'>
												<div
													className={`h-2 rounded-full transition-all ${
														stockPercentage <= 20
															? "bg-red-500"
															: stockPercentage <= 50
															? "bg-yellow-500"
															: "bg-green-500"
													}`}
													style={{ width: `${Math.max(stockPercentage, 5)}%` }}
												/>
											</div>
											<div className='flex justify-between text-xs text-gray-600'>
												<span>0 {product.unit}</span>
												<span>
													{product.initialStock} {product.unit}
												</span>
											</div>
										</div>

										<div className='grid grid-cols-2 gap-4 text-sm'>
											<div>
												<p className='text-gray-600'>Alert Level</p>
												<p className='font-semibold'>
													{product.lowStockAlertAt} {product.unit}
												</p>
											</div>
											<div>
												<p className='text-gray-600'>Wastage</p>
												<p className='font-semibold'>
													{product.estimatedWastagePercent}%
												</p>
											</div>
										</div>

										<div className='flex space-x-2'>
											<Dialog
												open={showAddStock}
												onOpenChange={setShowAddStock}
											>
												<DialogTrigger asChild>
													<Button
														variant='outline'
														size='sm'
														className='flex-1 bg-transparent'
														onClick={() => setSelectedProduct(product)}
													>
														<Plus className='h-4 w-4 mr-1' />
														Add Stock
													</Button>
												</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>Add Stock</DialogTitle>
														<DialogDescription>
															Add new stock for {selectedProduct?.name}
														</DialogDescription>
													</DialogHeader>
													<div className='space-y-4'>
														<div>
															<Label htmlFor='quantity'>
																Quantity ({selectedProduct?.unit})
															</Label>
															<Input
																id='quantity'
																type='number'
																placeholder='10'
															/>
														</div>
														<div>
															<Label htmlFor='note'>Note (Optional)</Label>
															<Textarea
																id='note'
																placeholder='Purchase details, supplier info, etc.'
															/>
														</div>
														<Button className='w-full'>Add Stock</Button>
													</div>
												</DialogContent>
											</Dialog>

											<Dialog
												open={showWastage}
												onOpenChange={setShowWastage}
											>
												<DialogTrigger asChild>
													<Button
														variant='outline'
														size='sm'
														className='flex-1 bg-transparent'
														onClick={() => setSelectedProduct(product)}
													>
														<TrendingDown className='h-4 w-4 mr-1' />
														Wastage
													</Button>
												</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>Record Wastage</DialogTitle>
														<DialogDescription>
															Record wasted stock for {selectedProduct?.name}
														</DialogDescription>
													</DialogHeader>
													<div className='space-y-4'>
														<div>
															<Label htmlFor='wastedQuantity'>
																Wasted Quantity ({selectedProduct?.unit})
															</Label>
															<Input
																id='wastedQuantity'
																type='number'
																placeholder='2'
															/>
														</div>
														<div>
															<Label htmlFor='wastageReason'>Reason</Label>
															<Textarea
																id='wastageReason'
																placeholder='Expired, damaged, spoiled, etc.'
															/>
														</div>
														<Button
															className='w-full'
															variant='destructive'
														>
															Record Wastage
														</Button>
													</div>
												</DialogContent>
											</Dialog>
										</div>

										{product.currentStock <= product.lowStockAlertAt && (
											<div className='flex items-center p-2 bg-red-50 rounded-lg'>
												<AlertTriangle className='h-4 w-4 text-red-600 mr-2' />
												<span className='text-sm text-red-800'>
													{product.currentStock === 0
														? "Out of stock!"
														: "Running low on stock!"}
												</span>
											</div>
										)}
									</CardContent>
								</Card>
							</motion.div>
						);
					})
				)}
			</div>
		</div>
	);
}
