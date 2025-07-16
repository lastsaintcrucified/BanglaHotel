import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/firestore";
import { Loader } from "lucide-react";

interface EdiInventoryDialogProps {
	product: Product;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onUpdate: (updatedProduct: Partial<Product>) => Promise<void>;
	loading: boolean;
}

export function EditProductDialog({
	product,
	open,
	onOpenChange,
	onUpdate,
	loading,
}: EdiInventoryDialogProps) {
	// Local form state, initialize with product data
	const [formData, setFormData] = useState<Product>(product);

	// Sync when employee prop changes (important!)
	useEffect(() => {
		setFormData(product);
	}, [product]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { id, value, type } = e.target;
		const finalValue = type === "number" ? Number(value) : value;

		setFormData((prev) => ({
			...prev,
			[id]: finalValue,
		}));
	};

	const handleSubmit = async () => {
		// Call onUpdate with updated data (omit id)
		await onUpdate(formData);
		onOpenChange(false); // close dialog after update
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className='max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Edit Product: {product.name}</DialogTitle>
				</DialogHeader>

				<div className='space-y-4'>
					<div>
						<Label
							className='mb-2'
							htmlFor='name'
						>
							Product Name
						</Label>
						<Input
							id='name'
							placeholder='e.g., Flour, Sugar, Oil'
							value={formData.name}
							onChange={handleChange}
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
							value={formData.unit}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label
							className='mb-2'
							htmlFor='initialStock'
						>
							Initial Stock ({formData.unit})
						</Label>
						<Input
							id='initialStock'
							type='number'
							placeholder='50'
							value={formData.initialStock}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label
							className='mb-2'
							htmlFor='currentStock'
						>
							Current Stock ({formData.unit})
						</Label>
						<Input
							id='currentStock'
							type='number'
							placeholder='50'
							value={formData.currentStock}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label
							className='mb-2'
							htmlFor='lowStockAlertAt'
						>
							Low Stock Alert Level ({formData.unit})
						</Label>
						<Input
							id='lowStockAlertAt'
							type='number'
							placeholder='10'
							value={formData.lowStockAlertAt}
							onChange={handleChange}
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
							value={formData.estimatedWastagePercent}
							onChange={handleChange}
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
							value={formData.category}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label
							className='mb-2'
							htmlFor='pricePerUnit'
						>
							Price per unit ({formData.unit})
						</Label>
						<Input
							id='pricePerUnit'
							type='number'
							placeholder='2'
							value={formData.pricePerUnit}
							onChange={handleChange}
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
							value={formData.supplier}
							onChange={handleChange}
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
							value={formData.expiryDate}
							onChange={handleChange}
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
							value={formData.batchNumber}
							onChange={handleChange}
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
							value={formData.maxStock}
							onChange={handleChange}
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
							value={formData.reorderLevel}
							onChange={handleChange}
						/>
					</div>
					<Button
						className='w-full'
						onClick={handleSubmit}
					>
						{loading ? <Loader /> : "Save Changes"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
