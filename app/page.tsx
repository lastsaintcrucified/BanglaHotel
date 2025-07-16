"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "./components/AuthProvider";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import Snacks from "./components/Snacks";
import Production from "./components/Production";
import Settings from "./components/Settings";
import ReportsComplete from "./components/ReportsComplete";
import DayReportsComplete from "./components/DayReportsComplete";
import { Toaster } from "sonner";
import Employees from "./components/Employee/Employees";
import Inventory from "./components/Inventory/Inventory";

export default function Home() {
	const [activeTab, setActiveTab] = useState("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { user } = useAuth();

	// Don't render if user is not authenticated
	if (!user) {
		return null;
	}

	const renderContent = () => {
		switch (activeTab) {
			case "dashboard":
				return <Dashboard />;
			case "employees":
				return <Employees />;
			case "inventory":
				return <Inventory />;
			case "snacks":
				return <Snacks />;
			case "production":
				return <Production />;
			case "reports":
				return <ReportsComplete />;
			case "settings":
				return <Settings />;
			case "day-reports":
				return <DayReportsComplete />;
			default:
				return <Dashboard />;
		}
	};

	return (
		<div className='flex h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
			{/* Desktop Sidebar - Always visible on lg+ screens */}
			<div className='hidden lg:block'>
				<Sidebar
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					isOpen={true}
					setIsOpen={() => {}}
				/>
			</div>

			{/* Mobile Sidebar Overlay */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Mobile Sidebar */}
			<motion.div
				initial={false}
				animate={{ x: sidebarOpen ? 0 : -280 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className='fixed lg:hidden inset-y-0 left-0 z-50 w-64 bg-white shadow-lg'
			>
				<Sidebar
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					isOpen={sidebarOpen}
					setIsOpen={setSidebarOpen}
				/>
			</motion.div>

			<div className='flex-1 flex flex-col overflow-hidden'>
				<Topbar setSidebarOpen={setSidebarOpen} />

				<main className='flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 p-4'>
					<motion.div
						key={activeTab}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						{renderContent()}
					</motion.div>
					<Toaster />
				</main>
			</div>
		</div>
	);
}
