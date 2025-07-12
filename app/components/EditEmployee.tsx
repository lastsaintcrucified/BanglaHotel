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
import { Employee } from "@/lib/firestore";
import { Loader } from "lucide-react";

interface EditEmployeeDialogProps {
	employee: Employee;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onUpdate: (updatedEmployee: Partial<Employee>) => Promise<void>;
	loading: boolean;
}

export function EditEmployeeDialog({
	employee,
	open,
	onOpenChange,
	onUpdate,
	loading,
}: EditEmployeeDialogProps) {
	// Local form state, initialize with employee data
	const [formData, setFormData] = useState<Employee>(employee);

	// Sync when employee prop changes (important!)
	useEffect(() => {
		setFormData(employee);
	}, [employee]);

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

	const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			skills: e.target.value.split(",").map((s) => s.trim()),
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
					<DialogTitle>Edit Employee: {employee.name}</DialogTitle>
				</DialogHeader>

				<div className='space-y-4'>
					<div>
						<Label
							className='mb-2'
							htmlFor='name'
						>
							Full Name
						</Label>
						<Input
							id='name'
							value={formData.name}
							onChange={handleChange}
						/>
					</div>

					<div>
						<Label
							className='mb-2'
							htmlFor='phone'
						>
							Phone
						</Label>
						<Input
							id='phone'
							value={formData.phone}
							onChange={handleChange}
						/>
					</div>

					<div>
						<Label
							className='mb-2'
							htmlFor='email'
						>
							Email
						</Label>
						<Input
							id='email'
							value={formData.email}
							onChange={handleChange}
						/>
					</div>

					<div>
						<Label
							className='mb-2'
							htmlFor='address'
						>
							Address
						</Label>
						<Input
							id='address'
							value={formData.address}
							onChange={handleChange}
						/>
					</div>

					<div>
						<Label
							className='mb-2'
							htmlFor='nid'
						>
							NID
						</Label>
						<Input
							id='nid'
							value={formData.nid}
							onChange={handleChange}
						/>
					</div>

					<div>
						<Label
							className='mb-2'
							htmlFor='bloodGroup'
						>
							Blood Group
						</Label>
						<Input
							id='bloodGroup'
							value={formData.bloodGroup}
							onChange={handleChange}
						/>
					</div>

					<div>
						<Label
							className='mb-2'
							htmlFor='emergencyContact'
						>
							Emergency Contact
						</Label>
						<Input
							id='emergencyContact'
							value={formData.emergencyContact}
							onChange={handleChange}
						/>
					</div>

					<div>
						<Label
							className='mb-2'
							htmlFor='avatar'
						>
							Avatar URL
						</Label>
						<Input
							id='avatar'
							value={formData.avatar}
							onChange={handleChange}
						/>
					</div>

					<div>
						<Label
							className='mb-2'
							htmlFor='position'
						>
							Position
						</Label>
						<Input
							id='position'
							value={formData.position}
							onChange={handleChange}
						/>
					</div>

					<div>
						<Label
							className='mb-2'
							htmlFor='salary'
						>
							Monthly Salary (Tk)
						</Label>
						<Input
							id='salary'
							type='number'
							value={formData.salary}
							onChange={handleChange}
						/>
					</div>

					<div>
						<Label
							className='mb-2'
							htmlFor='joinDate'
						>
							Join Date
						</Label>
						<Input
							id='joinDate'
							type='date'
							value={formData.joinDate}
							onChange={handleChange}
						/>
					</div>

					<div>
						<Label
							className='mb-2'
							htmlFor='performance'
						>
							Performance (0-5)
						</Label>
						<Input
							id='performance'
							type='number'
							step='0.1'
							min='0'
							max='5'
							value={formData.performance}
							onChange={handleChange}
						/>
					</div>

					<div>
						<Label
							className='mb-2'
							htmlFor='totalLeaveAllowed'
						>
							Total Leave Allowed (per year)
						</Label>
						<Input
							id='totalLeaveAllowed'
							type='number'
							value={formData.totalLeaveAllowed}
							onChange={handleChange}
						/>
					</div>

					<div>
						<Label
							className='mb-2'
							htmlFor='skills'
						>
							Skills (comma separated)
						</Label>
						<Input
							id='skills'
							value={formData.skills.join(", ")}
							onChange={handleSkillsChange}
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
