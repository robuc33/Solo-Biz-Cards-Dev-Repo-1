// utils/fetchCards.js
import {
  collection,
  getDocs,
  query,
  where,
  startAfter,
  limit,
  orderBy,
  getDoc,
  doc,
  getCountFromServer,
} from "firebase/firestore";
import { db, auth } from "../services/firebase";

export const fetchMyCards = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found");
    }

    const cardsRef = collection(db, "cards");
    const q = query(cardsRef, where("uid", "==", user.uid));
    const response = await getDocs(q);
    const res = response.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        _id: doc.id,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });
    return res;
  } catch (error) {
    console.error("Error fetching my cards:", error);
    throw error;
  }
};

export const fetchCardById = async (id) => {
  try {
    if (!id) throw new Error("Card ID is required");
    const cardRef = doc(db, "cards", id);
    const cardSnap = await getDoc(cardRef);

    // fetch user data
    const userRef = doc(db, "users", cardSnap.data().uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    // add userId to card data
    const cardData = {
      ...cardSnap.data(),
      _id: cardSnap.id,
      user: {
        ...userData,
      },
    };

    if (!cardSnap.exists()) {
      throw new Error("Card not found");
    }

    return { success: true, data: cardData };
  } catch (error) {
    throw error;
  }
};

export const fetchPublicCards = async (lastVisible = null, pageSize = 12) => {
  try {
    const cardsRef = collection(db, "cards");

    let q;
    if (lastVisible) {
      q = query(
        cardsRef,
        where("visibility", "==", "public"),
        orderBy("createdAt"),
        startAfter(lastVisible),
        limit(pageSize)
      );
    } else {
      q = query(
        cardsRef,
        where("visibility", "==", "public"),
        orderBy("createdAt"),
        limit(pageSize)
      );
    }

    const response = await getDocs(q);
    const cards = response.docs.map((doc) => ({
      ...doc.data(),
      _id: doc.id,
    }));

    const newLastVisible = response.docs[response.docs.length - 1];

    return { cards, lastVisible: newLastVisible };
  } catch (error) {
    console.error("Error fetching public cards:", error);
    throw error;
  }
};

export const fetchCardByNameOrCompany = async (name) => {
  try {
    const cardsRef = collection(db, "cards");

    // Query for matching first names
    const qFirst = query(
      cardsRef,
      where("business.first", "==", name),
      where("visibility", "==", "public")
    );
    const responseFirst = await getDocs(qFirst);
    const cardsFirst = responseFirst.docs.map((doc) => ({
      ...doc.data(),
      _id: doc.id,
    }));

    const qCompany = query(
      cardsRef,
      where("business.name", "==", name),
      where("visibility", "==", "public")
    );
    const responseCompany = await getDocs(qCompany);
    const cardsCompany = responseCompany.docs.map((doc) => ({
      ...doc.data(),
      _id: doc.id,
    }));

    const mergedCards = [...cardsFirst];
    cardsCompany.forEach((card) => {
      if (!mergedCards.some((c) => c._id === card._id)) {
        mergedCards.push(card);
      }
    });

    console.log("Merged cards:", mergedCards);
    return mergedCards;
  } catch (error) {
    console.error("Error fetching card by name:", error);
    return [];
  }
};

export const fetchPublicCardsCount = async () => {
  try {
    const cardsRef = collection(db, "cards");
    const q = query(cardsRef, where("visibility", "==", "public"));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error fetching public cards count:", error);
    throw error;
  }
};
