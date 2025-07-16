/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	collection,
	addDoc,
	getDocs,
	query,
	where,
	orderBy,
	Timestamp,
	doc,
	getDoc,
	updateDoc,
	deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import {
	ProductionEntry,
	SnackProduced,
} from "@/app/components/DayReportsComplete";

// Employee operations
type Advance = {
	amount: number;
	date: string; // or Date if you want to parse it
	reason: string;
	repaid: boolean;
};

type Attendance = {
	absent: number;
	late: number;
	overtime: number;
	present: number;
};

type Leave = {
	approved: boolean;
	date: string; // or Date
	days: number;
	reason: string;
};

export type Employee = {
	id?: string;
	address: string;
	advances: Advance[];
	attendance: Attendance;
	avatar: string;
	bloodGroup: string;
	email: string;
	emergencyContact: string;
	joinDate: string; // or Date
	leaves: Leave[];
	name: string;
	nid: string;
	performance: number;
	phone: string;
	position: string;
	salary: number;
	skills: string[];
	totalLeaveAllowed: number;
};
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

export const getEmployees = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, "employees"));
		return querySnapshot.docs.map((doc) => {
			const data = doc.data() as Employee;
			// console.log(doc.id);
			return {
				id: doc.id,
				...data,
			};
		});
	} catch (error) {
		console.error("Error getting employees:", error);
		throw error;
	}
};

export const getEmployeeById = async (id: string) => {
	try {
		const docRef = doc(db, "employees", id); // "employees" is the collection name
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const data = docSnap.data() as Employee;
			console.log("Employee data:", data);
			return { id: docSnap.id, ...data };
		} else {
			console.log("No such employee!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching employee:", error);
		return null;
	}
};

export const updateEmployeeById = async (
	id: string,
	updatedData: Partial<Employee>
) => {
	try {
		const employeeRef = doc(db, "employees", id); // "employees" is your collection
		await updateDoc(employeeRef, updatedData);
		console.log("Employee updated successfully");
	} catch (error) {
		console.error("Error updating employee:", error);
	}
};
export const deleteEmployeeById = async (id: string) => {
	try {
		await deleteDoc(doc(db, "employees", id));
		console.log("Employee deleted successfully");
	} catch (error) {
		console.error("Error deleting employee:", error);
	}
};

// Product operations
export type Product = {
	id?: string; // Add this if it's from Firestore doc
	batchNumber: string;
	category: string;
	currentStock: number;
	estimatedWastagePercent: number;
	expiryDate: string; // consider Date if parsing
	initialStock: number;
	lastUpdated: string; // consider Date if parsing
	lowStockAlertAt: number;
	maxStock: number;
	name: string;
	pricePerUnit: number;
	reorderLevel: number;
	supplier: string;
	unit: string;
};
export const addProduct = async (product: Product) => {
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

export const getProducts = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, "products"));
		return querySnapshot.docs.map((doc) => {
			const data = doc.data() as Product;
			return { id: doc.id, ...data };
		});
	} catch (error) {
		console.error("Error getting products:", error);
		throw error;
	}
};

export const getProductById = async (id: string) => {
	try {
		const docRef = doc(db, "products", id); // "products" is the collection name
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const data = docSnap.data() as Product;
			console.log("Product data:", data);
			return { id: docSnap.id, ...data };
		} else {
			console.log("No such product!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching product:", error);
		return null;
	}
};
export const updateProduct = async (
	id: string,
	updatedProduct: Partial<Product>
) => {
	const ref = doc(db, "products", id);
	return await updateDoc(ref, updatedProduct);
};

export const deleteProduct = async (id: string) => {
	const ref = doc(db, "products", id);
	return await deleteDoc(ref);
};
// Snack operations
export const addSnack = async (snack: SnackProduced) => {
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
			return { id: doc.id, ...data };
		});
	} catch (error) {
		console.error("Error getting snacks:", error);
		throw error;
	}
};

export const getSnackById = async (id: string) => {
	try {
		const docRef = doc(db, "snacks", id); // "snacks" is the collection name
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const data = docSnap.data() as SnackProduced;
			console.log("Snack data:", data);
			return { id: docSnap.id, ...data };
		} else {
			console.log("No such snack!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching snack:", error);
		return null;
	}
};

// Production operations
export const addProductionEntry = async (entry: ProductionEntry) => {
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
				id: doc.id,
				...data, // <- safe access
			};
		});
	} catch (error) {
		console.error("Error getting production entries:", error);
		throw error;
	}
};

export const getProductionEntryId = async (id: string) => {
	try {
		const docRef = doc(db, "productionEntries", id); // "productionEntries" is the collection name
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const data = docSnap.data() as ProductionEntry;
			console.log("ProductionEntry data:", data);
			return { id: docSnap.id, ...data };
		} else {
			console.log("No such ProductionEntry!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching ProductionEntry:", error);
		return null;
	}
};

// Expense operations
export type Expense = {
	id?: string; // Firestore document ID
	invoiceNumber: string;
	date: string; // "YYYY-MM-DD"
	category: string; // e.g., "Ingredients"
	subcategory: string; // e.g., "Raw Materials"
	amount: number;
	paymentMethod: "Cash" | "Bank" | "Mobile Payment" | string;
	vendor: string;
	description: string;
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
			return { id: doc.id, ...data };
		});
	} catch (error) {
		console.error("Error getting expenses:", error);
		throw error;
	}
};

export const getExpenseId = async (id: string) => {
	try {
		const docRef = doc(db, "expenses", id); // "expenses" is the collection name
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const data = docSnap.data() as Expense;
			console.log("Expense data:", data);
			return { id: docSnap.id, ...data };
		} else {
			console.log("No such Expense!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching Expense:", error);
		return null;
	}
};

export type Supplier = {
	id?: string; // Firestore document ID
	name: string;
	category: string; // e.g., "Oils & Fats"
	address: string;
	contact: string;
	email: string;
	paymentTerms: string; // e.g., "45 days"
	rating: number; // 1 to 5 scale
};
// Supplier operations
export const addSupplier = async (supplier: Supplier) => {
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
export const getSupplierId = async (id: string) => {
	try {
		const docRef = doc(db, "suppliers", id); // "suppliers" is the collection name
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const data = docSnap.data() as Supplier;
			console.log("Supplier data:", data);
			return { id: docSnap.id, ...data };
		} else {
			console.log("No such Supplier!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching Supplier:", error);
		return null;
	}
};
export type Customer = {
	id?: string;
	address: string;
	createdAt: Date;
	email: string;
	lastOrderDate: string; // or Date if you prefer to parse it
	loyaltyPoints: number;
	name: string;
	phone: string;
	preferredItems: string[];
	totalOrders: number;
	totalSpent: number;
};
// Customer operations
export const addCustomer = async (customer: Customer) => {
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

export const getCustomerById = async (id: string) => {
	try {
		const docRef = doc(db, "customers", id); // "customers" is the collection name
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const data = docSnap.data() as Customer;
			console.log("Customer data:", data);
			return { id: docSnap.id, ...data };
		} else {
			console.log("No such Customer!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching Customer:", error);
		return null;
	}
};

// Sales operations
type OrderItem = {
	name: string;
	price: number;
	quantity: number;
};
export type Sale = {
	id?: string;
	createdAt: Date;
	customerType: string;
	date: string; // or Date if you want to parse it
	discount: number;
	invoiceNumber: string;
	items: OrderItem[];
	paymentMethod: string;
	tax: number;
	time: string;
	totalAmount: number;
};
export const addSale = async (sale: Sale) => {
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
		return querySnapshot.docs.map((doc) => ({ ...doc.data() }));
	} catch (error) {
		console.error("Error getting sales:", error);
		throw error;
	}
};

export const getSaleById = async (id: string) => {
	try {
		const docRef = doc(db, "sales", id); // "sales" is the collection name
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const data = docSnap.data() as Sale;
			console.log("Sale data:", data);
			return { id: docSnap.id, ...data };
		} else {
			console.log("No such Sale!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching Sale:", error);
		return null;
	}
};
