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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Building,
	Bell,
	Database,
	Save,
	Download,
	Upload,
	Trash2,
	Shield,
	Palette,
	DollarSign,
	Loader,
} from "lucide-react";
import { clearAllData, seedFirebaseData } from "@/lib/seedData";
import { toast } from "sonner";

export default function Settings() {
	const [settings, setSettings] = useState({
		// Company Information
		companyName: "Dhaka Snack House",
		address: "123 Main Street, Dhanmondi, Dhaka-1205, Bangladesh",
		phone: "+880 1712-345678",
		email: "info@dhakasnackhouse.com",
		website: "www.dhakasnackhouse.com",
		taxId: "TIN-123456789",
		tradeLicense: "TRAD-987654321",

		// Business Settings
		currency: "BDT",
		timezone: "Asia/Dhaka",
		language: "en",
		fiscalYearStart: "01-01",
		workingHours: "08:00-22:00",
		weeklyHoliday: "friday",

		// Notification Settings
		lowStockAlert: true,
		emailNotifications: true,
		smsNotifications: false,
		pushNotifications: true,
		dailyReports: true,
		weeklyReports: true,
		monthlyReports: true,

		// System Settings
		autoBackup: true,
		backupFrequency: "daily",
		dataRetention: "365",
		sessionTimeout: "30",
		twoFactorAuth: false,

		// Display Settings
		theme: "light",
		dateFormat: "DD/MM/YYYY",
		timeFormat: "24h",
		numberFormat: "en-BD",
	});

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleClearData = async () => {
		setLoading(true);
		try {
			const success = await clearAllData();
			if (success) {
				toast.success("Cleared data successfully!");
			} else {
				toast.error("Error clearing data. Please try again.");
			}
		} catch (error) {
			toast.error("Error clearing data. Please try again.");
		} finally {
			setLoading(false);
		}
	};
	const handleSave = async () => {
		setLoading(true);
		try {
			// Save settings logic here
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setMessage("Settings saved successfully!");
			setTimeout(() => setMessage(""), 3000);
		} catch (error) {
			setMessage("Error saving settings. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleSeedData = async () => {
		setLoading(true);
		try {
			const success = await seedFirebaseData();
			if (success) {
				setMessage(
					"Demo data seeded successfully! Refresh the page to see the data."
				);
			} else {
				setMessage("Error seeding data. Please try again.");
			}
		} catch (error) {
			setMessage("Error seeding data. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>Settings</h1>
					<p className='text-gray-600'>
						Manage your hotel management system preferences
					</p>
				</div>
				<div className='flex space-x-2'>
					<Button
						variant='outline'
						onClick={handleSeedData}
						disabled={loading}
					>
						<Database className='h-4 w-4 mr-2' />
						Seed Demo Data
					</Button>
					<Button
						onClick={handleSave}
						disabled={loading}
					>
						<Save className='h-4 w-4 mr-2' />
						{loading ? "Saving..." : "Save Settings"}
					</Button>
				</div>
			</div>

			{message && (
				<Alert
					className={
						message.includes("Error")
							? "border-red-200 bg-red-50"
							: "border-green-200 bg-green-50"
					}
				>
					<AlertDescription
						className={
							message.includes("Error") ? "text-red-800" : "text-green-800"
						}
					>
						{message}
					</AlertDescription>
				</Alert>
			)}

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Company Information */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<Card className='shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white'>
						<CardHeader>
							<CardTitle className='flex items-center text-blue-700'>
								<Building className='h-5 w-5 mr-2' />
								Company Information
							</CardTitle>
							<CardDescription>
								Update your business details and contact information
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='companyName'>Company Name</Label>
									<Input
										id='companyName'
										value={settings.companyName}
										onChange={(e) =>
											setSettings({ ...settings, companyName: e.target.value })
										}
									/>
								</div>
								<div>
									<Label htmlFor='phone'>Phone Number</Label>
									<Input
										id='phone'
										value={settings.phone}
										onChange={(e) =>
											setSettings({ ...settings, phone: e.target.value })
										}
									/>
								</div>
							</div>

							<div>
								<Label htmlFor='address'>Address</Label>
								<Textarea
									id='address'
									value={settings.address}
									onChange={(e) =>
										setSettings({ ...settings, address: e.target.value })
									}
									rows={3}
								/>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='email'>Email Address</Label>
									<Input
										id='email'
										type='email'
										value={settings.email}
										onChange={(e) =>
											setSettings({ ...settings, email: e.target.value })
										}
									/>
								</div>
								<div>
									<Label htmlFor='website'>Website</Label>
									<Input
										id='website'
										value={settings.website}
										onChange={(e) =>
											setSettings({ ...settings, website: e.target.value })
										}
									/>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='taxId'>Tax ID (TIN)</Label>
									<Input
										id='taxId'
										value={settings.taxId}
										onChange={(e) =>
											setSettings({ ...settings, taxId: e.target.value })
										}
									/>
								</div>
								<div>
									<Label htmlFor='tradeLicense'>Trade License</Label>
									<Input
										id='tradeLicense'
										value={settings.tradeLicense}
										onChange={(e) =>
											setSettings({ ...settings, tradeLicense: e.target.value })
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Business Settings */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Card className='shadow-lg border-0 bg-gradient-to-br from-green-50 to-white'>
						<CardHeader>
							<CardTitle className='flex items-center text-green-700'>
								<DollarSign className='h-5 w-5 mr-2' />
								Business Settings
							</CardTitle>
							<CardDescription>
								Configure your business operations and preferences
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='currency'>Currency</Label>
									<Select
										value={settings.currency}
										onValueChange={(value) =>
											setSettings({ ...settings, currency: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='BDT'>Bangladeshi Taka (Tk)</SelectItem>
											<SelectItem value='USD'>US Dollar ($)</SelectItem>
											<SelectItem value='EUR'>Euro (€)</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor='timezone'>Timezone</Label>
									<Select
										value={settings.timezone}
										onValueChange={(value) =>
											setSettings({ ...settings, timezone: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='Asia/Dhaka'>
												Asia/Dhaka (GMT+6)
											</SelectItem>
											<SelectItem value='Asia/Kolkata'>
												Asia/Kolkata (GMT+5:30)
											</SelectItem>
											<SelectItem value='UTC'>UTC (GMT+0)</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='workingHours'>Working Hours</Label>
									<Input
										id='workingHours'
										value={settings.workingHours}
										onChange={(e) =>
											setSettings({ ...settings, workingHours: e.target.value })
										}
										placeholder='08:00-22:00'
									/>
								</div>
								<div>
									<Label htmlFor='weeklyHoliday'>Weekly Holiday</Label>
									<Select
										value={settings.weeklyHoliday}
										onValueChange={(value) =>
											setSettings({ ...settings, weeklyHoliday: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='friday'>Friday</SelectItem>
											<SelectItem value='saturday'>Saturday</SelectItem>
											<SelectItem value='sunday'>Sunday</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='fiscalYearStart'>Fiscal Year Start</Label>
									<Input
										id='fiscalYearStart'
										value={settings.fiscalYearStart}
										onChange={(e) =>
											setSettings({
												...settings,
												fiscalYearStart: e.target.value,
											})
										}
										placeholder='01-01'
									/>
								</div>
								<div>
									<Label htmlFor='language'>Language</Label>
									<Select
										value={settings.language}
										onValueChange={(value) =>
											setSettings({ ...settings, language: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='en'>English</SelectItem>
											<SelectItem value='bn'>বাংলা (Bengali)</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Notification Settings */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<Card className='shadow-lg border-0 bg-gradient-to-br from-purple-50 to-white'>
						<CardHeader>
							<CardTitle className='flex items-center text-purple-700'>
								<Bell className='h-5 w-5 mr-2' />
								Notifications
							</CardTitle>
							<CardDescription>
								Configure alert and notification preferences
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<div>
										<Label htmlFor='lowStockAlert'>Low Stock Alerts</Label>
										<p className='text-sm text-gray-600'>
											Get notified when items are running low
										</p>
									</div>
									<Switch
										id='lowStockAlert'
										checked={settings.lowStockAlert}
										onCheckedChange={(checked) =>
											setSettings({ ...settings, lowStockAlert: checked })
										}
									/>
								</div>

								<Separator />

								<div className='flex items-center justify-between'>
									<div>
										<Label htmlFor='emailNotifications'>
											Email Notifications
										</Label>
										<p className='text-sm text-gray-600'>
											Receive alerts via email
										</p>
									</div>
									<Switch
										id='emailNotifications'
										checked={settings.emailNotifications}
										onCheckedChange={(checked) =>
											setSettings({ ...settings, emailNotifications: checked })
										}
									/>
								</div>

								<div className='flex items-center justify-between'>
									<div>
										<Label htmlFor='smsNotifications'>SMS Notifications</Label>
										<p className='text-sm text-gray-600'>
											Receive alerts via SMS
										</p>
									</div>
									<Switch
										id='smsNotifications'
										checked={settings.smsNotifications}
										onCheckedChange={(checked) =>
											setSettings({ ...settings, smsNotifications: checked })
										}
									/>
								</div>

								<div className='flex items-center justify-between'>
									<div>
										<Label htmlFor='pushNotifications'>
											Push Notifications
										</Label>
										<p className='text-sm text-gray-600'>
											Browser push notifications
										</p>
									</div>
									<Switch
										id='pushNotifications'
										checked={settings.pushNotifications}
										onCheckedChange={(checked) =>
											setSettings({ ...settings, pushNotifications: checked })
										}
									/>
								</div>

								<Separator />

								<div className='space-y-3'>
									<Label>Report Notifications</Label>
									<div className='space-y-2'>
										<div className='flex items-center justify-between'>
											<span className='text-sm'>Daily Reports</span>
											<Switch
												checked={settings.dailyReports}
												onCheckedChange={(checked) =>
													setSettings({ ...settings, dailyReports: checked })
												}
											/>
										</div>
										<div className='flex items-center justify-between'>
											<span className='text-sm'>Weekly Reports</span>
											<Switch
												checked={settings.weeklyReports}
												onCheckedChange={(checked) =>
													setSettings({ ...settings, weeklyReports: checked })
												}
											/>
										</div>
										<div className='flex items-center justify-between'>
											<span className='text-sm'>Monthly Reports</span>
											<Switch
												checked={settings.monthlyReports}
												onCheckedChange={(checked) =>
													setSettings({ ...settings, monthlyReports: checked })
												}
											/>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* System & Security Settings */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Card className='shadow-lg border-0 bg-gradient-to-br from-red-50 to-white'>
						<CardHeader>
							<CardTitle className='flex items-center text-red-700'>
								<Shield className='h-5 w-5 mr-2' />
								System & Security
							</CardTitle>
							<CardDescription>
								Security and system configuration
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center justify-between'>
								<div>
									<Label htmlFor='autoBackup'>Automatic Backup</Label>
									<p className='text-sm text-gray-600'>
										Automatically backup your data
									</p>
								</div>
								<Switch
									id='autoBackup'
									checked={settings.autoBackup}
									onCheckedChange={(checked) =>
										setSettings({ ...settings, autoBackup: checked })
									}
								/>
							</div>

							{settings.autoBackup && (
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label htmlFor='backupFrequency'>Backup Frequency</Label>
										<Select
											value={settings.backupFrequency}
											onValueChange={(value) =>
												setSettings({ ...settings, backupFrequency: value })
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='hourly'>Hourly</SelectItem>
												<SelectItem value='daily'>Daily</SelectItem>
												<SelectItem value='weekly'>Weekly</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label htmlFor='dataRetention'>Data Retention (days)</Label>
										<Input
											id='dataRetention'
											type='number'
											value={settings.dataRetention}
											onChange={(e) =>
												setSettings({
													...settings,
													dataRetention: e.target.value,
												})
											}
										/>
									</div>
								</div>
							)}

							<Separator />

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='sessionTimeout'>
										Session Timeout (minutes)
									</Label>
									<Input
										id='sessionTimeout'
										type='number'
										value={settings.sessionTimeout}
										onChange={(e) =>
											setSettings({
												...settings,
												sessionTimeout: e.target.value,
											})
										}
									/>
								</div>
								<div className='flex items-center justify-between'>
									<div>
										<Label htmlFor='twoFactorAuth'>Two-Factor Auth</Label>
										<p className='text-xs text-gray-600'>
											Extra security layer
										</p>
									</div>
									<Switch
										id='twoFactorAuth'
										checked={settings.twoFactorAuth}
										onCheckedChange={(checked) =>
											setSettings({ ...settings, twoFactorAuth: checked })
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Display Settings */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
				>
					<Card className='shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-white'>
						<CardHeader>
							<CardTitle className='flex items-center text-indigo-700'>
								<Palette className='h-5 w-5 mr-2' />
								Display Settings
							</CardTitle>
							<CardDescription>
								Customize the appearance and format
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='theme'>Theme</Label>
									<Select
										value={settings.theme}
										onValueChange={(value) =>
											setSettings({ ...settings, theme: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='light'>Light</SelectItem>
											<SelectItem value='dark'>Dark</SelectItem>
											<SelectItem value='auto'>Auto</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor='dateFormat'>Date Format</Label>
									<Select
										value={settings.dateFormat}
										onValueChange={(value) =>
											setSettings({ ...settings, dateFormat: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='DD/MM/YYYY'>DD/MM/YYYY</SelectItem>
											<SelectItem value='MM/DD/YYYY'>MM/DD/YYYY</SelectItem>
											<SelectItem value='YYYY-MM-DD'>YYYY-MM-DD</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='timeFormat'>Time Format</Label>
									<Select
										value={settings.timeFormat}
										onValueChange={(value) =>
											setSettings({ ...settings, timeFormat: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='12h'>12 Hour</SelectItem>
											<SelectItem value='24h'>24 Hour</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor='numberFormat'>Number Format</Label>
									<Select
										value={settings.numberFormat}
										onValueChange={(value) =>
											setSettings({ ...settings, numberFormat: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='en-BD'>
												Bengali (1,23,456.78)
											</SelectItem>
											<SelectItem value='en-US'>US (123,456.78)</SelectItem>
											<SelectItem value='en-IN'>
												Indian (1,23,456.78)
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Data Management */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
				>
					<Card className='shadow-lg border-0 bg-gradient-to-br from-orange-50 to-white'>
						<CardHeader>
							<CardTitle className='flex items-center text-orange-700'>
								<Database className='h-5 w-5 mr-2' />
								Data Management
							</CardTitle>
							<CardDescription>
								Backup, restore, and manage your data
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<Button
									variant='outline'
									className='w-full bg-transparent border-green-200 hover:bg-green-50'
								>
									<Download className='h-4 w-4 mr-2' />
									Export Data
								</Button>
								<Button
									variant='outline'
									className='w-full bg-transparent border-blue-200 hover:bg-blue-50'
								>
									<Upload className='h-4 w-4 mr-2' />
									Import Data
								</Button>
							</div>

							<Button
								variant='outline'
								className='w-full bg-transparent border-purple-200 hover:bg-purple-50'
							>
								<Database className='h-4 w-4 mr-2' />
								Create Backup
							</Button>

							<Separator />

							<div className='space-y-2'>
								<div className='flex justify-between items-center'>
									<span className='text-sm font-medium'>Last Backup</span>
									<Badge variant='outline'>January 8, 2024 at 2:30 AM</Badge>
								</div>
								<div className='flex justify-between items-center'>
									<span className='text-sm font-medium'>Backup Size</span>
									<Badge variant='outline'>2.4 MB</Badge>
								</div>
								<div className='flex justify-between items-center'>
									<span className='text-sm font-medium'>Storage Used</span>
									<Badge variant='outline'>15.2 MB / 100 MB</Badge>
								</div>
							</div>

							<Separator />

							<Button
								variant='destructive'
								className='w-full'
								size='sm'
								onClick={handleClearData}
							>
								{loading ? (
									<Loader />
								) : (
									<>
										<Trash2 className='h-4 w-4 mr-2' />
										Clear All Data
									</>
								)}
							</Button>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
