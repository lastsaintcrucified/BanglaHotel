/* eslint-disable react-hooks/exhaustive-deps */
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
import { Textarea } from "@/components/ui/textarea";
import {
	Plus,
	Edit,
	Calendar,
	DollarSign,
	Phone,
	Search,
	Loader,
	Delete,
	Trash,
	CircleDollarSign,
} from "lucide-react";
import {
	addEmployee,
	deleteEmployeeById,
	Employee,
	getEmployees,
	updateEmployeeById,
} from "@/lib/firestore";
import { useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { EditEmployeeDialog } from "./EditEmployee";
import { ViewAdvancesDialog } from "./ViewAdvancesDialog";
import { searchFirestoreDocs } from "@/lib/searchFirestoreDocs";
import { useFirestoreSearch } from "@/hooks/useFirestoreSearch";
import { useDebounce } from "@/hooks/useDebounce";

export default function Employees() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(true);

	// const fetchEmployees = async () => {
	// 	try {
	// 		const employeeData = await getEmployees();
	// 		console.log(employeeData);
	// 		setEmployees(employeeData);
	// 	} catch (error) {
	// 		console.error("Error fetching employees:", error);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	const [formData, setFormData] = useState({
		name: "",
		address: "",
		bloodGroup: "",
		email: "",
		emergencyContact: "",
		nid: "",
		skills: [""],
		performance: 0,
		phone: "",
		avatar: "",
		position: "",
		salary: 0,
		joinDate: "",
		totalLeaveAllowed: 12,
		leaves: [],
		advances: [],
		attendance: {},
	});

	const [leaveData, setLeaveData] = useState({
		date: "",
		reason: "",
		days: 1,
		approved: false,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value, type } = e.target;
		const finalValue = type === "number" ? parseFloat(value) : value;

		setFormData((prev) => ({
			...prev,
			[id]: finalValue,
		}));
	};

	const handleSubmit = async () => {
		const {
			name,
			address,
			bloodGroup,
			email,
			emergencyContact,
			nid,
			skills,
			phone,
			avatar,
			position,
			salary,
			joinDate,
			performance,
			totalLeaveAllowed,
			leaves,
			attendance,
			advances,
		} = formData;

		if (!name || !phone || !salary || !joinDate) {
			toast.error("Please fill in all required fields.");
			return;
		}

		setLoading(true);
		try {
			const newEmployee = {
				address,
				advances: [
					{
						amount: 0,
						date: "", // or Date if you want to parse it
						reason: "",
						repaid: true,
					},
				],
				attendance: {
					absent: 0,
					late: 0,
					overtime: 0,
					present: 0,
				},
				avatar,
				bloodGroup,
				email,
				emergencyContact,
				joinDate,
				leaves: [],
				name,
				nid,
				performance,
				phone,
				position,
				salary,
				skills,
				totalLeaveAllowed,
			};

			await addEmployee(newEmployee);
			toast.success("Employee added successfully!");
			search("");

			setFormData({
				name: "",
				address: "",
				bloodGroup: "",
				performance: 0,
				email: "",
				emergencyContact: "",
				nid: "",
				skills: [""],
				phone: "",
				avatar: "",
				position: "",
				salary: 0,
				joinDate: "",
				totalLeaveAllowed: 12,
				leaves: [],
				advances: [],
				attendance: {},
			});
			setShowAddEmployee(!showAddEmployee);
		} catch (error) {
			console.error("Error adding employee:", error);
			toast.error("Failed to add employee.");
		} finally {
			setLoading(false);
		}
	};

	// update Employee
	const handleUpdateEmployee = async (updatedEmployee: Partial<Employee>) => {
		if (!selectedEmployee) return;
		setLoading(true);

		try {
			await updateEmployeeById(selectedEmployee.id ?? "", updatedEmployee);
			toast.success("Employee updated!");
			search("");
			// refresh list or update UI accordingly
		} catch (err) {
			console.error(err);
			toast.error("Failed to update employee");
		} finally {
			setLoading(false);
		}
	};
	// delete Employee
	const handleDelete = async (id: string, employeeName: string) => {
		const confirmed = window.confirm(
			`Are you sure you want to delete employee "${employeeName}"? This action cannot be undone.`
		);
		console.log(confirmed);
		if (!confirmed) return;
		setLoading(true);

		try {
			await deleteEmployeeById(id);
			toast.success("Employee deleted!");
			search("");
			// refresh list or update UI accordingly
		} catch (err) {
			console.error(err);
			toast.error("Failed to delete employee");
		} finally {
			setLoading(false);
		}
	};

	const handleAddLeave = async (employee: Employee) => {
		setLoading(true);
		const updatedLeave = {
			...leaveData,
			approved: true, // default or set by admin later
		};

		try {
			await updateEmployeeById(employee.id ?? "", {
				leaves: [...(employee.leaves || []), updatedLeave],
			});
			toast.success("Leave added successfully!");
			search("");
			setLeaveData({
				date: "",
				reason: "",
				days: 1,
				approved: false,
			});
			setShowLeaveDialog(!showLeaveDialog);
		} catch (err) {
			console.error("Failed to update leave:", err);
			toast.error("Failed to update leave:");
		} finally {
			setLoading(false);
		}
	};

	// useEffect(() => {
	// 	fetchEmployees();
	// }, []);

	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null
	);
	const [selectedEmployeeForAdvance, setSelectedEmployeeForAdvance] =
		useState<Employee | null>(null);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showAddEmployee, setShowAddEmployee] = useState(false);
	const [showLeaveDialog, setShowLeaveDialog] = useState(false);
	const [showAdvanceDialog, setShowAdvanceDialog] = useState(false);

	const [searchQuery, setSearchQuery] = useState("");
	const { results, loadingFS, error, search } = useFirestoreSearch<Employee>({
		collectionName: "employees",
		searchFields: ["name", "phone"],
	});
	const debouncedQuery = useDebounce(searchQuery, 300);

	// ✅ Load all employees on mount
	useEffect(() => {
		search("");
	}, []);

	// ✅ Debounced search
	useEffect(() => {
		search(debouncedQuery);
	}, [debouncedQuery]);
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
				{/* Edit/Update employee */}
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
							{/* Name */}
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
									htmlFor='email'
								>
									Email:
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
									Address:
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
									NID:
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
									Blood Group:
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
									Emergency Contact:
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
									htmlFor='performance'
								>
									Performance (0–5):
								</Label>
								<Input
									id='performance'
									type='number'
									step='0.1'
									value={formData.performance}
									onChange={handleChange}
								/>
							</div>

							<div>
								<Label
									className='mb-2'
									htmlFor='skills'
								>
									Skills (comma separated):
								</Label>
								<Input
									id='skills'
									value={formData.skills.join(", ")}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											skills: e.target.value.split(",").map((s) => s.trim()),
										}))
									}
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
				{results?.map((employee) => (
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
									{/* Edit */}
									<Button
										variant='ghost'
										size='icon'
										onClick={() => {
											setSelectedEmployee(employee);
											setShowEditDialog(true);
										}}
									>
										<Edit className='h-4 w-4 text-green-600 ' />
									</Button>
									<Button
										variant='ghost'
										size='icon'
										onClick={() =>
											handleDelete(employee.id ?? "", employee.name)
										}
									>
										<Trash className='h-5 w-5 text-red-600 fill-orange-300' />
									</Button>

									{selectedEmployee && (
										<EditEmployeeDialog
											employee={selectedEmployee}
											open={showEditDialog}
											onOpenChange={setShowEditDialog}
											onUpdate={handleUpdateEmployee}
											loading={loading}
										/>
									)}
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
											{employee.joinDate ?? "N/A"}
										</p>
									</div>
								</div>

								<div className='space-y-2'>
									<div className='flex justify-between items-center cursor-pointer'>
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
												<Calendar className='h-4 w-4 mr-1 text-amber-600' />
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
													<Label
														className='mb-2'
														htmlFor='leaveDate'
													>
														Leave Date
													</Label>
													<Input
														id='leaveDate'
														type='date'
														value={leaveData.date}
														onChange={(e) =>
															setLeaveData({
																...leaveData,
																date: e.target.value,
															})
														}
													/>
												</div>

												<div>
													<Label
														className='mb-2'
														htmlFor='reason'
													>
														Reason
													</Label>
													<Textarea
														id='reason'
														placeholder='Enter reason for leave'
														value={leaveData.reason}
														onChange={(e) =>
															setLeaveData({
																...leaveData,
																reason: e.target.value,
															})
														}
													/>
												</div>

												<div>
													<Label
														className='mb-2'
														htmlFor='days'
													>
														Leave Days
													</Label>
													<Input
														id='days'
														type='number'
														value={leaveData.days}
														onChange={(e) =>
															setLeaveData({
																...leaveData,
																days: Number(e.target.value),
															})
														}
													/>
												</div>

												<Button
													className='w-full'
													onClick={() => handleAddLeave(employee)}
												>
													{loading ? <Loader /> : "Add Leave Record"}
												</Button>
											</div>
										</DialogContent>
									</Dialog>

									{/* Advances */}
									<Button
										variant='outline'
										size='sm'
										className='flex-1 bg-transparent'
										onClick={() => {
											setSelectedEmployeeForAdvance(employee);
											setShowAdvanceDialog(true);
										}}
									>
										<CircleDollarSign className='h-4 w-4 text-purple-600 ' />
										Advances
									</Button>
									{selectedEmployeeForAdvance && (
										<ViewAdvancesDialog
											employee={selectedEmployeeForAdvance}
											open={showAdvanceDialog}
											onOpenChange={setShowAdvanceDialog}
											loading={loading}
										/>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>
		</div>
	);
}
