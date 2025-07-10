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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Calendar, DollarSign, Phone, Search } from "lucide-react";
import { addEmployee, Employee, getEmployees } from "@/lib/firestore";
import { useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";

export default function Employees() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchEmployees = async () => {
		try {
			const employeeData = await getEmployees();
			setEmployees(employeeData);
		} catch (error) {
			console.error("Error fetching employees:", error);
		} finally {
			setLoading(false);
		}
	};

	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		avatar: "",
		position: "",
		salary: "",
		joinDate: "",
		totalLeaveAllowed: "12",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async () => {
		const {
			name,
			phone,
			avatar,
			position,
			salary,
			joinDate,
			totalLeaveAllowed,
		} = formData;

		if (!name || !phone || !salary || !joinDate) {
			toast.error("Please fill in all required fields.");
			return;
		}

		setLoading(true);
		try {
			const newEmployee = {
				id: "", // Firestore will generate this
				name,
				phone,
				avatar,
				position,
				salary: parseFloat(salary),
				joinDate: new Date(joinDate),
				leaves: [],
				totalLeaveAllowed: parseInt(totalLeaveAllowed),
				advances: [],
			};

			await addEmployee(newEmployee);
			toast.success("Employee added successfully!");
			await fetchEmployees();

			setFormData({
				name: "",
				phone: "",
				avatar: "",
				position: "",
				salary: "",
				joinDate: "",
				totalLeaveAllowed: "12",
			});
			setShowAddEmployee(!showAddEmployee);
		} catch (error) {
			console.error("Error adding employee:", error);
			toast.error("Failed to add employee.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEmployees();
	}, []);

	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [showAddEmployee, setShowAddEmployee] = useState(false);
	const [showLeaveDialog, setShowLeaveDialog] = useState(false);
	const [showAdvanceDialog, setShowAdvanceDialog] = useState(false);

	const [searchQuery, setSearchQuery] = useState("");

	const filteredEmployees = employees?.filter(
		(employee) =>
			employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			employee.phone.includes(searchQuery)
	);

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>
						Employee Management
					</h1>
					<p className='text-gray-600'>
						Manage your hotel staff and track their activities
					</p>
				</div>
				<Dialog
					open={showAddEmployee}
					onOpenChange={setShowAddEmployee}
				>
					<DialogTrigger asChild>
						<Button>
							<Plus className='h-4 w-4 mr-2' />
							Add Employee
						</Button>
					</DialogTrigger>
					<DialogContent className='overflow-y-scroll h-full'>
						<DialogHeader>
							<DialogTitle>Add New Employee</DialogTitle>
							<DialogDescription>
								Enter employee details to add them to your team
							</DialogDescription>
						</DialogHeader>
						<div className='space-y-4 '>
							<div>
								<Label
									className='mb-2'
									htmlFor='name'
								>
									Full Name:
								</Label>
								<Input
									id='name'
									placeholder='Enter employee name'
									value={formData.name}
									onChange={handleChange}
								/>
							</div>

							<div>
								<Label
									className='mb-2'
									htmlFor='phone'
								>
									Phone Number:
								</Label>
								<Input
									id='phone'
									placeholder='+880 1712-345678'
									value={formData.phone}
									onChange={handleChange}
								/>
							</div>

							<div>
								<Label
									className='mb-2'
									htmlFor='position'
								>
									Position:
								</Label>
								<Input
									id='position'
									placeholder='e.g. Cook, Waiter'
									value={formData.position}
									onChange={handleChange}
								/>
							</div>

							<div>
								<Label
									className='mb-2'
									htmlFor='avatar'
								>
									Avatar URL:
								</Label>
								<Input
									id='avatar'
									placeholder='https://example.com/image.jpg'
									value={formData.avatar}
									onChange={handleChange}
								/>
							</div>

							<div>
								<Label
									className='mb-2'
									htmlFor='salary'
								>
									Monthly Salary :(Tk)
								</Label>
								<Input
									id='salary'
									type='number'
									placeholder='15000'
									value={formData.salary}
									onChange={handleChange}
								/>
							</div>

							<div>
								<Label
									className='mb-2'
									htmlFor='joinDate'
								>
									Join Date:
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
									htmlFor='totalLeaveAllowed'
								>
									Total Leave All:owed (per year)
								</Label>
								<Input
									id='totalLeaveAllowed'
									type='number'
									placeholder='12'
									value={formData.totalLeaveAllowed}
									onChange={handleChange}
								/>
							</div>

							<Button
								className='w-full'
								onClick={handleSubmit}
								disabled={loading}
							>
								{loading ? "Adding..." : "Add Employee"}
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
							placeholder='Search employees by name or phone...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-10'
						/>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{filteredEmployees?.map((employee) => (
					<motion.div
						key={employee.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<Card className='hover:shadow-lg transition-shadow'>
							<CardHeader>
								<div className='flex justify-between items-start'>
									<div className='flex items-center space-x-3'>
										<div className='relative'>
											<Image
												src={
													employee.avatar ||
													`/placeholder.svg?height=50&width=50`
												}
												width={48}
												height={48}
												alt={employee.name}
												className='w-12 h-12 rounded-full object-cover border-2 border-blue-200'
											/>
											<div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full'></div>
										</div>
										<div>
											<CardTitle className='text-lg'>{employee.name}</CardTitle>
											<CardDescription className='flex items-center mt-1'>
												<Phone className='h-4 w-4 mr-1' />
												{employee.phone}
											</CardDescription>
											{employee.position && (
												<Badge
													variant='outline'
													className='mt-1 text-xs'
												>
													{employee.position}
												</Badge>
											)}
										</div>
									</div>
									<Button
										variant='ghost'
										size='icon'
									>
										<Edit className='h-4 w-4' />
									</Button>
								</div>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-2 gap-4 text-sm'>
									<div>
										<p className='text-gray-600'>Salary</p>
										<p className='font-semibold'>
											Tk{employee.salary.toLocaleString()}
										</p>
									</div>
									<div>
										<p className='text-gray-600'>Join Date</p>
										<p className='font-semibold'>
											{" "}
											{employee.joinDate?.toDate?.().toLocaleDateString() ??
												"N/A"}
										</p>
									</div>
								</div>

								<div className='space-y-2'>
									<div className='flex justify-between items-center'>
										<span className='text-sm text-gray-600'>Leaves Taken</span>
										<Badge variant='outline'>
											{employee.leaves.length}/{employee.totalLeaveAllowed}
										</Badge>
									</div>
									<div className='flex justify-between items-center'>
										<span className='text-sm text-gray-600'>
											Total Advances
										</span>
										<Badge variant='outline'>
											Tk
											{employee.advances
												.reduce(
													(sum: any, advance: any) => sum + advance.amount,
													0
												)
												.toLocaleString()}
										</Badge>
									</div>
								</div>

								<div className='flex space-x-2'>
									<Dialog
										open={showLeaveDialog}
										onOpenChange={setShowLeaveDialog}
									>
										<DialogTrigger asChild>
											<Button
												variant='outline'
												size='sm'
												className='flex-1 bg-transparent'
											>
												<Calendar className='h-4 w-4 mr-1' />
												Leave
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Add Leave Record</DialogTitle>
												<DialogDescription>
													Record leave for {employee.name}
												</DialogDescription>
											</DialogHeader>
											<div className='space-y-4'>
												<div>
													<Label htmlFor='leaveDate'>Leave Date</Label>
													<Input
														id='leaveDate'
														type='date'
													/>
												</div>
												<div>
													<Label htmlFor='reason'>Reason</Label>
													<Textarea
														id='reason'
														placeholder='Enter reason for leave'
													/>
												</div>
												<Button className='w-full'>Add Leave Record</Button>
											</div>
										</DialogContent>
									</Dialog>

									<Dialog
										open={showAdvanceDialog}
										onOpenChange={setShowAdvanceDialog}
									>
										<DialogTrigger asChild>
											<Button
												variant='outline'
												size='sm'
												className='flex-1 bg-transparent'
											>
												<DollarSign className='h-4 w-4 mr-1' />
												Advance
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Add Salary Advance</DialogTitle>
												<DialogDescription>
													Record salary advance for {employee.name}
												</DialogDescription>
											</DialogHeader>
											<div className='space-y-4'>
												<div>
													<Label htmlFor='advanceDate'>Date</Label>
													<Input
														id='advanceDate'
														type='date'
													/>
												</div>
												<div>
													<Label htmlFor='amount'>Amount (Tk)</Label>
													<Input
														id='amount'
														type='number'
														placeholder='5000'
													/>
												</div>
												<div>
													<Label htmlFor='advanceReason'>
														Reason (Optional)
													</Label>
													<Textarea
														id='advanceReason'
														placeholder='Enter reason for advance'
													/>
												</div>
												<Button className='w-full'>Add Advance Record</Button>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>
		</div>
	);
}
