import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Trash2 } from "lucide-react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Employee } from "@/lib/firestore";

interface Advance {
	amount: number;
	date: string;
	reason: string;
	repaid: boolean;
}

interface Props {
	employee: Employee;
	open: boolean;
	loading: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ViewAdvancesDialog({
	employee,
	open,
	loading,
	onOpenChange,
}: Props) {
	const [advances, setAdvances] = useState<Advance[]>(employee.advances || []);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editedAdvance, setEditedAdvance] = useState<Advance | null>(null);
	const [newAdvance, setNewAdvance] = useState<Advance>({
		amount: 0,
		date: "",
		reason: "",
		repaid: false,
	});

	useEffect(() => {
		setAdvances(employee.advances || []);
	}, [employee]);

	const saveToFirestore = async (
		updated: Advance[],
		successMessage: string
	) => {
		try {
			await updateDoc(doc(db, "employees", employee.id ?? ""), {
				advances: updated,
			});
			setAdvances(updated);
			toast.success(successMessage);
		} catch (error) {
			console.error(error);
			toast.error("Failed to update advances.");
		}
	};

	const handleSaveEdit = async () => {
		if (editedAdvance == null || editingIndex == null) return;
		const updated = [...advances];
		updated[editingIndex] = editedAdvance;
		await saveToFirestore(updated, "Advance updated.");
		setEditingIndex(null);
	};

	const handleAddAdvance = async () => {
		if (!newAdvance.date || newAdvance.amount <= 0 || !newAdvance.reason) {
			toast.error("Please fill all fields");
			return;
		}
		const updated = [...advances, newAdvance];
		await saveToFirestore(updated, "Advance added.");
		setNewAdvance({ amount: 0, date: "", reason: "", repaid: false });
	};

	const handleDeleteAdvance = async (index: number) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this advance?"
		);
		if (!confirmDelete) return;
		const updated = [...advances];
		updated.splice(index, 1);
		await saveToFirestore(updated, "Advance deleted.");
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className='max-h-[90vh] overflow-y-scroll'>
				<DialogHeader>
					<DialogTitle>Advance Records</DialogTitle>
					<DialogDescription>
						Manage advances for <strong>{employee.name}</strong>
					</DialogDescription>
				</DialogHeader>

				{/* Add Advance */}
				<div className='space-y-2 bg-muted p-4 rounded mb-4'>
					<h3 className='font-semibold text-sm'>Add New Advance</h3>
					<div>
						<Label className='mb-2'>Date</Label>
						<Input
							type='date'
							value={newAdvance.date}
							onChange={(e) =>
								setNewAdvance({ ...newAdvance, date: e.target.value })
							}
						/>
					</div>
					<div>
						<Label className='mb-2'>Amount</Label>
						<Input
							type='number'
							value={newAdvance.amount}
							onChange={(e) =>
								setNewAdvance({ ...newAdvance, amount: +e.target.value })
							}
						/>
					</div>
					<div>
						<Label className='mb-2'>Reason</Label>
						<Input
							value={newAdvance.reason}
							onChange={(e) =>
								setNewAdvance({ ...newAdvance, reason: e.target.value })
							}
						/>
					</div>
					<div>
						<Label className='mb-2'>Repaid</Label>
						<select
							className='w-full p-2 border rounded'
							value={newAdvance.repaid ? "true" : "false"}
							onChange={(e) =>
								setNewAdvance({
									...newAdvance,
									repaid: e.target.value === "true",
								})
							}
						>
							<option value='false'>No</option>
							<option value='true'>Yes</option>
						</select>
					</div>
					<Button
						className='w-full mt-2'
						onClick={handleAddAdvance}
					>
						Add Advance
					</Button>
				</div>

				{/* View + Edit Advances */}
				{advances.length === 0 ? (
					<p className='text-gray-500'>No advances recorded.</p>
				) : (
					<div className='space-y-6'>
						{advances.map((advance, index) => (
							<div
								key={index}
								className='border p-4 rounded bg-background relative space-y-2'
							>
								{editingIndex === index ? (
									<>
										<div>
											<Label className='mb-2'>Date</Label>
											<Input
												type='date'
												value={editedAdvance?.date || ""}
												onChange={(e) =>
													setEditedAdvance((prev) =>
														prev ? { ...prev, date: e.target.value } : prev
													)
												}
											/>
										</div>
										<div>
											<Label className='mb-2'>Amount</Label>
											<Input
												type='number'
												value={editedAdvance?.amount || ""}
												onChange={(e) =>
													setEditedAdvance((prev) =>
														prev ? { ...prev, amount: +e.target.value } : prev
													)
												}
											/>
										</div>
										<div>
											<Label className='mb-2'>Reason</Label>
											<Input
												value={editedAdvance?.reason || ""}
												onChange={(e) =>
													setEditedAdvance((prev) =>
														prev ? { ...prev, reason: e.target.value } : prev
													)
												}
											/>
										</div>
										<div>
											<Label className='mb-2'>Repaid</Label>
											<select
												className='w-full p-2 border rounded'
												value={editedAdvance?.repaid ? "true" : "false"}
												onChange={(e) =>
													setEditedAdvance((prev) =>
														prev
															? { ...prev, repaid: e.target.value === "true" }
															: prev
													)
												}
											>
												<option value='false'>No</option>
												<option value='true'>Yes</option>
											</select>
										</div>
										<div className='flex justify-end gap-2 mt-2'>
											<Button
												variant='secondary'
												onClick={() => setEditingIndex(null)}
											>
												Cancel
											</Button>
											<Button onClick={handleSaveEdit}>Save</Button>
										</div>
									</>
								) : (
									<>
										<p>
											<strong>Date:</strong> {advance.date}
										</p>
										<p>
											<strong>Amount:</strong> Tk {advance.amount}
										</p>
										<p>
											<strong>Reason:</strong> {advance.reason}
										</p>
										<p>
											<strong>Repaid:</strong>{" "}
											{advance.repaid ? "✅ Yes" : "❌ No"}
										</p>

										<div className='flex justify-between items-center mt-2'>
											<Button
												className='bg-green-600 text-white'
												size='sm'
												onClick={() => {
													setEditingIndex(index);
													setEditedAdvance({ ...advance });
												}}
											>
												{loading ? <Loader /> : "Edit"}
											</Button>
											<Button
												variant='destructive'
												size='icon'
												onClick={() => handleDeleteAdvance(index)}
											>
												{loading ? <Loader /> : <Trash2 className='h-4 w-4 ' />}
											</Button>
										</div>
									</>
								)}
							</div>
						))}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
