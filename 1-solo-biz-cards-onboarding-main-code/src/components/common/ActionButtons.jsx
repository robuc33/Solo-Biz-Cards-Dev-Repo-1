// src/components/common/ActionButtons.jsx
import { useContext, useState } from "react";
import domtoimage from "dom-to-image";
import { Link } from "react-router-dom";
import { Image, Download, Save, Share, Grid as GridIcon } from "lucide-react";
import { CardDataContext } from "../../contexts/CardContext.js";
import { useToast } from "../../contexts/ToastContext.jsx";
import { auth, db } from "../../services/firebase";
import { Crown } from "lucide-react";
import { uploadImageToCloudinary } from "../../services/upload";
import { DownloadContext } from "../../contexts/DownloadContext";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext.jsx";
import ShareModal from "./ShareModal";

const clearedCardData = {
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

export default function ActionButtons() {
  const { cardData, setCardData } = useContext(CardDataContext);
  const { showToast } = useToast();
  const { downloadMode, setDownloadMode } = useContext(DownloadContext);
  const { isAuthenticated } = useAuth();
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  // New state to control the loader
  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  async function handleSaveCard(
    cardData,
    showToast,
    auth,
    setCardData,
    setIsReferralModalOpen,
    setIsSaving
  ) {
    setIsSaving(true);

    if (!cardData.profile.cardName || cardData.profile.cardName.trim() === "") {
      showToast("Card Name is required.", "error");
      setIsSaving(false);
      return;
    } else if (
      !cardData.profile.businessCategory ||
      cardData.profile.businessCategory.trim() === ""
    ) {
      showToast("Business Category is required.", "error");
      setIsSaving(false);
      return;
    } else if (
      !cardData.business.first ||
      cardData.business.first.trim() === ""
    ) {
      showToast("First Name is required.", "error");
      setIsSaving(false);
      return;
    } else if (
      !cardData.business.last ||
      cardData.business.last.trim() === ""
    ) {
      showToast("Last Name is required.", "error");
      setIsSaving(false);
      return;
    }

    const user = auth.currentUser;
    let savedCards = JSON.parse(localStorage.getItem("savedCards")) || [];
    const isLocalCard = savedCards.some((c) => c.id === cardData.id);

    // If the card is local, update local storage only.
    if (isLocalCard) {
      try {
        cardData.id = cardData.id || crypto.randomUUID();
        cardData.updatedAt = Date.now();
        if (!cardData.createdAt) {
          cardData.createdAt = cardData.updatedAt;
        }

        const existingIndex = savedCards.findIndex((c) => c.id === cardData.id);
        if (existingIndex !== -1) {
          savedCards[existingIndex] = cardData;
        } else {
          if (savedCards.length >= 10) {
            showToast(
              "You have exceeded the limit to save local cards.",
              "warning"
            );
            setIsSaving(false);
            return;
          }
          savedCards.push(cardData);
        }
        localStorage.setItem("savedCards", JSON.stringify(savedCards));

        showToast("Local card updated successfully!", "success");
        setCardData(clearedCardData);
        setIsSaving(false);
        return;
      } catch (error) {
        console.error("Error saving card locally:", error);
        showToast("Failed to save card locally.", "error");
        setIsSaving(false);
        return;
      }
    }

    // If not a local card, proceed with Firestore save (if user is logged in)
    if (user) {
      // **Check how many cards the user has in Firestore**
      const userCardsQuery = query(
        collection(db, "cards"),
        where("uid", "==", user.uid)
      );
      const snapshot = await getDocs(userCardsQuery);
      const existingCards = snapshot.docs.map((doc) => doc.id);

      const isEditing = cardData._id && existingCards.includes(cardData._id);
      const canSaveToFirestore = isEditing || snapshot.size < 2;

      if (canSaveToFirestore) {
        try {
          // **Upload images ONLY if saving to Firestore**
          if (
            cardData.profile.profilePic &&
            !cardData.profile.profilePic.startsWith("http")
          ) {
            cardData.profile.profilePic = await uploadImageToCloudinary(
              cardData.profile.profilePic
            );
          }

          if (
            cardData.cta &&
            cardData.cta.adsImg &&
            !cardData.cta.adsImg.startsWith("http")
          ) {
            cardData.cta.adsImg = await uploadImageToCloudinary(
              cardData.cta.adsImg
            );
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          showToast(
            "Failed to upload image. Please try a different image.",
            "error"
          );
          setIsSaving(false);
          return;
        }

        try {
          cardData.uid = user.uid;
          const cardId = cardData._id || crypto.randomUUID();
          cardData._id = cardId;
          cardData.updatedAt = Date.now();
          if (!cardData.createdAt) {
            cardData.createdAt = cardData.updatedAt;
          }

          const cardRef = doc(collection(db, "cards"), cardId);
          await setDoc(cardRef, cardData, { merge: true });

          showToast("Card saved successfully!", "success");
          setCardData(clearedCardData);
          setIsSaving(false);
          return;
        } catch (error) {
          console.error("Error saving card to Firestore:", error);
          showToast(
            "Failed to save card. The image might be too large or in an unsupported format. Please try a different image.",
            "error"
          );
          setIsSaving(false);
          return;
        }
      }
    }

    // If not saved to Firestore, fall back to local storage (for new cards)
    try {
      cardData.id = cardData.id || crypto.randomUUID();
      cardData.updatedAt = Date.now();
      if (!cardData.createdAt) {
        cardData.createdAt = cardData.updatedAt;
      }

      const existingIndex = savedCards.findIndex((c) => c.id === cardData.id);
      if (existingIndex !== -1) {
        savedCards[existingIndex] = cardData;
      } else {
        if (savedCards.length >= 10) {
          showToast(
            "You have exceeded the limit to save local cards.",
            "warning"
          );
          setIsSaving(false);
          return;
        }
        savedCards.push(cardData);
      }

      localStorage.setItem("savedCards", JSON.stringify(savedCards));

      showToast(
        auth.currentUser
          ? "Card saved to local storage!"
          : "Card saved locally! Login to sync.",
        "success"
      );
      setCardData(clearedCardData);
    } catch (error) {
      console.error("Error saving card locally:", error);
      showToast("Failed to save card locally.", "error");
    }

    // End loader state
    setIsSaving(false);
  }

  const handleDownload = async () => {
    const { profile, business } = cardData;
    const { cardName } = profile;
    const { first, last } = business;

    if (!cardName || !first || !last) {
      showToast(
        "Please fill in all the required fields to download card.",
        "error"
      );
      return;
    }

    const previewElement = document.getElementById("card-preview");
    if (!previewElement) return;

    // Ensure the preview element is relatively positioned for proper layout
    if (window.getComputedStyle(previewElement).position === "static") {
      previewElement.style.position = "relative";
    }

    setDownloadMode(true);

    // Wait a short time to let React re-render with the watermark visible
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      // Clone the preview element to force default wide screen styling
      const clone = previewElement.cloneNode(true);

      // Create an off-screen container with a fixed wide screen width
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.top = "-10000px";
      container.style.left = "-10000px";
      container.style.width = "1024px"; // fixed wide screen width
      container.appendChild(clone);
      document.body.appendChild(container);

      // Capture the clone as a PNG Data URL via dom-to-image
      const dataUrl = await domtoimage.toPng(clone, {
        useCORS: true,
        cacheBust: true,
      });

      // Trigger download using the captured data URL
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${cardName}.png`;
      link.click();

      // Remove the off-screen container after capture
      document.body.removeChild(container);
    } catch (error) {
      console.error("Error capturing card preview:", error);
    } finally {
      // After a delay, revert the watermark visibility using state
      setTimeout(() => {
        setDownloadMode(false);
      }, 200);
    }
  };

  const handleDownloadVCard = () => {
    // Extract business data from context
    const { profile, business } = cardData;
    const { cardName } = profile;

    const {
      first,
      last,
      accreditations,
      name,
      jobTitle,
      phone,
      email,
      website,
      address,
    } = business;
    const { street, city, state, zip, country } = address;

    if (!cardName || !first || !last) {
      showToast(
        "Please fill in all the required fields to download card.",
        "error"
      );
      return;
    }

    // Construct the vCard string following the vCard 3.0 spec.
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:${last || ""};${first || ""};;;
FN:${first || ""} ${last || ""}
ORG:${name || ""}
TITLE:${jobTitle || ""}
TEL;TYPE=WORK,VOICE:${phone || ""}
EMAIL;TYPE=INTERNET:${email || ""}
URL:${website || ""}
ADR;TYPE=WORK:;;${street || ""};${city || ""};${state || ""};${zip || ""};${country || ""}
NOTE:${accreditations || ""}
END:VCARD`;

    // Create a Blob from the vCard data
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cardName}.vcf`;
    link.click();

    // Clean up the URL object after download
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  return (
    <div className="space-y-4">
      {/* First Row Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center h-12 sm:h-10 w-full px-4 bg-[rgb(5,150,105)] text-white rounded-lg text-sm sm:text-base transition-all duration-150 ease-in-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer gap-2"
        >
          <Image className="size-5 sm:size-4" />
          <span className="whitespace-nowrap">Download Image</span>
        </button>
        <button
          onClick={handleDownloadVCard}
          className="flex items-center justify-center h-12 sm:h-10 w-full px-4 bg-[rgb(147,51,234)] text-white rounded-lg text-sm sm:text-base transition-all duration-150 ease-in-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer gap-2"
        >
          <Download className="size-5 sm:size-4" />
          <span className="whitespace-nowrap">Download vCard</span>
        </button>
      </div>

      {/* Second Row Group */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
        <div className="sm:col-span-2">
          <button
            onClick={() =>
              handleSaveCard(
                cardData,
                showToast,
                auth,
                setCardData,
                setIsReferralModalOpen,
                setIsSaving
              )
            }
            disabled={isSaving}
            className="flex items-center justify-center h-12 sm:h-10 w-full px-4 bg-[rgb(22,163,74)] text-white rounded-lg text-sm sm:text-base transition-all duration-150 ease-in-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer gap-2 disabled:opacity-50 "
          >
            {isSaving ? (
              cardData?._id || cardData?.id ? (
                "Updating..."
              ) : (
                "Saving card..."
              )
            ) : (
              <>
                <Save className="size-5 sm:size-4" />
                <span className="whitespace-nowrap">
                  {cardData?._id || cardData?.id ? "Update Card" : "Save Card"}
                </span>
              </>
            )}
          </button>
        </div>

        <Link to="/dashboard">
          <button className="flex items-center justify-center h-12 sm:h-10 w-full px-4 bg-[rgb(79,70,229)] text-white rounded-lg text-sm sm:text-base transition-all duration-150 ease-in-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer gap-2">
            <GridIcon className="size-5 sm:size-4" />
            <span className="whitespace-nowrap">Dashboard</span>
          </button>
        </Link>
      </div>

      {/* Add a share button
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Share
        </button>
      </div> */}

      {isReferralModalOpen && (
        <div
          className="z-10 fixed inset-0 h-screen flex items-center justify-center bg-[rgba(0,0,0,0.3)] backdrop-blur-sm overflow-hidden"
          onClick={() => setIsReferralModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md mx-auto p-6 rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button (X) */}
            <button
              onClick={() => setIsReferralModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="flex flex-col items-center space-y-4 text-center">
              <Crown className="w-8 h-8 text-yellow-500" />
              <h2 className="text-xl font-bold">Pro Feature</h2>
              <p className="text-gray-700 leading-relaxed">
                You have exceeded the limit. Upgrade to Pro to save more cards.
              </p>

              <button
                onClick={() => setIsReferralModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Include the ShareModal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        cardId={cardData._id}
        cardName={cardData.profile?.cardName}
      />
    </div>
  );
}
