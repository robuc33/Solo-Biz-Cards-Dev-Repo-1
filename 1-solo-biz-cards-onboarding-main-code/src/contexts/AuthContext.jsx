import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { signUp, signIn, logOut } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Merge all userData fields (including lastUpdated) with firebaseUser
          setUser({ ...firebaseUser, ...userData });
        } else {
          setUser(firebaseUser);
        }

        setIsAuthenticated(true);
      } else {
        clearAuth();
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveLocalCardsToDB = async (uid) => {
    const localCards = JSON.parse(localStorage.getItem("savedCards")) || [];
    if (localCards.length === 0) return;

    try {
      for (const card of localCards) {
        card.uid = uid;
        await addDoc(collection(db, "cards"), card);
      }
      localStorage.removeItem("savedCards");
      console.log("All local cards saved to DB.");
    } catch (error) {
      console.error("Error saving cards:", error);
    }
  };

  const register = async (name, email, password) => {
    try {
      const userCredential = await signUp(email, password);

      await setDoc(doc(db, "users", userCredential.uid), {
        uid: userCredential.uid,
        name,
        email,
        createdAt: new Date().toISOString(),
      });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message.match(/\((.*?)\)/)?.[1] || err.message,
      };
    }
  };

  const login = async (email, password) => {
    try {
      await signIn(email, password);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message.match(/\((.*?)\)/)?.[1] || err.message,
      };
    }
  };

  const logout = async () => {
    try {
      await logOut();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message.match(/\((.*?)\)/)?.[1] || err.message,
      };
    }
  };

  const updateUser = async (updates) => {
    if (!user) return { success: false, error: "User not logged in" };

    try {
      const userRef = doc(db, "users", user.uid);
      const firestoreUpdates = { lastUpdated: new Date().toISOString() };

      if (updates.name) {
        await updateProfile(auth.currentUser, { displayName: updates.name });
        firestoreUpdates.name = updates.name;
      }

      if (updates.password) {
        await updatePassword(auth.currentUser, updates.password);
      }

      await updateDoc(userRef, firestoreUpdates);

      setUser((prev) => ({
        ...prev,
        ...updates,
        lastUpdated: firestoreUpdates.lastUpdated,
      }));

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message.match(/\((.*?)\)/)?.[1] || err.message,
      };
    }
  };

  const clearAuth = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
