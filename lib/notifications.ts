/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	collection,
	addDoc,
	getDocs,
	query,
	orderBy,
	limit,
	where,
	updateDoc,
	doc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Notification {
	id?: string;
	title: string;
	message: string;
	type: "warning" | "success" | "info" | "error";
	priority: "high" | "medium" | "low";
	read: boolean;
	createdAt: Date;
	category: string;
	actionRequired?: boolean;
	relatedData?: any;
}

export const addNotification = async (
	notification: Omit<Notification, "id" | "createdAt">
) => {
	try {
		const docRef = await addDoc(collection(db, "notifications"), {
			...notification,
			createdAt: new Date(),
		});
		return docRef.id;
	} catch (error) {
		console.error("Error adding notification:", error);
		throw error;
	}
};

export const getNotifications = async (limit_count = 50) => {
	try {
		const q = query(
			collection(db, "notifications"),
			orderBy("createdAt", "desc"),
			limit(limit_count)
		);
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
			createdAt: doc.data().createdAt?.toDate() || new Date(),
		}));
	} catch (error) {
		console.error("Error getting notifications:", error);
		throw error;
	}
};

export const markNotificationAsRead = async (notificationId: string) => {
	try {
		await updateDoc(doc(db, "notifications", notificationId), {
			read: true,
		});
	} catch (error) {
		console.error("Error marking notification as read:", error);
		throw error;
	}
};

export const markAllNotificationsAsRead = async () => {
	try {
		const q = query(
			collection(db, "notifications"),
			where("read", "==", false)
		);
		const querySnapshot = await getDocs(q);

		const updatePromises = querySnapshot.docs.map((document) =>
			updateDoc(doc(db, "notifications", document.id), { read: true })
		);

		await Promise.all(updatePromises);
	} catch (error) {
		console.error("Error marking all notifications as read:", error);
		throw error;
	}
};

// Generate notifications based on system data
export const generateSystemNotifications = async () => {
	try {
		const { getProducts, getEmployees, getProductionEntries } = await import(
			"./firestore"
		);

		// Define a type for Product with required properties
		type Product = {
			id: string;
			name: string;
			currentStock: number;
			lowStockAlertAt: number;
			unit?: string;
			estimatedWastagePercent?: number;
		};

		// Define a type for ProductionEntry with required properties
		type ProductionEntry = {
			id: string;
			date: string;
			totalRevenue: number;
			// add other properties if needed
		};

		const [products, employees, productionEntries] = (await Promise.all([
			getProducts(),
			getEmployees(),
			getProductionEntries(),
		])) as [Product[], any[], ProductionEntry[]];

		const notifications = [];

		// Check for low stock items
		const lowStockItems = (products as Product[]).filter(
			(product) => product.currentStock <= product.lowStockAlertAt
		);

		for (const item of lowStockItems) {
			if (item.currentStock === 0) {
				notifications.push({
					title: "Critical Stock Alert",
					message: `${item.name} is completely out of stock! Restock immediately to avoid production delays.`,
					type: "error" as const,
					priority: "high" as const,
					read: false,
					category: "inventory",
					actionRequired: true,
					relatedData: {
						productId: item.id ?? "unknown",
						productName: item.name ?? "unknown",
					},
				});
			} else {
				notifications.push({
					title: "Low Stock Warning",
					message: `${item.name} is running low (${item.currentStock}${item.unit} remaining). Consider restocking soon.`,
					type: "warning" as const,
					priority: "medium" as const,
					read: false,
					category: "inventory",
					actionRequired: true,
					relatedData: {
						productId: item.id ?? "unknown",
						productName: item.name ?? "unknown",
					},
				});
			}
		}

		// Check for recent production achievements
		const today = new Date().toISOString().split("T")[0];
		const todayProduction = productionEntries.find(
			(entry) => entry.date === today
		);

		if (todayProduction && todayProduction.totalRevenue > 10000) {
			notifications.push({
				title: "Daily Target Exceeded!",
				message: `Excellent work! Today's revenue of Tk${todayProduction.totalRevenue.toLocaleString()} exceeded the daily target.`,
				type: "success" as const,
				priority: "low" as const,
				read: false,
				category: "achievement",
				actionRequired: false,
				relatedData: { date: today, revenue: todayProduction.totalRevenue },
			});
		}

		// Check for employee leave requests (simulated)
		// const employeesWithRecentLeaves = employees.filter(
		// 	(emp) =>
		// 		emp.leaves &&
		// 		emp.leaves.some((leave: any) => {
		// 			const leaveDate = new Date(leave.date);
		// 			const daysDiff =
		// 				(new Date().getTime() - leaveDate.getTime()) / (1000 * 3600 * 24);
		// 			return daysDiff <= 7 && !leave.approved;
		// 		})
		// );

		// for (const employee of employeesWithRecentLeaves) {
		// 	notifications.push({
		// 		title: "Leave Request Pending",
		// 		message: `${employee.name} has submitted a leave request that requires approval.`,
		// 		type: "info" as const,
		// 		priority: "medium" as const,
		// 		read: false,
		// 		category: "hr",
		// 		actionRequired: true,
		// 		relatedData: { employeeId: employee.id, employeeName: employee.name },
		// 	});
		// }

		// Check for high wastage items
		const highWastageItems = products.filter(
			(product) => (product.estimatedWastagePercent ?? 0) > 10
		);

		for (const item of highWastageItems) {
			notifications.push({
				title: "High Wastage Alert",
				message: `${item.name} has high wastage rate (${item.estimatedWastagePercent}%). Review storage and handling procedures.`,
				type: "warning" as const,
				priority: "medium" as const,
				read: false,
				category: "quality",
				actionRequired: true,
				relatedData: {
					productId: item.id,
					wastagePercent: item.estimatedWastagePercent,
				},
			});
		}

		// Add all notifications to Firebase
		for (const notification of notifications) {
			await addNotification(notification);
		}

		return notifications.length;
	} catch (error) {
		console.error("Error generating system notifications:", error);
		return 0;
	}
};
