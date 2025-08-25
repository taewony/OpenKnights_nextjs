import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

/**
 * Firestore 컬렉션에서 특정 필드의 값이 고유하도록 숫자 접미사를 붙여 반환합니다.
 * @param collectionName - 컬렉션 이름 (e.g., "users")
 * @param fieldName - 고유성을 검사할 필드 이름 (e.g., "name")
 * @param baseName - 기본 이름
 * @returns 고유성이 보장된 이름
 */
export async function generateUniqueName(collectionName: string, fieldName: string, baseName: string): Promise<string> {
  const db = getFirestore();
  const collectionRef = collection(db, collectionName);

  let newName = baseName;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const q = query(collectionRef, where(fieldName, "==", newName));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      isUnique = true;
    } else {
      newName = `${baseName}${counter}`;
      counter++;
    }
  }
  return newName;
}
