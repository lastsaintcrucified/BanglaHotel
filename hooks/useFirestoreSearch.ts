// lib/hooks/useFirestoreSearch.ts
import { useState, useCallback } from "react";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";

type FirestoreSearchOptions<T> = {
	collectionName: string;
	searchFields: (keyof T)[];
};

export function useFirestoreSearch<T extends DocumentData>({
	collectionName,
	searchFields,
}: FirestoreSearchOptions<T>) {
	const [results, setResults] = useState<(T & { id: string })[]>([]);
	const [loadingFS, setLoadingFS] = useState(false);
	const [error, setError] = useState<null | string>(null);

	const search = useCallback(
		async (query: string) => {
			setLoadingFS(true);
			setError(null);

			try {
				const colRef = collection(db, collectionName);
				const snapshot = await getDocs(colRef);
				const lowerQuery = query.toLowerCase();

				const filtered = snapshot.docs
					.map((doc) => ({ id: doc.id, ...doc.data() } as T & { id: string }))
					.filter((doc) =>
						searchFields.some((field) =>
							String(doc[field] || "")
								.toLowerCase()
								.includes(lowerQuery)
						)
					);

				setResults(filtered);
			} catch (err) {
				console.error(err);
				setError("Failed to search collection.");
			} finally {
				setLoadingFS(false);
			}
		},
		[collectionName, searchFields]
	);

	return { results, loadingFS, error, search };
}
