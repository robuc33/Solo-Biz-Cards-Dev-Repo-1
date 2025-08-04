// src/contexts/CardDataContext.jsx
import { useEffect, useState } from "react";
import { CardDataContext } from "./CardContext";
import { useToast } from "../contexts/ToastContext";
export const initialCardData = {
  visibility: "private",
  theme: "#4299E1",
  profile: {
    cardName: "",
    profilePic: null,
  },
  business: {
    first: "",
    last: "",
    accreditations: "",
    name: "",
    jobTitle: "",
    department: "",
    slogan: "",
    phone: "",
    email: "",
    website: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  },
  social: {
    linkedin: "",
    twitter: "",
    facebook: "",
    youtube: "",
    instagram: "",
    tiktok: "",
  },
  about: {
    aboutMe: "",
  },
  cta: {
    type: "booking",
    link: "",
    label: "",
    adsType: "product",
    adsImg: null,
  },
};

export function CardDataProvider({ children }) {
  const { showToast } = useToast();
  const [cardData, setCardData] = useState(() => {
    const saved = localStorage.getItem("cardData");
    return saved ? JSON.parse(saved) : initialCardData;
  });

  useEffect(() => {
    try {
      localStorage.setItem("cardData", JSON.stringify(cardData));
    } catch (error) {
      console.log(error);
      showToast("Image too large.", "error");
    }
  }, [cardData]);

  const value = { cardData, setCardData };

  return (
    <CardDataContext.Provider value={value}>
      {children}
    </CardDataContext.Provider>
  );
}
