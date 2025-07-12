/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Hotel, Mail, Lock, User, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
	});

	const [signupData, setSignupData] = useState({
		name: "",
		email: "",
		phone: "",
		hotelName: "",
		password: "",
		confirmPassword: "",
	});

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await signInWithEmailAndPassword(
				auth,
				loginData.email,
				loginData.password
			);
			router.push("/");
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (signupData.password !== signupData.confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		try {
			await createUserWithEmailAndPassword(
				auth,
				signupData.email,
				signupData.password
			);
			router.push("/");
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const demoLogin = async () => {
		setLoading(true);
		try {
			await signInWithEmailAndPassword(auth, "demo@hotel.com", "demo123456");
			router.push("/");
		} catch (error: any) {
			// If demo account doesn't exist, create it
			try {
				await createUserWithEmailAndPassword(
					auth,
					"demo@hotel.com",
					"demo123456"
				);
				router.push("/");
			} catch (createError: any) {
				setError(
					"Unable to access demo account. Please create your own account."
				);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='w-full max-w-md'
			>
				<div className='text-center mb-8'>
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
						className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-4'
					>
						<Hotel className='h-8 w-8 text-white' />
					</motion.div>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Banager-Hotel Manager
					</h1>
					<p className='text-gray-600'>
						Complete management solution for your hotel business
					</p>
				</div>

				<Card className='shadow-xl border-0 bg-white/80 backdrop-blur-sm'>
					<CardHeader className='space-y-1 pb-4'>
						<CardTitle className='text-2xl text-center'>Welcome Back</CardTitle>
						<CardDescription className='text-center'>
							Sign in to manage your hotel operations
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs
							defaultValue='login'
							className='w-full'
						>
							<TabsList className='grid w-full grid-cols-2 mb-6'>
								<TabsTrigger value='login'>Sign In</TabsTrigger>
								<TabsTrigger value='signup'>Sign Up</TabsTrigger>
							</TabsList>

							<TabsContent value='login'>
								<form
									onSubmit={handleLogin}
									className='space-y-4'
								>
									<div className='space-y-2'>
										<Label htmlFor='email'>Email</Label>
										<div className='relative'>
											<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
											<Input
												id='email'
												type='email'
												placeholder='Enter your email'
												value={loginData.email}
												onChange={(e) =>
													setLoginData({ ...loginData, email: e.target.value })
												}
												className='pl-10'
												required
											/>
										</div>
									</div>

									<div className='space-y-2'>
										<Label htmlFor='password'>Password</Label>
										<div className='relative'>
											<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
											<Input
												id='password'
												type={showPassword ? "text" : "password"}
												placeholder='Enter your password'
												value={loginData.password}
												onChange={(e) =>
													setLoginData({
														...loginData,
														password: e.target.value,
													})
												}
												className='pl-10 pr-10'
												required
											/>
											<button
												type='button'
												onClick={() => setShowPassword(!showPassword)}
												className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
											>
												{showPassword ? (
													<EyeOff className='h-4 w-4' />
												) : (
													<Eye className='h-4 w-4' />
												)}
											</button>
										</div>
									</div>

									{error && (
										<Alert className='border-red-200 bg-red-50'>
											<AlertDescription className='text-red-800'>
												{error}
											</AlertDescription>
										</Alert>
									)}

									<Button
										type='submit'
										className='w-full bg-gradient-to-r from-blue-600 to-green-600'
										disabled={loading}
									>
										{loading ? "Signing in..." : "Sign In"}
									</Button>

									<div className='relative my-4'>
										<div className='absolute inset-0 flex items-center'>
											<span className='w-full border-t' />
										</div>
										<div className='relative flex justify-center text-xs uppercase'>
											<span className='bg-white px-2 text-muted-foreground'>
												Or try demo
											</span>
										</div>
									</div>

									<Button
										type='button'
										variant='outline'
										className='w-full bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100'
										onClick={demoLogin}
										disabled={loading}
									>
										<Hotel className='h-4 w-4 mr-2' />
										🚀 Try Full Demo Account
									</Button>

									<div className='text-center text-xs text-gray-500 mt-2'>
										<p>✨ Complete with 30 days of data</p>
										<p>📊 Real expense tracking & analytics</p>
										<p>👥 Employee management & reports</p>
									</div>
								</form>
							</TabsContent>

							<TabsContent value='signup'>
								<form
									onSubmit={handleSignup}
									className='space-y-4'
								>
									<div className='grid grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<Label htmlFor='name'>Full Name</Label>
											<div className='relative'>
												<User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
												<Input
													id='name'
													placeholder='Your name'
													value={signupData.name}
													onChange={(e) =>
														setSignupData({
															...signupData,
															name: e.target.value,
														})
													}
													className='pl-10'
													required
												/>
											</div>
										</div>

										<div className='space-y-2'>
											<Label htmlFor='phone'>Phone</Label>
											<div className='relative'>
												<Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
												<Input
													id='phone'
													placeholder='+880 1712-345678'
													value={signupData.phone}
													onChange={(e) =>
														setSignupData({
															...signupData,
															phone: e.target.value,
														})
													}
													className='pl-10'
													required
												/>
											</div>
										</div>
									</div>

									<div className='space-y-2'>
										<Label htmlFor='hotelName'>Hotel Name</Label>
										<div className='relative'>
											<Hotel className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
											<Input
												id='hotelName'
												placeholder='Your hotel name'
												value={signupData.hotelName}
												onChange={(e) =>
													setSignupData({
														...signupData,
														hotelName: e.target.value,
													})
												}
												className='pl-10'
												required
											/>
										</div>
									</div>

									<div className='space-y-2'>
										<Label htmlFor='signupEmail'>Email</Label>
										<div className='relative'>
											<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
											<Input
												id='signupEmail'
												type='email'
												placeholder='Enter your email'
												value={signupData.email}
												onChange={(e) =>
													setSignupData({
														...signupData,
														email: e.target.value,
													})
												}
												className='pl-10'
												required
											/>
										</div>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<Label htmlFor='signupPassword'>Password</Label>
											<Input
												id='signupPassword'
												type='password'
												placeholder='Password'
												value={signupData.password}
												onChange={(e) =>
													setSignupData({
														...signupData,
														password: e.target.value,
													})
												}
												required
											/>
										</div>

										<div className='space-y-2'>
											<Label htmlFor='confirmPassword'>Confirm</Label>
											<Input
												id='confirmPassword'
												type='password'
												placeholder='Confirm'
												value={signupData.confirmPassword}
												onChange={(e) =>
													setSignupData({
														...signupData,
														confirmPassword: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>

									{error && (
										<Alert className='border-red-200 bg-red-50'>
											<AlertDescription className='text-red-800'>
												{error}
											</AlertDescription>
										</Alert>
									)}

									<Button
										type='submit'
										className='w-full bg-gradient-to-r from-green-600 to-blue-600'
										disabled={loading}
									>
										{loading ? "Creating account..." : "Create Account"}
									</Button>
								</form>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>

				<div className='text-center mt-6 text-sm text-gray-600'>
					<p>🔒 Secure • 📊 Analytics • 💼 Professional</p>
				</div>
			</motion.div>
		</div>
	);
}
