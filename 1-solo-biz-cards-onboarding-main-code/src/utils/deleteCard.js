// src/utils/deleteCard.js
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export async function deleteCardById(cardId) {
  try {
    // Reference the document in the "cards" collection with the given cardId
    const cardDocRef = doc(db, "cards", cardId);

    // Delete the document
    await deleteDoc(cardDocRef);

   
  } catch (error) {
    console.error("Error deleting card:", error);
    throw error;
  }
}
