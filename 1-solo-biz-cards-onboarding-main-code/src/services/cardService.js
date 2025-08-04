import { setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";

async function saveCardToFirestore(cardData, userId) {
  try {
    const docRef = await setDoc(
      doc(db, "users", userId, "cards", cardData.id),
      cardData
    );
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export { saveCardToFirestore };
