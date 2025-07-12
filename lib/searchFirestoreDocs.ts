// lib/firestore/searchFirestoreDocs.ts
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase"; // adjust if needed

/**
 * Search Firestore documents in a collection based on a text field
 *
 * @param collectionName - The Firestore collection name (e.g., "employees")
 * @param field - The field to match against (e.g., "name")
 * @param searchTerm - The value to search (case-insensitive partial match)
 */
export async function searchFirestoreDocs<T extends DocumentData>(
	collectionName: string,
	field: string,
	searchTerm: string
): Promise<(T & { id: string })[]> {
	const colRef = collection(db, collectionName);
	const docsSnap = await getDocs(colRef);

	const lowerTerm = searchTerm.toLowerCase();

	const filtered = docsSnap.docs
		.map((doc) => ({ id: doc.id, ...doc.data() } as T & { id: string }))
		.filter((doc) => String(doc[field])?.toLowerCase().includes(lowerTerm));

	return filtered;
}
