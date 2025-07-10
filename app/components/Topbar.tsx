/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
	Menu,
	Bell,
	User,
	Search,
	LogOut,
	Settings,
	BellRing,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "./AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
	getNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
	generateSystemNotifications,
} from "@/lib/notifications";

interface TopbarProps {
	setSidebarOpen: (open: boolean) => void;
}

interface Notification {
	actionRequired: any;
	createdAt: Date;
	category: React.ReactNode;
	id: string;
	title: string;
	message: string;
	time: string;
	type: "warning" | "success" | "info" | "error";
	read: boolean;
	priority: "high" | "medium" | "low";
}

export default function Topbar({ setSidebarOpen }: TopbarProps) {
	const [showNotifications, setShowNotifications] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loadingNotifications, setLoadingNotifications] = useState(true);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				setLoadingNotifications(true);
				await generateSystemNotifications();
				const notificationData = await getNotifications(20);
				setNotifications(
					notificationData.map((n: any) => ({
						id: n.id,
						title: n.title || "No Title",
						message: n.message || "",
						time: n.time || "",
						type: n.type || "info",
						read: n.read ?? false,
						priority: n.priority || "low",
						// Optionally map additional fields if needed
						createdAt: n.createdAt,
						category: n.category,
						actionRequired: n.actionRequired,
					}))
				);
			} catch (error) {
				console.error("Error fetching notifications:", error);
			} finally {
				setLoadingNotifications(false);
			}
		};

		fetchNotifications();

		const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
		return () => clearInterval(interval);
	}, []);

	const { user, logout } = useAuth();

	const unreadCount = notifications.filter((n) => !n.read).length;

	const markAsRead = async (id: string) => {
		try {
			await markNotificationAsRead(id);
			setNotifications((prev) =>
				prev.map((n) => (n.id === id ? { ...n, read: true } : n))
			);
		} catch (error) {
			console.error("Error marking notification as read:", error);
		}
	};

	const markAllAsRead = async () => {
		try {
			await markAllNotificationsAsRead();
			setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		} catch (error) {
			console.error("Error marking all notifications as read:", error);
		}
	};

	const deleteNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case "error":
				return "🚨";
			case "warning":
				return "⚠️";
			case "success":
				return "✅";
			case "info":
				return "ℹ️";
			default:
				return "📢";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "border-l-red-500 bg-red-50";
			case "medium":
				return "border-l-yellow-500 bg-yellow-50";
			case "low":
				return "border-l-green-500 bg-green-50";
			default:
				return "border-l-gray-500 bg-gray-50";
		}
	};

	const userProfile = {
		name: user?.displayName || "Hotel Owner",
		email: user?.email || "owner@hotel.com",
		role: "Administrator",
		avatar: "/placeholder.svg?height=40&width=40",
	};

	const getTimeAgo = (date: Date) => {
		const now = new Date();
		const diffInMinutes = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60)
		);

		if (diffInMinutes < 1) return "Just now";
		if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24)
			return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

		const diffInDays = Math.floor(diffInHours / 24);
		return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
	};

	return (
		<header className='bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 relative z-30'>
			<div className='flex items-center flex-1'>
				<Button
					variant='ghost'
					size='icon'
					className='lg:hidden mr-2'
					onClick={() => setSidebarOpen(true)}
				>
					<Menu className='h-5 w-5' />
				</Button>

				<div className='hidden md:block'>
					<h2 className='text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'>
						Hotel Management System
					</h2>
				</div>

				{/* Global Search */}
				<div className='flex-1 max-w-md mx-4'>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
						<Input
							placeholder='Search employees, products, snacks...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors'
						/>
					</div>
				</div>
			</div>

			<div className='flex items-center space-x-2'>
				{/* Notifications */}
				<Dialog
					open={showNotifications}
					onOpenChange={setShowNotifications}
				>
					<DialogTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className='relative'
						>
							<motion.div
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
							>
								<Bell className='h-5 w-5' />
								{unreadCount > 0 && (
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										className='absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center'
									>
										<span className='text-xs text-white font-medium'>
											{unreadCount}
										</span>
									</motion.div>
								)}
							</motion.div>
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-md max-h-[80vh] overflow-hidden'>
						<DialogHeader>
							<div className='flex items-center justify-between'>
								<DialogTitle className='flex items-center'>
									<BellRing className='h-5 w-5 mr-2' />
									Notifications
								</DialogTitle>
								{unreadCount > 0 && (
									<Button
										variant='ghost'
										size='sm'
										onClick={markAllAsRead}
									>
										Mark all read
									</Button>
								)}
							</div>
							<DialogDescription>
								Recent alerts and updates from your hotel
							</DialogDescription>
						</DialogHeader>
						<div className='space-y-2 max-h-96 overflow-y-auto'>
							{loadingNotifications ? (
								<div className='flex items-center justify-center py-8'>
									<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600'></div>
								</div>
							) : (
								<AnimatePresence>
									{notifications.map((notification) => (
										<motion.div
											key={notification.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: 20 }}
											className={`p-3 border-l-4 rounded-r-lg cursor-pointer transition-all hover:shadow-md ${getPriorityColor(
												notification.priority
											)} ${!notification.read ? "ring-2 ring-blue-100" : ""}`}
											onClick={() => markAsRead(notification.id)}
										>
											<div className='flex justify-between items-start'>
												<div className='flex-1'>
													<div className='flex items-center space-x-2'>
														<span className='text-lg'>
															{getNotificationIcon(notification.type)}
														</span>
														<h4 className='font-medium text-sm'>
															{notification.title}
														</h4>
														{!notification.read && (
															<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
														)}
														{notification.actionRequired && (
															<span className='text-xs bg-red-100 text-red-600 px-2 py-1 rounded'>
																Action Required
															</span>
														)}
													</div>
													<p className='text-sm text-gray-600 mt-1'>
														{notification.message}
													</p>
													<div className='flex items-center justify-between mt-2'>
														<p className='text-xs text-gray-500'>
															{getTimeAgo(notification.createdAt)}
														</p>
														<span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded'>
															{notification.category}
														</span>
													</div>
												</div>
												<Button
													variant='ghost'
													size='icon'
													className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
													onClick={(e) => {
														e.stopPropagation();
														// Could add delete functionality here
													}}
												>
													<X className='h-3 w-3' />
												</Button>
											</div>
										</motion.div>
									))}
								</AnimatePresence>
							)}
							{!loadingNotifications && notifications.length === 0 && (
								<div className='text-center py-8 text-gray-500'>
									<Bell className='h-12 w-12 mx-auto mb-4 opacity-50' />
									<p>No notifications</p>
								</div>
							)}
						</div>
					</DialogContent>
				</Dialog>

				{/* Profile Menu */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className='relative'
						>
							<motion.div
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
							>
								<User className='h-5 w-5' />
							</motion.div>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align='end'
						className='w-64'
					>
						<DropdownMenuLabel>
							<div className='flex flex-col space-y-1'>
								<p className='text-sm font-medium'>{userProfile.name}</p>
								<p className='text-xs text-gray-500'>{userProfile.email}</p>
								<Badge
									variant='outline'
									className='w-fit'
								>
									{userProfile.role}
								</Badge>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<User className='mr-2 h-4 w-4' />
							<span>Profile Settings</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Settings className='mr-2 h-4 w-4' />
							<span>System Settings</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className='text-red-600'
							onClick={logout}
						>
							<LogOut className='mr-2 h-4 w-4' />
							<span>Sign Out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
