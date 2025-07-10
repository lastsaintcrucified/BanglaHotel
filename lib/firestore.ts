/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	collection,
	addDoc,
	getDocs,
	query,
	where,
	orderBy,
	Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import {
	ProductionEntry,
	SnackProduced,
} from "@/app/components/DayReportsComplete";

// Employee operations
export const addEmployee = async (employee: Employee) => {
	try {
		const docRef = await addDoc(collection(db, "employees"), {
			...employee,
			createdAt: Timestamp.now(),
		});
		return docRef.id;
	} catch (error) {
		console.error("Error adding employee:", error);
		throw error;
	}
};
export type Employee = {
	id: string;
	name: string;
	phone: any;
	avatar: any;
	position: any;
	salary: any;
	joinDate: any;
	leaves: any[];
	totalLeaveAllowed: any;
	advances: any;
	// add other fields if needed
};
export const getEmployees = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, "employees"));
		return querySnapshot.docs.map((doc) => {
			const data = doc.data() as Employee;
			return {
				...data,
			};
		});
	} catch (error) {
		console.error("Error getting employees:", error);
		throw error;
	}
};

// Product operations
export const addProduct = async (product: any) => {
	try {
		const docRef = await addDoc(collection(db, "products"), {
			...product,
			createdAt: Timestamp.now(),
		});
		return docRef.id;
	} catch (error) {
		console.error("Error adding product:", error);
		throw error;
	}
};

export type Product = {
	id: string;
	name: string;
	currentStock: any;
	lowStockAlertAt: any;
	initialStock: any;
	unit: any;
	estimatedWastagePercent: any;
};
export const getProducts = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, "products"));
		return querySnapshot.docs.map((doc) => {
			const data = doc.data() as Product;
			return { ...data };
		});
	} catch (error) {
		console.error("Error getting products:", error);
		throw error;
	}
};

// Snack operations
export const addSnack = async (snack: any) => {
	try {
		const docRef = await addDoc(collection(db, "snacks"), {
			...snack,
			createdAt: Timestamp.now(),
		});
		return docRef.id;
	} catch (error) {
		console.error("Error adding snack:", error);
		throw error;
	}
};

export const getSnacks = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, "snacks"));
		return querySnapshot.docs.map((doc) => {
			const data = doc.data() as SnackProduced;
			return { ...data };
		});
	} catch (error) {
		console.error("Error getting snacks:", error);
		throw error;
	}
};

// Production operations
export const addProductionEntry = async (entry: any) => {
	try {
		const docRef = await addDoc(collection(db, "productionEntries"), {
			...entry,
			createdAt: Timestamp.now(),
		});
		return docRef.id;
	} catch (error) {
		console.error("Error adding production entry:", error);
		throw error;
	}
};

export const getProductionEntries = async (
	startDate?: string,
	endDate?: string
) => {
	try {
		let q = query(collection(db, "productionEntries"), orderBy("date", "desc"));

		if (startDate && endDate) {
			q = query(
				collection(db, "productionEntries"),
				where("date", ">=", startDate),
				where("date", "<=", endDate),
				orderBy("date", "desc")
			);
		}

		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => {
			const data = doc.data() as ProductionEntry;
			return {
				...data, // <- safe access
			};
		});
	} catch (error) {
		console.error("Error getting production entries:", error);
		throw error;
	}
};

// Expense operations
export type Expense = {
	id: string;
	category: string;
	subcategory: string;
	amount: number;
	createdAt: any;
};
export const addExpense = async (expense: Expense) => {
	try {
		const docRef = await addDoc(collection(db, "expenses"), {
			...expense,
			createdAt: Timestamp.now(),
		});
		return docRef.id;
	} catch (error) {
		console.error("Error adding expense:", error);
		throw error;
	}
};

export const getExpenses = async (startDate?: string, endDate?: string) => {
	try {
		let q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));

		if (startDate && endDate) {
			q = query(
				collection(db, "expenses"),
				where("createdAt", ">=", startDate),
				where("createdAt", "<=", endDate),
				orderBy("createdAt", "desc")
			);
		}

		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => {
			const data = doc.data() as Expense;
			return { ...data };
		});
	} catch (error) {
		console.error("Error getting expenses:", error);
		throw error;
	}
};

// Supplier operations
export const addSupplier = async (supplier: any) => {
	try {
		const docRef = await addDoc(collection(db, "suppliers"), {
			...supplier,
			createdAt: Timestamp.now(),
		});
		return docRef.id;
	} catch (error) {
		console.error("Error adding supplier:", error);
		throw error;
	}
};

export const getSuppliers = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, "suppliers"));
		return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	} catch (error) {
		console.error("Error getting suppliers:", error);
		throw error;
	}
};

// Customer operations
export const addCustomer = async (customer: any) => {
	try {
		const docRef = await addDoc(collection(db, "customers"), {
			...customer,
			createdAt: Timestamp.now(),
		});
		return docRef.id;
	} catch (error) {
		console.error("Error adding customer:", error);
		throw error;
	}
};

export const getCustomers = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, "customers"));
		return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	} catch (error) {
		console.error("Error getting customers:", error);
		throw error;
	}
};

// Sales operations
export const addSale = async (sale: any) => {
	try {
		const docRef = await addDoc(collection(db, "sales"), {
			...sale,
			createdAt: Timestamp.now(),
		});
		return docRef.id;
	} catch (error) {
		console.error("Error adding sale:", error);
		throw error;
	}
};

export const getSales = async (startDate?: string, endDate?: string) => {
	try {
		let q = query(collection(db, "sales"), orderBy("date", "desc"));

		if (startDate && endDate) {
			q = query(
				collection(db, "sales"),
				where("date", ">=", startDate),
				where("date", "<=", endDate),
				orderBy("date", "desc")
			);
		}

		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	} catch (error) {
		console.error("Error getting sales:", error);
		throw error;
	}
};
