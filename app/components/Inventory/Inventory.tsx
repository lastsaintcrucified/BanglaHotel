/* eslint-disable react-hooks/exhaustive-deps */
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
import { Textarea } from "@/components/ui/textarea";
import {
	Plus,
	Package,
	AlertTriangle,
	TrendingDown,
	Search,
	Loader,
	Edit,
	Trash,
} from "lucide-react";
import {
	addProduct,
	deleteProduct,
	getProducts,
	Product,
	updateProduct,
} from "@/lib/firestore";
import { useEffect } from "react";
import { useFirestoreSearch } from "@/hooks/useFirestoreSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { EditProductDialog } from "./EditInventory";

export default function Inventory() {
	const [products, setProducts] = useState<Product[]>([]);
	const [newProduct, setNewProduct] = useState<Partial<Product>>({
		name: "",
		unit: "",
		initialStock: 0,
		currentStock: 0,
		lowStockAlertAt: 0,
		estimatedWastagePercent: 0,
		category: "",
		pricePerUnit: 0,
		supplier: "",
		expiryDate: "",
		batchNumber: "",
		maxStock: 0,
		reorderLevel: 0,
		lastUpdated: new Date().toISOString(),
	});
	const [loading, setLoading] = useState(false);
	const [showAddProduct, setShowAddProduct] = useState(false);
	const [showAddStock, setShowAddStock] = useState(false);
	const [showWastage, setShowWastage] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const { results, loadingFS, error, search } = useFirestoreSearch<Product>({
		collectionName: "products",
		searchFields: ["name", "category", "supplier"],
	});
	const [showEditDialog, setShowEditDialog] = useState(false);

	// const fetchProducts = async () => {
	// 	try {
	// 		const productData = await getProducts();
	// 		setProducts(productData);
	// 	} catch (error) {
	// 		console.error("Error fetching products:", error);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };
	// useEffect(() => {
	// 	fetchProducts();
	// }, []);
	const debouncedQuery = useDebounce(searchQuery, 300);

	// ✅ Load all employees on mount
	useEffect(() => {
		search("");
	}, []);

	// ✅ Debounced search
	useEffect(() => {
		search(debouncedQuery);
	}, [debouncedQuery]);

	const handleAddProduct = async () => {
		if (
			!newProduct.name ||
			!newProduct.unit ||
			!newProduct.initialStock ||
			!newProduct.currentStock ||
			!newProduct.lowStockAlertAt ||
			!newProduct.category ||
			!newProduct.batchNumber ||
			!newProduct.estimatedWastagePercent ||
			!newProduct.expiryDate ||
			!newProduct.maxStock ||
			!newProduct.pricePerUnit ||
			!newProduct.supplier ||
			!newProduct.reorderLevel
		) {
			toast.error("Need to fill up ll filds");
			return;
		}
		setLoading(true);
		try {
			await addProduct({
				...newProduct,
				currentStock: newProduct.initialStock ?? 0,
				lastUpdated: new Date().toISOString(),
			} as Product);

			toast.success("Product added succesfully!");
			search("");
			setNewProduct({
				name: "",
				unit: "",
				initialStock: 0,
				currentStock: 0,
				lowStockAlertAt: 0,
				estimatedWastagePercent: 0,
				category: "",
				pricePerUnit: 0,
				supplier: "",
				expiryDate: "",
				batchNumber: "",
				maxStock: 0,
				reorderLevel: 0,
				lastUpdated: new Date().toISOString(),
			});
			setShowAddProduct(!showAddProduct);
		} catch (err) {
			console.error("Error adding product", err);
			toast.error("Error adding product");
		} finally {
			setLoading(false);
		}
	};

	// update Product
	const handleUpdateProduct = async (updatedProduct: Partial<Product>) => {
		if (!selectedProduct) return;
		setLoading(true);

		try {
			await updateProduct(selectedProduct.id ?? "", updatedProduct);
			toast.success("Product updated!");
			search("");
			// refresh list or update UI accordingly
		} catch (err) {
			console.error(err);
			toast.error("Failed to update product");
		} finally {
			setLoading(false);
		}
	};
	// delete Product
	const handleDelete = async (id: string, productName: string) => {
		const confirmed = window.confirm(
			`Are you sure you want to delete product "${productName}"? This action cannot be undone.`
		);
		console.log(confirmed);
		if (!confirmed) return;
		setLoading(true);

		try {
			await deleteProduct(id);
			toast.success("Product deleted!");
			search("");
			// refresh list or update UI accordingly
		} catch (err) {
			console.error(err);
			toast.error("Failed to delete product");
		} finally {
			setLoading(false);
		}
	};

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
					<DialogContent className='overflow-y-scroll h-full'>
						<DialogHeader>
							<DialogTitle>Add New Product</DialogTitle>
							<DialogDescription>
								Add a new ingredient to your inventory
							</DialogDescription>
						</DialogHeader>
						<div className='space-y-4'>
							<div>
								<Label
									className='mb-2'
									htmlFor='productName'
								>
									Product Name
								</Label>
								<Input
									id='productName'
									placeholder='e.g., Flour, Sugar, Oil'
									value={newProduct.name}
									onChange={(e) =>
										setNewProduct({ ...newProduct, name: e.target.value })
									}
								/>
							</div>
							<div>
								<Label
									className='mb-2'
									htmlFor='unit'
								>
									Unit
								</Label>
								<Input
									id='unit'
									placeholder='e.g. kg, L, g'
									value={newProduct.unit}
									onChange={(e) =>
										setNewProduct({ ...newProduct, unit: e.target.value })
									}
								/>
							</div>
							<div>
								<Label
									className='mb-2'
									htmlFor='initialStock'
								>
									Initial Stock ({newProduct.unit})
								</Label>
								<Input
									id='initialStock'
									type='number'
									placeholder='50'
									value={newProduct.initialStock}
									onChange={(e) =>
										setNewProduct({
											...newProduct,
											initialStock: Number(e.target.value),
										})
									}
								/>
							</div>
							<div>
								<Label
									className='mb-2'
									htmlFor='currentStock'
								>
									Current Stock ({newProduct.unit})
								</Label>
								<Input
									id='currentStock'
									type='number'
									placeholder='50'
									value={newProduct.currentStock}
									onChange={(e) =>
										setNewProduct({
											...newProduct,
											currentStock: Number(e.target.value),
										})
									}
								/>
							</div>
							<div>
								<Label
									className='mb-2'
									htmlFor='lowStockAlertAt'
								>
									Low Stock Alert Level ({newProduct.unit})
								</Label>
								<Input
									id='lowStockAlertAt'
									type='number'
									placeholder='10'
									value={newProduct.lowStockAlertAt}
									onChange={(e) =>
										setNewProduct({
											...newProduct,
											lowStockAlertAt: Number(e.target.value),
										})
									}
								/>
							</div>
							<div>
								<Label
									className='mb-2'
									htmlFor='estimatedWastagePercent'
								>
									Estimated Wastage (0-100)%
								</Label>
								<Input
									id='estimatedWastagePercent'
									type='number'
									placeholder='2'
									value={newProduct.estimatedWastagePercent}
									onChange={(e) =>
										setNewProduct({
											...newProduct,
											estimatedWastagePercent: Number(e.target.value),
										})
									}
								/>
							</div>
							<div>
								<Label
									className='mb-2'
									htmlFor='category'
								>
									Product Category
								</Label>
								<Input
									id='category'
									placeholder='e.g., Spices, Vegs, Non-veg, Dairy, Carbs'
									value={newProduct.category}
									onChange={(e) =>
										setNewProduct({ ...newProduct, category: e.target.value })
									}
								/>
							</div>
							<div>
								<Label
									className='mb-2'
									htmlFor='pricePerUnit'
								>
									Price per unit ({newProduct.unit})
								</Label>
								<Input
									id='pricePerUnit'
									type='number'
									placeholder='2'
									value={newProduct.pricePerUnit}
									onChange={(e) =>
										setNewProduct({
											...newProduct,
											pricePerUnit: Number(e.target.value),
										})
									}
								/>
							</div>
							<div>
								<Label
									className='mb-2'
									htmlFor='supplier'
								>
									Supplier
								</Label>
								<Input
									id='supplier'
									placeholder='xyz Ltd.'
									value={newProduct.supplier}
									onChange={(e) =>
										setNewProduct({ ...newProduct, supplier: e.target.value })
									}
								/>
							</div>
							<div>
								<Label
									className='mb-2'
									htmlFor='expiryDate'
								>
									Expiry Date:
								</Label>
								<Input
									id='expiryDate'
									type='date'
									value={newProduct.expiryDate}
									onChange={(e) =>
										setNewProduct({ ...newProduct, expiryDate: e.target.value })
									}
								/>
							</div>
							<div>
								<Label
									className='mb-2'
									htmlFor='batchNumber'
								>
									Batch no.
								</Label>
								<Input
									id='batchNumber'
									placeholder='e.g. X-345345'
									value={newProduct.batchNumber}
									onChange={(e) =>
										setNewProduct({
											...newProduct,
											batchNumber: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<Label
									className='mb-2'
									htmlFor='maxStock'
								>
									Maximum Stock (kg)
								</Label>
								<Input
									id='maxStock'
									type='number'
									placeholder='2'
									value={newProduct.maxStock}
									onChange={(e) =>
										setNewProduct({
											...newProduct,
											maxStock: Number(e.target.value),
										})
									}
								/>
							</div>
							<div>
								<Label
									className='mb-2'
									htmlFor='reorderLevel'
								>
									Re-order Level(1-10)
								</Label>
								<Input
									id='reorderLevel'
									type='number'
									placeholder='2'
									value={newProduct.reorderLevel}
									onChange={(e) =>
										setNewProduct({
											...newProduct,
											reorderLevel: Number(e.target.value),
										})
									}
								/>
							</div>
							<Button
								className='w-full'
								onClick={handleAddProduct}
							>
								{loading ? <Loader /> : "Add Product"}
							</Button>
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
							placeholder='Search products by name or category or supplier name...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-10'
						/>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{loading ? (
					<Loader className='place-self-center h-10 w-10' />
				) : (
					results.map((product) => {
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
											<div className='flex flex-row justify-end items-center -mr-2'>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => {
														setSelectedProduct(product);
														setShowEditDialog(true);
													}}
												>
													<Edit className='h-4 w-4 text-green-600 ' />
												</Button>
												<Button
													variant='ghost'
													size='sm'
													onClick={() =>
														handleDelete(product.id ?? "", product.name)
													}
												>
													<Trash className='h-5 w-5 text-red-600 fill-orange-300' />
												</Button>
											</div>
											{selectedProduct && (
												<EditProductDialog
													product={selectedProduct}
													open={showEditDialog}
													onOpenChange={setShowEditDialog}
													onUpdate={handleUpdateProduct}
													loading={loading}
												/>
											)}
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
