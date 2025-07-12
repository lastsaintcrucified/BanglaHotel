/* eslint-disable @typescript-eslint/no-unused-vars */
import { collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

export const clearAllData = async () => {
	try {
		await clearCollection("employees");
		await clearCollection("products");
		await clearCollection("snacks");
		await clearCollection("productionEntries");
		await clearCollection("notifications");
		await clearCollection("expenses");
		await clearCollection("suppliers");
		await clearCollection("customers");
		await clearCollection("sales");
		return true;
	} catch (error) {
		console.error("Error clearing comprehensive data:", error);
		return false;
	}
};
export const seedFirebaseData = async () => {
	try {
		// Clear existing data
		await clearCollection("employees");
		await clearCollection("products");
		await clearCollection("snacks");
		await clearCollection("productionEntries");
		await clearCollection("notifications");
		await clearCollection("expenses");
		await clearCollection("suppliers");
		await clearCollection("customers");
		await clearCollection("sales");

		// Seed suppliers first
		const suppliers = [
			{
				name: "Bashundhara Group",
				contact: "+880 1711-123456",
				email: "sales@bashundhara.com",
				address: "Bashundhara City, Dhaka",
				category: "Flour & Grains",
				paymentTerms: "30 days",
				rating: 4.8,
				createdAt: new Date(),
			},
			{
				name: "Fresh Food Ltd",
				contact: "+880 1712-234567",
				email: "orders@freshfood.com",
				address: "Gulshan, Dhaka",
				category: "Sugar & Sweeteners",
				paymentTerms: "15 days",
				rating: 4.5,
				createdAt: new Date(),
			},
			{
				name: "City Group",
				contact: "+880 1713-345678",
				email: "supply@citygroup.com",
				address: "Motijheel, Dhaka",
				category: "Oils & Fats",
				paymentTerms: "45 days",
				rating: 4.7,
				createdAt: new Date(),
			},
			{
				name: "Radhuni Spices",
				contact: "+880 1714-456789",
				email: "wholesale@radhuni.com",
				address: "Old Dhaka",
				category: "Spices & Seasonings",
				paymentTerms: "Cash",
				rating: 4.9,
				createdAt: new Date(),
			},
			{
				name: "ACI Salt",
				contact: "+880 1715-567890",
				email: "orders@acisalt.com",
				address: "Tejgaon, Dhaka",
				category: "Salt & Minerals",
				paymentTerms: "30 days",
				rating: 4.6,
				createdAt: new Date(),
			},
			{
				name: "Local Market",
				contact: "+880 1716-678901",
				email: "info@localmarket.com",
				address: "Karwan Bazar, Dhaka",
				category: "Fresh Vegetables",
				paymentTerms: "Cash",
				rating: 4.2,
				createdAt: new Date(),
			},
			{
				name: "Kazi Farms",
				contact: "+880 1717-789012",
				email: "sales@kazifarms.com",
				address: "Savar, Dhaka",
				category: "Meat & Poultry",
				paymentTerms: "7 days",
				rating: 4.8,
				createdAt: new Date(),
			},
		];

		for (const supplier of suppliers) {
			await addDoc(collection(db, "suppliers"), supplier);
		}

		// Seed employees with comprehensive data
		const employees = [
			{
				name: "Ahmed Rahman",
				phone: "+880 1712-345678",
				joinDate: "2023-01-15",
				salary: 25000,
				totalLeaveAllowed: 15,
				position: "Head Chef",
				address: "House 45, Road 12, Dhanmondi, Dhaka-1205",
				emergencyContact: "+880 1812-345678",
				avatar: "/placeholder.svg?height=100&width=100&text=AR",
				email: "ahmed.rahman@hotel.com",
				nid: "1234567890123",
				bloodGroup: "B+",
				skills: ["Cooking", "Menu Planning", "Team Leadership", "Food Safety"],
				performance: 4.8,
				leaves: [
					{
						date: "2024-01-05",
						reason: "Family emergency",
						approved: true,
						days: 2,
					},
					{
						date: "2024-01-10",
						reason: "Medical checkup",
						approved: false,
						days: 1,
					},
					{
						date: "2023-12-25",
						reason: "Festival leave",
						approved: true,
						days: 3,
					},
				],
				advances: [
					{
						date: "2024-01-01",
						amount: 8000,
						reason: "Emergency medical expense",
						repaid: false,
					},
					{
						date: "2023-11-15",
						amount: 5000,
						reason: "Festival bonus advance",
						repaid: true,
					},
				],
				attendance: {
					present: 22,
					absent: 2,
					late: 1,
					overtime: 15,
				},
				createdAt: new Date(),
			},
			{
				name: "Fatima Khatun",
				phone: "+880 1812-345678",
				joinDate: "2023-03-20",
				salary: 18000,
				totalLeaveAllowed: 12,
				position: "Assistant Chef",
				address: "Flat 3B, Building 7, Uttara Sector 4, Dhaka",
				emergencyContact: "+880 1912-345678",
				avatar: "/placeholder.svg?height=100&width=100&text=FK",
				email: "fatima.khatun@hotel.com",
				nid: "2345678901234",
				bloodGroup: "A+",
				skills: [
					"Food Preparation",
					"Inventory Management",
					"Customer Service",
				],
				performance: 4.6,
				leaves: [
					{
						date: "2024-01-03",
						reason: "Personal work",
						approved: true,
						days: 1,
					},
					{
						date: "2023-12-20",
						reason: "Wedding ceremony",
						approved: true,
						days: 2,
					},
				],
				advances: [
					{
						date: "2023-12-01",
						amount: 3000,
						reason: "Wedding expenses",
						repaid: true,
					},
				],
				attendance: {
					present: 24,
					absent: 1,
					late: 0,
					overtime: 8,
				},
				createdAt: new Date(),
			},
			{
				name: "Mohammad Ali",
				phone: "+880 1912-345678",
				joinDate: "2023-06-10",
				salary: 30000,
				totalLeaveAllowed: 18,
				position: "Kitchen Manager",
				address: "House 78, Road 45, Gulshan-2, Dhaka",
				emergencyContact: "+880 1712-345678",
				avatar: "/placeholder.svg?height=100&width=100&text=MA",
				email: "mohammad.ali@hotel.com",
				nid: "3456789012345",
				bloodGroup: "O+",
				skills: [
					"Management",
					"Quality Control",
					"Cost Management",
					"Staff Training",
				],
				performance: 4.9,
				leaves: [
					{
						date: "2023-12-15",
						reason: "Hajj pilgrimage",
						approved: true,
						days: 15,
					},
				],
				advances: [
					{
						date: "2023-12-25",
						amount: 10000,
						reason: "Festival bonus advance",
						repaid: false,
					},
					{
						date: "2024-01-02",
						amount: 5000,
						reason: "Medical expense",
						repaid: true,
					},
				],
				attendance: {
					present: 25,
					absent: 0,
					late: 0,
					overtime: 20,
				},
				createdAt: new Date(),
			},
			{
				name: "Rashida Begum",
				phone: "+880 1612-345678",
				joinDate: "2023-08-15",
				salary: 15000,
				totalLeaveAllowed: 12,
				position: "Kitchen Helper",
				address: "Block C, House 23, Mirpur-10, Dhaka",
				emergencyContact: "+880 1512-345678",
				avatar: "/placeholder.svg?height=100&width=100&text=RB",
				email: "rashida.begum@hotel.com",
				nid: "4567890123456",
				bloodGroup: "AB+",
				skills: ["Cleaning", "Food Preparation", "Dishwashing"],
				performance: 4.3,
				leaves: [
					{
						date: "2024-01-08",
						reason: "Sick leave",
						approved: false,
						days: 1,
					},
					{
						date: "2023-12-30",
						reason: "Family function",
						approved: true,
						days: 2,
					},
				],
				advances: [
					{
						date: "2024-01-05",
						amount: 2000,
						reason: "Emergency",
						repaid: false,
					},
				],
				attendance: {
					present: 23,
					absent: 2,
					late: 3,
					overtime: 5,
				},
				createdAt: new Date(),
			},
			{
				name: "Karim Uddin",
				phone: "+880 1518-345678",
				joinDate: "2023-09-01",
				salary: 20000,
				totalLeaveAllowed: 12,
				position: "Cashier",
				address: "House 12, Lane 5, Wari, Old Dhaka",
				emergencyContact: "+880 1618-345678",
				avatar: "/placeholder.svg?height=100&width=100&text=KU",
				email: "karim.uddin@hotel.com",
				nid: "5678901234567",
				bloodGroup: "B-",
				skills: [
					"Cash Handling",
					"Customer Service",
					"POS Systems",
					"Accounting",
				],
				performance: 4.7,
				leaves: [
					{
						date: "2023-12-22",
						reason: "Festival leave",
						approved: true,
						days: 3,
					},
				],
				advances: [],
				attendance: {
					present: 25,
					absent: 0,
					late: 1,
					overtime: 12,
				},
				createdAt: new Date(),
			},
			{
				name: "Nasir Ahmed",
				phone: "+880 1419-345678",
				joinDate: "2023-10-15",
				salary: 16000,
				totalLeaveAllowed: 12,
				position: "Delivery Boy",
				address: "House 89, Mohammadpur, Dhaka",
				emergencyContact: "+880 1519-345678",
				avatar: "/placeholder.svg?height=100&width=100&text=NA",
				email: "nasir.ahmed@hotel.com",
				nid: "6789012345678",
				bloodGroup: "A-",
				skills: ["Driving", "Customer Relations", "Time Management"],
				performance: 4.4,
				leaves: [
					{
						date: "2024-01-12",
						reason: "Bike repair",
						approved: true,
						days: 1,
					},
				],
				advances: [
					{
						date: "2023-12-28",
						amount: 3000,
						reason: "Bike maintenance",
						repaid: true,
					},
				],
				attendance: {
					present: 24,
					absent: 1,
					late: 2,
					overtime: 10,
				},
				createdAt: new Date(),
			},
		];

		for (const employee of employees) {
			await addDoc(collection(db, "employees"), employee);
		}

		// Seed products with comprehensive inventory data
		const products = [
			{
				name: "Premium Flour (Atta)",
				unit: "kg",
				initialStock: 200,
				currentStock: 15, // Low stock to trigger notification
				lowStockAlertAt: 25,
				estimatedWastagePercent: 2,
				pricePerUnit: 65,
				supplier: "Bashundhara Group",
				category: "Grains",
				expiryDate: "2024-06-15",
				batchNumber: "BG2024001",
				lastUpdated: "2024-01-07",
				reorderLevel: 50,
				maxStock: 300,
				createdAt: new Date(),
			},
			{
				name: "Refined Sugar",
				unit: "kg",
				initialStock: 100,
				currentStock: 0, // Out of stock to trigger critical notification
				lowStockAlertAt: 15,
				estimatedWastagePercent: 1,
				pricePerUnit: 75,
				supplier: "Fresh Food Ltd",
				category: "Sweeteners",
				expiryDate: "2024-12-31",
				batchNumber: "FF2024002",
				lastUpdated: "2024-01-06",
				reorderLevel: 25,
				maxStock: 150,
				createdAt: new Date(),
			},
			{
				name: "Soybean Oil",
				unit: "L",
				initialStock: 80,
				currentStock: 12,
				lowStockAlertAt: 15,
				estimatedWastagePercent: 0.5,
				pricePerUnit: 145,
				supplier: "City Group",
				category: "Oils",
				expiryDate: "2024-08-20",
				batchNumber: "CG2024003",
				lastUpdated: "2024-01-08",
				reorderLevel: 20,
				maxStock: 120,
				createdAt: new Date(),
			},
			{
				name: "Special Masala Mix",
				unit: "kg",
				initialStock: 30,
				currentStock: 5,
				lowStockAlertAt: 8,
				estimatedWastagePercent: 15, // High wastage to trigger notification
				pricePerUnit: 280,
				supplier: "Radhuni Spices",
				category: "Spices",
				expiryDate: "2024-05-10",
				batchNumber: "RS2024004",
				lastUpdated: "2024-01-05",
				reorderLevel: 10,
				maxStock: 50,
				createdAt: new Date(),
			},
			{
				name: "Iodized Salt",
				unit: "kg",
				initialStock: 40,
				currentStock: 25,
				lowStockAlertAt: 8,
				estimatedWastagePercent: 0.5,
				pricePerUnit: 35,
				supplier: "ACI Salt",
				category: "Minerals",
				expiryDate: "2025-01-01",
				batchNumber: "ACI2024005",
				lastUpdated: "2024-01-04",
				reorderLevel: 15,
				maxStock: 60,
				createdAt: new Date(),
			},
			{
				name: "Fresh Onion",
				unit: "kg",
				initialStock: 100,
				currentStock: 28,
				lowStockAlertAt: 20,
				estimatedWastagePercent: 12, // High wastage to trigger notification
				pricePerUnit: 55,
				supplier: "Local Market",
				category: "Vegetables",
				expiryDate: "2024-01-25",
				batchNumber: "LM2024006",
				lastUpdated: "2024-01-07",
				reorderLevel: 30,
				maxStock: 150,
				createdAt: new Date(),
			},
			{
				name: "Fresh Potato",
				unit: "kg",
				initialStock: 120,
				currentStock: 45,
				lowStockAlertAt: 25,
				estimatedWastagePercent: 8,
				pricePerUnit: 42,
				supplier: "Local Market",
				category: "Vegetables",
				expiryDate: "2024-02-15",
				batchNumber: "LM2024007",
				lastUpdated: "2024-01-06",
				reorderLevel: 40,
				maxStock: 180,
				createdAt: new Date(),
			},
			{
				name: "Fresh Chicken",
				unit: "kg",
				initialStock: 50,
				currentStock: 18,
				lowStockAlertAt: 12,
				estimatedWastagePercent: 5,
				pricePerUnit: 220,
				supplier: "Kazi Farms",
				category: "Meat",
				expiryDate: "2024-01-15",
				batchNumber: "KF2024008",
				lastUpdated: "2024-01-08",
				reorderLevel: 20,
				maxStock: 80,
				createdAt: new Date(),
			},
			{
				name: "Basmati Rice",
				unit: "kg",
				initialStock: 80,
				currentStock: 35,
				lowStockAlertAt: 15,
				estimatedWastagePercent: 1,
				pricePerUnit: 95,
				supplier: "Bashundhara Group",
				category: "Grains",
				expiryDate: "2024-09-30",
				batchNumber: "BG2024009",
				lastUpdated: "2024-01-05",
				reorderLevel: 25,
				maxStock: 120,
				createdAt: new Date(),
			},
			{
				name: "Green Chili",
				unit: "kg",
				initialStock: 20,
				currentStock: 8,
				lowStockAlertAt: 5,
				estimatedWastagePercent: 10,
				pricePerUnit: 85,
				supplier: "Local Market",
				category: "Vegetables",
				expiryDate: "2024-01-20",
				batchNumber: "LM2024010",
				lastUpdated: "2024-01-07",
				reorderLevel: 8,
				maxStock: 30,
				createdAt: new Date(),
			},
		];

		for (const product of products) {
			await addDoc(collection(db, "products"), product);
		}

		// Seed comprehensive snack recipes
		const snacks = [
			{
				name: "Traditional Singara",
				description:
					"Crispy triangular pastry filled with spiced potatoes and peas",
				recipe: [
					{
						productName: "Premium Flour (Atta)",
						amountPerUnit: 0.045,
						unit: "kg",
					},
					{ productName: "Fresh Potato", amountPerUnit: 0.08, unit: "kg" },
					{ productName: "Soybean Oil", amountPerUnit: 0.025, unit: "L" },
					{
						productName: "Special Masala Mix",
						amountPerUnit: 0.008,
						unit: "kg",
					},
					{ productName: "Fresh Onion", amountPerUnit: 0.015, unit: "kg" },
					{ productName: "Green Chili", amountPerUnit: 0.003, unit: "kg" },
					{ productName: "Iodized Salt", amountPerUnit: 0.002, unit: "kg" },
				],
				costPerUnit: 12.5,
				sellingPrice: 22,
				category: "Snacks",
				preparationTime: 35,
				difficulty: "Medium",
				popularity: 4.8,
				nutritionalInfo: {
					calories: 180,
					protein: 4.2,
					carbs: 22.5,
					fat: 8.1,
				},
				createdAt: new Date(),
			},
			{
				name: "Chicken Roll Deluxe",
				description:
					"Soft paratha wrapped with marinated chicken and fresh vegetables",
				recipe: [
					{
						productName: "Premium Flour (Atta)",
						amountPerUnit: 0.09,
						unit: "kg",
					},
					{ productName: "Fresh Chicken", amountPerUnit: 0.08, unit: "kg" },
					{ productName: "Soybean Oil", amountPerUnit: 0.035, unit: "L" },
					{ productName: "Fresh Onion", amountPerUnit: 0.025, unit: "kg" },
					{
						productName: "Special Masala Mix",
						amountPerUnit: 0.012,
						unit: "kg",
					},
					{ productName: "Green Chili", amountPerUnit: 0.005, unit: "kg" },
					{ productName: "Iodized Salt", amountPerUnit: 0.003, unit: "kg" },
				],
				costPerUnit: 22.8,
				sellingPrice: 42,
				category: "Main Items",
				preparationTime: 50,
				difficulty: "Hard",
				popularity: 4.9,
				nutritionalInfo: {
					calories: 320,
					protein: 18.5,
					carbs: 28.2,
					fat: 15.3,
				},
				createdAt: new Date(),
			},
			{
				name: "Chicken Shawarma Special",
				description:
					"Middle Eastern style chicken wrap with garlic sauce and vegetables",
				recipe: [
					{
						productName: "Premium Flour (Atta)",
						amountPerUnit: 0.07,
						unit: "kg",
					},
					{ productName: "Fresh Chicken", amountPerUnit: 0.12, unit: "kg" },
					{ productName: "Soybean Oil", amountPerUnit: 0.03, unit: "L" },
					{ productName: "Fresh Onion", amountPerUnit: 0.04, unit: "kg" },
					{
						productName: "Special Masala Mix",
						amountPerUnit: 0.015,
						unit: "kg",
					},
					{ productName: "Green Chili", amountPerUnit: 0.008, unit: "kg" },
				],
				costPerUnit: 32.5,
				sellingPrice: 58,
				category: "Main Items",
				preparationTime: 45,
				difficulty: "Hard",
				popularity: 4.7,
				nutritionalInfo: {
					calories: 420,
					protein: 25.8,
					carbs: 32.1,
					fat: 18.9,
				},
				createdAt: new Date(),
			},
			{
				name: "Vegetable Samosa",
				description: "Crispy triangular pastry with mixed vegetable filling",
				recipe: [
					{
						productName: "Premium Flour (Atta)",
						amountPerUnit: 0.04,
						unit: "kg",
					},
					{ productName: "Fresh Potato", amountPerUnit: 0.06, unit: "kg" },
					{ productName: "Soybean Oil", amountPerUnit: 0.02, unit: "L" },
					{
						productName: "Special Masala Mix",
						amountPerUnit: 0.008,
						unit: "kg",
					},
					{ productName: "Fresh Onion", amountPerUnit: 0.012, unit: "kg" },
					{ productName: "Green Chili", amountPerUnit: 0.004, unit: "kg" },
				],
				costPerUnit: 9.8,
				sellingPrice: 18,
				category: "Snacks",
				preparationTime: 30,
				difficulty: "Easy",
				popularity: 4.5,
				nutritionalInfo: {
					calories: 150,
					protein: 3.8,
					carbs: 20.2,
					fat: 6.5,
				},
				createdAt: new Date(),
			},
			{
				name: "Chicken Biryani",
				description:
					"Aromatic basmati rice cooked with marinated chicken and spices",
				recipe: [
					{ productName: "Basmati Rice", amountPerUnit: 0.15, unit: "kg" },
					{ productName: "Fresh Chicken", amountPerUnit: 0.1, unit: "kg" },
					{ productName: "Soybean Oil", amountPerUnit: 0.04, unit: "L" },
					{ productName: "Fresh Onion", amountPerUnit: 0.05, unit: "kg" },
					{
						productName: "Special Masala Mix",
						amountPerUnit: 0.02,
						unit: "kg",
					},
					{ productName: "Iodized Salt", amountPerUnit: 0.005, unit: "kg" },
				],
				costPerUnit: 45.2,
				sellingPrice: 85,
				category: "Rice Items",
				preparationTime: 90,
				difficulty: "Hard",
				popularity: 4.9,
				nutritionalInfo: {
					calories: 520,
					protein: 28.5,
					carbs: 65.8,
					fat: 18.2,
				},
				createdAt: new Date(),
			},
			{
				name: "Vegetable Fried Rice",
				description:
					"Stir-fried rice with mixed vegetables and aromatic spices",
				recipe: [
					{ productName: "Basmati Rice", amountPerUnit: 0.12, unit: "kg" },
					{ productName: "Fresh Potato", amountPerUnit: 0.03, unit: "kg" },
					{ productName: "Fresh Onion", amountPerUnit: 0.04, unit: "kg" },
					{ productName: "Soybean Oil", amountPerUnit: 0.03, unit: "L" },
					{
						productName: "Special Masala Mix",
						amountPerUnit: 0.01,
						unit: "kg",
					},
					{ productName: "Iodized Salt", amountPerUnit: 0.003, unit: "kg" },
				],
				costPerUnit: 28.5,
				sellingPrice: 52,
				category: "Rice Items",
				preparationTime: 40,
				difficulty: "Medium",
				popularity: 4.3,
				nutritionalInfo: {
					calories: 380,
					protein: 8.2,
					carbs: 58.5,
					fat: 12.8,
				},
				createdAt: new Date(),
			},
		];

		for (const snack of snacks) {
			await addDoc(collection(db, "snacks"), snack);
		}

		// Generate comprehensive production entries for the last 30 days
		const productionEntries = [];
		const today = new Date();

		for (let i = 0; i < 30; i++) {
			const date = new Date(today);
			date.setDate(date.getDate() - i);
			const dateString = date.toISOString().split("T")[0];

			// Vary production based on day of week (weekends higher)
			const isWeekend = date.getDay() === 0 || date.getDay() === 6;
			const multiplier = isWeekend ? 1.4 : 1.0;

			const baseProduction = [
				{
					snackName: "Traditional Singara",
					baseQuantity: 120,
					baseRevenue: 2640,
					baseCost: 1500,
				},
				{
					snackName: "Chicken Roll Deluxe",
					baseQuantity: 80,
					baseRevenue: 3360,
					baseCost: 1824,
				},
				{
					snackName: "Chicken Shawarma Special",
					baseQuantity: 45,
					baseRevenue: 2610,
					baseCost: 1462,
				},
				{
					snackName: "Vegetable Samosa",
					baseQuantity: 100,
					baseRevenue: 1800,
					baseCost: 980,
				},
				{
					snackName: "Chicken Biryani",
					baseQuantity: 25,
					baseRevenue: 2125,
					baseCost: 1130,
				},
				{
					snackName: "Vegetable Fried Rice",
					baseQuantity: 35,
					baseRevenue: 1820,
					baseCost: 997,
				},
			];

			const snacksProduced = baseProduction.map((item) => {
				const quantity = Math.floor(
					item.baseQuantity * multiplier * (0.8 + Math.random() * 0.4)
				);
				const revenue = quantity * (item.baseRevenue / item.baseQuantity);
				const cost = quantity * (item.baseCost / item.baseQuantity);
				return {
					snackName: item.snackName,
					quantity,
					revenue: Math.round(revenue),
					cost: Math.round(cost),
				};
			});

			const totalRevenue = snacksProduced.reduce(
				(sum, item) => sum + item.revenue,
				0
			);
			const totalCost = snacksProduced.reduce(
				(sum, item) => sum + item.cost,
				0
			);

			productionEntries.push({
				date: dateString,
				snacksProduced,
				totalRevenue,
				totalCost,
				netProfit: totalRevenue - totalCost,
				employeesPresent:
					i < 5
						? ["Ahmed Rahman", "Fatima Khatun", "Mohammad Ali", "Karim Uddin"]
						: i < 10
						? ["Ahmed Rahman", "Mohammad Ali", "Rashida Begum", "Karim Uddin"]
						: [
								"Ahmed Rahman",
								"Fatima Khatun",
								"Mohammad Ali",
								"Rashida Begum",
								"Karim Uddin",
								"Nasir Ahmed",
						  ],
				notes:
					i === 0
						? "Excellent sales day! High customer demand across all items."
						: i === 1
						? "Good business, steady flow of customers"
						: i === 7
						? "Weekend rush, increased production"
						: i === 14
						? "Festival season boost"
						: "Regular business day",
				weather: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][
					Math.floor(Math.random() * 4)
				],
				customerCount: Math.floor(totalRevenue / 45), // Average order value
				createdAt: new Date(),
			});
		}

		for (const entry of productionEntries) {
			await addDoc(collection(db, "productionEntries"), entry);
		}

		// Generate comprehensive expense data for the last 30 days
		const expenses = [];
		const expenseCategories = [
			{
				category: "Ingredients",
				subcategory: "Raw Materials",
				frequency: "daily",
			},
			{ category: "Labor", subcategory: "Salaries", frequency: "monthly" },
			{ category: "Labor", subcategory: "Overtime", frequency: "weekly" },
			{
				category: "Utilities",
				subcategory: "Electricity",
				frequency: "monthly",
			},
			{ category: "Utilities", subcategory: "Gas", frequency: "monthly" },
			{ category: "Utilities", subcategory: "Water", frequency: "monthly" },
			{ category: "Rent", subcategory: "Shop Rent", frequency: "monthly" },
			{
				category: "Marketing",
				subcategory: "Advertising",
				frequency: "weekly",
			},
			{
				category: "Equipment",
				subcategory: "Maintenance",
				frequency: "weekly",
			},
			{
				category: "Transportation",
				subcategory: "Delivery",
				frequency: "daily",
			},
			{
				category: "Packaging",
				subcategory: "Food Containers",
				frequency: "daily",
			},
			{ category: "Cleaning", subcategory: "Supplies", frequency: "weekly" },
			{
				category: "Insurance",
				subcategory: "Business Insurance",
				frequency: "monthly",
			},
			{
				category: "Miscellaneous",
				subcategory: "Office Supplies",
				frequency: "monthly",
			},
		];

		for (let i = 0; i < 30; i++) {
			const date = new Date(today);
			date.setDate(date.getDate() - i);
			const dateString = date.toISOString().split("T")[0];

			// Daily expenses
			if (Math.random() > 0.1) {
				// 90% chance of ingredient purchase
				expenses.push({
					date: dateString,
					category: "Ingredients",
					subcategory: "Raw Materials",
					description: "Daily ingredient purchase",
					amount: 2500 + Math.random() * 1500,
					vendor: ["Bashundhara Group", "Fresh Food Ltd", "Local Market"][
						Math.floor(Math.random() * 3)
					],
					paymentMethod: "Cash",
					invoiceNumber: `INV-${dateString}-${Math.floor(
						Math.random() * 1000
					)}`,
					createdAt: new Date(),
				});
			}

			if (Math.random() > 0.3) {
				// 70% chance of delivery expense
				expenses.push({
					date: dateString,
					category: "Transportation",
					subcategory: "Delivery",
					description: "Fuel and delivery costs",
					amount: 300 + Math.random() * 200,
					vendor: "Petrol Pump",
					paymentMethod: "Cash",
					invoiceNumber: `FUEL-${dateString}`,
					createdAt: new Date(),
				});
			}

			if (Math.random() > 0.4) {
				// 60% chance of packaging expense
				expenses.push({
					date: dateString,
					category: "Packaging",
					subcategory: "Food Containers",
					description: "Food packaging materials",
					amount: 400 + Math.random() * 300,
					vendor: "Packaging Solutions Ltd",
					paymentMethod: "Cash",
					invoiceNumber: `PKG-${dateString}`,
					createdAt: new Date(),
				});
			}

			// Weekly expenses (every 7 days)
			if (i % 7 === 0) {
				expenses.push({
					date: dateString,
					category: "Labor",
					subcategory: "Overtime",
					description: "Weekly overtime payments",
					amount: 3500 + Math.random() * 1500,
					vendor: "Staff",
					paymentMethod: "Cash",
					invoiceNumber: `OT-${dateString}`,
					createdAt: new Date(),
				});

				expenses.push({
					date: dateString,
					category: "Marketing",
					subcategory: "Advertising",
					description: "Social media and local advertising",
					amount: 1200 + Math.random() * 800,
					vendor: "Digital Marketing Agency",
					paymentMethod: "Bank Transfer",
					invoiceNumber: `ADV-${dateString}`,
					createdAt: new Date(),
				});

				expenses.push({
					date: dateString,
					category: "Equipment",
					subcategory: "Maintenance",
					description: "Kitchen equipment maintenance",
					amount: 800 + Math.random() * 1200,
					vendor: "Equipment Service Co",
					paymentMethod: "Cash",
					invoiceNumber: `MAINT-${dateString}`,
					createdAt: new Date(),
				});

				expenses.push({
					date: dateString,
					category: "Cleaning",
					subcategory: "Supplies",
					description: "Cleaning and sanitization supplies",
					amount: 600 + Math.random() * 400,
					vendor: "Cleaning Supplies Store",
					paymentMethod: "Cash",
					invoiceNumber: `CLEAN-${dateString}`,
					createdAt: new Date(),
				});
			}

			// Monthly expenses (first day of data and every 30 days)
			if (i === 29 || i === 0) {
				expenses.push({
					date: dateString,
					category: "Labor",
					subcategory: "Salaries",
					description: "Monthly staff salaries",
					amount: 124000, // Total of all employee salaries
					vendor: "Staff",
					paymentMethod: "Bank Transfer",
					invoiceNumber: `SAL-${dateString}`,
					createdAt: new Date(),
				});

				expenses.push({
					date: dateString,
					category: "Utilities",
					subcategory: "Electricity",
					description: "Monthly electricity bill",
					amount: 8500 + Math.random() * 2000,
					vendor: "DESCO",
					paymentMethod: "Bank Transfer",
					invoiceNumber: `ELEC-${dateString}`,
					createdAt: new Date(),
				});

				expenses.push({
					date: dateString,
					category: "Utilities",
					subcategory: "Gas",
					description: "Monthly gas bill",
					amount: 4500 + Math.random() * 1000,
					vendor: "Titas Gas",
					paymentMethod: "Bank Transfer",
					invoiceNumber: `GAS-${dateString}`,
					createdAt: new Date(),
				});

				expenses.push({
					date: dateString,
					category: "Utilities",
					subcategory: "Water",
					description: "Monthly water bill",
					amount: 1200 + Math.random() * 300,
					vendor: "DWASA",
					paymentMethod: "Bank Transfer",
					invoiceNumber: `WATER-${dateString}`,
					createdAt: new Date(),
				});

				expenses.push({
					date: dateString,
					category: "Rent",
					subcategory: "Shop Rent",
					description: "Monthly shop rent",
					amount: 35000,
					vendor: "Property Owner",
					paymentMethod: "Bank Transfer",
					invoiceNumber: `RENT-${dateString}`,
					createdAt: new Date(),
				});

				expenses.push({
					date: dateString,
					category: "Insurance",
					subcategory: "Business Insurance",
					description: "Monthly business insurance premium",
					amount: 2500,
					vendor: "Insurance Company",
					paymentMethod: "Bank Transfer",
					invoiceNumber: `INS-${dateString}`,
					createdAt: new Date(),
				});

				expenses.push({
					date: dateString,
					category: "Miscellaneous",
					subcategory: "Office Supplies",
					description: "Office and administrative supplies",
					amount: 800 + Math.random() * 500,
					vendor: "Office Mart",
					paymentMethod: "Cash",
					invoiceNumber: `OFF-${dateString}`,
					createdAt: new Date(),
				});
			}
		}

		for (const expense of expenses) {
			await addDoc(collection(db, "expenses"), expense);
		}

		// Generate customer data
		const customers = [
			{
				name: "Regular Customer 1",
				phone: "+880 1711-111111",
				email: "customer1@email.com",
				address: "Dhanmondi, Dhaka",
				totalOrders: 45,
				totalSpent: 18500,
				lastOrderDate: "2024-01-08",
				loyaltyPoints: 185,
				preferredItems: ["Chicken Roll Deluxe", "Chicken Biryani"],
				createdAt: new Date(),
			},
			{
				name: "Regular Customer 2",
				phone: "+880 1722-222222",
				email: "customer2@email.com",
				address: "Gulshan, Dhaka",
				totalOrders: 32,
				totalSpent: 14200,
				lastOrderDate: "2024-01-07",
				loyaltyPoints: 142,
				preferredItems: ["Traditional Singara", "Vegetable Samosa"],
				createdAt: new Date(),
			},
			{
				name: "Corporate Client",
				phone: "+880 1733-333333",
				email: "orders@company.com",
				address: "Motijheel, Dhaka",
				totalOrders: 28,
				totalSpent: 35600,
				lastOrderDate: "2024-01-08",
				loyaltyPoints: 356,
				preferredItems: ["Chicken Biryani", "Chicken Shawarma Special"],
				createdAt: new Date(),
			},
		];

		for (const customer of customers) {
			await addDoc(collection(db, "customers"), customer);
		}

		// Generate sales data
		const sales = [];
		for (let i = 0; i < 30; i++) {
			const date = new Date(today);
			date.setDate(date.getDate() - i);
			const dateString = date.toISOString().split("T")[0];

			// Generate 5-15 sales per day
			const salesCount = 5 + Math.floor(Math.random() * 10);

			for (let j = 0; j < salesCount; j++) {
				const items = [
					{
						name: "Traditional Singara",
						price: 22,
						quantity: 1 + Math.floor(Math.random() * 3),
					},
					{
						name: "Chicken Roll Deluxe",
						price: 42,
						quantity: 1 + Math.floor(Math.random() * 2),
					},
					{ name: "Chicken Shawarma Special", price: 58, quantity: 1 },
					{
						name: "Vegetable Samosa",
						price: 18,
						quantity: 2 + Math.floor(Math.random() * 4),
					},
					{ name: "Chicken Biryani", price: 85, quantity: 1 },
					{ name: "Vegetable Fried Rice", price: 52, quantity: 1 },
				];

				const selectedItems = items.slice(0, 1 + Math.floor(Math.random() * 3));
				const totalAmount = selectedItems.reduce(
					(sum, item) => sum + item.price * item.quantity,
					0
				);

				sales.push({
					date: dateString,
					time: `${8 + Math.floor(Math.random() * 12)}:${Math.floor(
						Math.random() * 60
					)
						.toString()
						.padStart(2, "0")}`,
					items: selectedItems,
					totalAmount,
					paymentMethod: ["Cash", "Card", "Mobile Banking"][
						Math.floor(Math.random() * 3)
					],
					customerType: ["Walk-in", "Regular", "Delivery"][
						Math.floor(Math.random() * 3)
					],
					discount: Math.random() > 0.8 ? Math.floor(totalAmount * 0.1) : 0,
					tax: Math.floor(totalAmount * 0.05),
					invoiceNumber: `INV-${dateString}-${j.toString().padStart(3, "0")}`,
					createdAt: new Date(),
				});
			}
		}

		for (const sale of sales) {
			await addDoc(collection(db, "sales"), sale);
		}

		// Seed some initial notifications
		const initialNotifications = [
			{
				title: "🎉 Welcome to Hotel Manager Pro",
				message:
					"Your comprehensive hotel management system is now set up with complete demo data. Explore all features including real-time analytics, expense tracking, and inventory management!",
				type: "success",
				priority: "low",
				read: false,
				category: "system",
				actionRequired: false,
				createdAt: new Date(),
			},
			{
				title: "📊 Demo Data Loaded",
				message:
					"30 days of production data, comprehensive expense records, employee information, and sales data have been loaded. Check the dashboard for complete business insights.",
				type: "info",
				priority: "medium",
				read: false,
				category: "system",
				actionRequired: false,
				createdAt: new Date(),
			},
			{
				title: "🔍 Explore Features",
				message:
					"Try the advanced reporting system, real-time notifications, expense breakdown analysis, and employee management tools. All data is realistic and comprehensive.",
				type: "info",
				priority: "low",
				read: false,
				category: "system",
				actionRequired: false,
				createdAt: new Date(),
			},
		];

		for (const notification of initialNotifications) {
			await addDoc(collection(db, "notifications"), notification);
		}

		console.log("Comprehensive Firebase demo data seeded successfully!");
		console.log("✅ 6 Employees with detailed profiles");
		console.log("✅ 10 Products with inventory tracking");
		console.log("✅ 6 Snack recipes with nutritional info");
		console.log("✅ 30 days of production data");
		console.log("✅ Comprehensive expense records");
		console.log("✅ 7 Suppliers with contact details");
		console.log("✅ Customer database");
		console.log("✅ Sales transaction history");
		console.log("✅ Real-time notifications");

		return true;
	} catch (error) {
		console.error("Error seeding comprehensive data:", error);
		return false;
	}
};

const clearCollection = async (collectionName: string) => {
	const querySnapshot = await getDocs(collection(db, collectionName));
	const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
	await Promise.all(deletePromises);
};
