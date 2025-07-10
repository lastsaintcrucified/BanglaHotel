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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, ChefHat, Edit, Trash2, Calculator, Search } from "lucide-react";
import { getSnacks, getProducts } from "@/lib/firestore";
import { useEffect } from "react";

export default function Snacks() {
	const [snacks, setSnacks] = useState<
		Array<{
			id: string;
			name: string;
			sellingPrice: number;
			costPerUnit: number;
			recipe: Array<{
				productId: string;
				productName: string;
				amountPerUnit: number;
			}>;
		}>
	>([]);
	const [products, setProducts] = useState<
		Array<{ id: string; name: string; unit: string }>
	>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [snackData, productData] = await Promise.all([
					getSnacks(),
					getProducts(),
				]);
				setSnacks(
					snackData.map((snack: any) => ({
						id: snack.id,
						name: snack.name ?? "",
						sellingPrice: snack.sellingPrice ?? 0,
						costPerUnit: snack.costPerUnit ?? 0,
						recipe: snack.recipe ?? [],
					}))
				);
				setProducts(
					productData.map((product: any) => ({
						id: product.id,
						name: product.name ?? "",
						unit: product.unit ?? "",
					}))
				);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const [showAddSnack, setShowAddSnack] = useState(false);
	const [showEditSnack, setShowEditSnack] = useState(false);
	const [selectedSnack, setSelectedSnack] = useState(null);
	const [newRecipe, setNewRecipe] = useState<
		Array<{ productId: string; amountPerUnit: number }>
	>([]);

	const [searchQuery, setSearchQuery] = useState("");

	const filteredSnacks = snacks.filter((snack) =>
		snack.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const calculateProfitMargin = (snack: any) => {
		return Math.round(
			((snack.sellingPrice - snack.costPerUnit) / snack.sellingPrice) * 100
		);
	};

	const addRecipeItem = () => {
		setNewRecipe([...newRecipe, { productId: "", amountPerUnit: 0 }]);
	};

	const removeRecipeItem = (index: any) => {
		setNewRecipe(newRecipe.filter((_, i) => i !== index));
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>Snack Recipes</h1>
					<p className='text-gray-600'>
						Manage your snack recipes and calculate costs
					</p>
				</div>
				<Dialog
					open={showAddSnack}
					onOpenChange={setShowAddSnack}
				>
					<DialogTrigger asChild>
						<Button>
							<Plus className='h-4 w-4 mr-2' />
							Add Recipe
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-2xl'>
						<DialogHeader>
							<DialogTitle>Add New Snack Recipe</DialogTitle>
							<DialogDescription>
								Create a new recipe with ingredients and costs
							</DialogDescription>
						</DialogHeader>
						<div className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='snackName'>Snack Name</Label>
									<Input
										id='snackName'
										placeholder='e.g., Singara, Roll'
									/>
								</div>
								<div>
									<Label htmlFor='sellingPrice'>Selling Price (Tk)</Label>
									<Input
										id='sellingPrice'
										type='number'
										placeholder='15'
									/>
								</div>
							</div>

							<div>
								<div className='flex justify-between items-center mb-2'>
									<Label>Recipe Ingredients</Label>
									<Button
										type='button'
										variant='outline'
										size='sm'
										onClick={addRecipeItem}
									>
										<Plus className='h-4 w-4 mr-1' />
										Add Ingredient
									</Button>
								</div>

								<div className='space-y-2 max-h-60 overflow-y-auto'>
									{newRecipe.map((item, index) => (
										<div
											key={index}
											className='flex gap-2 items-center p-2 border rounded'
										>
											<Select>
												<SelectTrigger className='flex-1'>
													<SelectValue placeholder='Select ingredient' />
												</SelectTrigger>
												<SelectContent>
													{products.map((product) => (
														<SelectItem
															key={product.id}
															value={product.id}
														>
															{product.name} ({product.unit})
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Input
												type='number'
												placeholder='Amount'
												className='w-24'
												step='0.001'
											/>
											<Button
												type='button'
												variant='ghost'
												size='icon'
												onClick={() => removeRecipeItem(index)}
											>
												<Trash2 className='h-4 w-4' />
											</Button>
										</div>
									))}
								</div>
							</div>

							<Button className='w-full'>Create Recipe</Button>
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
							placeholder='Search snacks...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-10'
						/>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{filteredSnacks.map((snack) => {
					const profitMargin = calculateProfitMargin(snack);

					return (
						<motion.div
							key={snack.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							<Card className='hover:shadow-lg transition-shadow'>
								<CardHeader>
									<div className='flex justify-between items-start'>
										<div>
											<CardTitle className='text-xl flex items-center'>
												<ChefHat className='h-5 w-5 mr-2' />
												{snack.name}
											</CardTitle>
											<CardDescription>
												{snack.recipe.length} ingredients
											</CardDescription>
										</div>
										<div className='flex space-x-2'>
											<Button
												variant='ghost'
												size='icon'
											>
												<Edit className='h-4 w-4' />
											</Button>
											<Button
												variant='ghost'
												size='icon'
											>
												<Trash2 className='h-4 w-4' />
											</Button>
										</div>
									</div>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='grid grid-cols-3 gap-4 text-center'>
										<div className='p-3 bg-blue-50 rounded-lg'>
											<p className='text-sm text-blue-600'>Cost</p>
											<p className='text-lg font-bold text-blue-800'>
												Tk{snack.costPerUnit}
											</p>
										</div>
										<div className='p-3 bg-green-50 rounded-lg'>
											<p className='text-sm text-green-600'>Selling</p>
											<p className='text-lg font-bold text-green-800'>
												Tk{snack.sellingPrice}
											</p>
										</div>
										<div className='p-3 bg-purple-50 rounded-lg'>
											<p className='text-sm text-purple-600'>Profit</p>
											<p className='text-lg font-bold text-purple-800'>
												{profitMargin}%
											</p>
										</div>
									</div>

									<div>
										<h4 className='font-semibold mb-2 flex items-center'>
											<Calculator className='h-4 w-4 mr-2' />
											Recipe (per unit)
										</h4>
										<div className='space-y-2'>
											{snack.recipe.map((ingredient, index) => (
												<div
													key={index}
													className='flex justify-between items-center p-2 bg-gray-50 rounded'
												>
													<span className='text-sm font-medium'>
														{ingredient.productName}
													</span>
													<Badge variant='outline'>
														{ingredient.amountPerUnit}{" "}
														{
															products.find(
																(p) => p.id === ingredient.productId
															)?.unit
														}
													</Badge>
												</div>
											))}
										</div>
									</div>

									<div className='pt-2 border-t'>
										<div className='flex justify-between text-sm'>
											<span>Profit per unit:</span>
											<span className='font-semibold text-green-600'>
												Tk{(snack.sellingPrice - snack.costPerUnit).toFixed(2)}
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
