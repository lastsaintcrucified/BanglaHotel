/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import {
	LayoutDashboard,
	Users,
	Package,
	ChefHat,
	ClipboardList,
	BarChart3,
	Settings,
	X,
	Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}

const menuItems = [
	{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ id: "employees", label: "Employees", icon: Users },
	{ id: "inventory", label: "Inventory", icon: Package },
	{ id: "snacks", label: "Snack Recipes", icon: ChefHat },
	{ id: "production", label: "Daily Production", icon: ClipboardList },
	{ id: "day-reports", label: "Day Reports", icon: Calendar },
	{ id: "reports", label: "Monthly Reports", icon: BarChart3 },
	{ id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
	activeTab,
	setActiveTab,
	isOpen,
	setIsOpen,
}: SidebarProps) {
	return (
		<div className='w-64 bg-white shadow-xl h-full flex flex-col border-r border-gray-200'>
			<div className='flex items-center justify-between h-16 px-6 border-b bg-gradient-to-r from-blue-600 to-green-600'>
				<h1 className='text-xl font-bold text-white'>Hotel Manager</h1>
				<Button
					variant='ghost'
					size='icon'
					className='lg:hidden text-white hover:bg-white/20'
					onClick={() => setIsOpen(false)}
				>
					<X className='h-5 w-5' />
				</Button>
			</div>

			<nav className='mt-6 flex-1'>
				{menuItems.map((item, index) => {
					const Icon = item.icon;
					return (
						<motion.button
							key={item.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.1 }}
							onClick={() => {
								setActiveTab(item.id);
								setIsOpen(false);
							}}
							className={`w-full flex items-center px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200 group ${
								activeTab === item.id
									? "bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 border-r-4 border-blue-600 shadow-sm"
									: "text-gray-600 hover:text-blue-700"
							}`}
						>
							<Icon
								className={`h-5 w-5 mr-3 transition-colors ${
									activeTab === item.id
										? "text-blue-600"
										: "text-gray-500 group-hover:text-blue-600"
								}`}
							/>
							<span className='font-medium'>{item.label}</span>
						</motion.button>
					);
				})}
			</nav>

			<div className='p-4 border-t bg-gray-50'>
				<div className='text-center text-xs text-gray-500'>
					<p>Hotel Management v2.0</p>
					<p>© 2024 All rights reserved</p>
				</div>
			</div>
		</div>
	);
}
