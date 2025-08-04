// src/components/Dashboard.jsx
import { useState, useEffect, useContext, use } from "react";
import Header from "../components/Header";
import {
  UserPlus,
  Users,
  Plus,
  CreditCard,
  Globe,
  Search,
  Crown,
  Lock,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // <-- Adjust path if needed
import { fetchCardById, fetchMyCards } from "../utils/fetchCards";
import { deleteCardById } from "../utils/deleteCard"; // <-- Import deleteCard API function
import SignUpModal from "../components/SignUpModal";
import SignInModal from "../components/SignInModal";
import { CardDataContext } from "../contexts/CardContext";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import CircularIndeterminate from "../components/common/Loader";
import { uploadImageToCloudinary } from "../services/upload";
import { useToast } from "../contexts/ToastContext";
import AddNewCard from "../components/AddCard";
import useTitle from "../hooks/useTitle";
const Dashboard = () => {
  const navigate = useNavigate();

  const { setCardData } = useContext(CardDataContext);
  const { isAuthenticated } = useAuth();
  const { user } = useAuth();
  const [universalCardsLen, setUniversalCardsLen] = useState(0);
  const [loadingUniversal, setLoadingUniversal] = useState(false);

  // Default to "local" tab
  const [selectedTab, setSelectedTab] = useState("");
  useEffect(() => {
    if (isAuthenticated) {
      setSelectedTab("universal");
    } else {
      setSelectedTab("local");
      setUniversalCardsLen(0);
    }
  }, [isAuthenticated]);

  // Grid or list view
  const [view, setView] = useState("grid");

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [signInMessage, setSignInMessage] = useState("");

  // Referral modal state
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isProFeatureModelOpen, setIsProFeatureModelOpen] = useState(false);

  // Analytics modal state
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  // Local cards (from local storage)
  const [localCards, setLocalCards] = useState([]);

  // Universal cards (fetched from backend for logged-in users)
  const [universalCards, setUniversalCards] = useState([]);

  // Search & sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // === NEW: Menu open/close state for three-dots menu ===
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savingMessage, setSavingMessage] = useState(null);
  const { showToast } = useToast();

  async function handleView(cardId) {
    const storedCards = JSON.parse(localStorage.getItem("savedCards") || "[]");

    if (cardId) {
      // Search for the card in local storage using _id
      const localCard = storedCards.find((card) => card.id === cardId);

      if (localCard) {
        navigate("/view/local/" + localCard.id, {
          state: { cardData: localCard },
        });
        return;
      } else {
        try {
          // Fetch from API if not found locally
          const { data } = await fetchCardById(cardId);
          navigate("/view/" + data._id, { state: { cardData: data } });
        } catch (error) {
          console.error("Error fetching card:", error);
        }
      }
    } else {
      console.warn("No card ID provided.");
    }
  }

  async function handleEdit(cardId) {
    const storedCards = JSON.parse(localStorage.getItem("savedCards") || "[]");

    const localCard = storedCards.find((card) => card.id === cardId);

    if (localCard) {
      localCard.updatedAt = Date.now();
      setCardData(localCard);
      navigate("/edit-card", { state: { cardId: localCard.id } });
      return;
    }

    if (cardId) {
      try {
        const result = await fetchCardById(cardId);
        if (result.success) {
          result.data.updatedAt = Date.now();
          setCardData(result.data);
          navigate("/edit-card");
        } else {
          console.error("Failed to fetch card:", result.error);
        }
      } catch (error) {
        console.error("Error fetching card for edit:", error);
      }
    } else {
      console.warn("No local or remote card found.");
    }
  }

  async function handleShare(cardId) {
    const shareableLink = `${window.location.origin}/view?cardId=${cardId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this card!",
          text: "I found this amazing card. Have a look!",
          url: shareableLink,
        });
        console.log("Card shared successfully!");
      } catch (error) {
        console.error("Error sharing card:", error);
      }
    } else {
      // Fallback if Web Share API is not supported:
      try {
        await navigator.clipboard.writeText(shareableLink);
        alert("Link copied to clipboard: " + shareableLink);
      } catch (error) {
        console.error("Error copying link to clipboard:", error);
      }
    }
  }
  async function handleSavePermanently(cardId) {
    if (auth.currentUser) {
      const userCardsQuery = query(
        collection(db, "cards"),
        where("uid", "==", auth.currentUser.uid)
      );
      const snapshot = await getDocs(userCardsQuery);
      const existingCards = snapshot.docs.map((doc) => doc.id);
      const isEditing = cardId && existingCards.includes(cardId);

      if (!isEditing && snapshot.size >= 2) {
        setIsProFeatureModelOpen(true);
        return;
      }
    }

    const localCards = JSON.parse(localStorage.getItem("savedCards")) || [];
    const card = localCards.find((c) => c.id === cardId);

    if (!card) {
      console.error("Card not found in local storage.");
      return;
    }

    try {
      setIsSaving(true); // Show loader
      setSavingMessage("Syncing to cloud...");

      // Only upload images if saving to Firestore (i.e. user is logged in)
      if (auth.currentUser) {
        try {
          if (
            card.profile.profilePic &&
            !card.profile.profilePic.startsWith("http")
          ) {
            card.profile.profilePic = await uploadImageToCloudinary(
              card.profile.profilePic
            );
          }
          if (
            card.cta &&
            card.cta.adsImg &&
            !card.cta.adsImg.startsWith("http")
          ) {
            card.cta.adsImg = await uploadImageToCloudinary(card.cta.adsImg);
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          showToast(
            "Failed to upload image. Please try a different image.",
            "error"
          );
          setIsSaving(false);
          setSavingMessage(null);
          return;
        }
      }

      const uid = auth.currentUser.uid;
      card.uid = uid;

      await addDoc(collection(db, "cards"), card);

      const updatedLocalCards = localCards.filter((c) => c.id !== cardId);
      localStorage.setItem("savedCards", JSON.stringify(updatedLocalCards));
      setLocalCards(updatedLocalCards);
    } catch (error) {
      console.error("Error saving card:", error);
    } finally {
      setIsSaving(false); // Hide loader
      setSavingMessage(null);
    }
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate(); // day without leading zero
    const year = date.getFullYear();
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const month = monthNames[date.getMonth()];

    return `${month} ${day}, ${year}`;
  }

  var createdAt = user?.metadata?.createdAt
    ? formatTimestamp(Number(user.metadata.createdAt))
    : "N/A";

  const handleMenuToggle = (idx) => {
    setOpenMenuIndex(openMenuIndex === idx ? null : idx);
  };

  const handleMenuClose = () => {
    setOpenMenuIndex(null);
  };

  // Delete handler: calls deleteCardById and updates universalCards state
  const handleDeleteCard = async (id) => {
    try {
      setIsSaving(true);
      setSavingMessage("Deleting card...");

      const saved = JSON.parse(localStorage.getItem("savedCards")) || [];
      const isLocalCard = saved.some((card) => card.id === id);

      if (isLocalCard) {
        const updatedLocalCards = saved.filter((card) => card.id !== id);
        localStorage.setItem("savedCards", JSON.stringify(updatedLocalCards));
        setLocalCards(updatedLocalCards);
      } else {
        await deleteCardById(id);
        setUniversalCards((prev) => prev.filter((card) => card._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete card:", error);
    } finally {
      setIsSaving(false);
      setSavingMessage(null);
    }
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedCards")) || [];
    setLocalCards(saved);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && selectedTab === "universal") {
      setLoadingUniversal(true);
      fetchMyCards()
        .then((data) => {
          setUniversalCards(data);
          setUniversalCardsLen(data.length);
        })
        .catch((err) => {
          console.error(err);
          setUniversalCards([]);
        })
        .finally(() => {
          setLoadingUniversal(false);
        });
    }
  }, [isAuthenticated, selectedTab]);

  // For local cards: filter & sort logic
  const filteredCards = localCards.filter((card) => {
    const fullName =
      `${card.business.first || ""} ${card.business.last || ""}`.toLowerCase();
    const companyName = (card.business.name || "").toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      companyName.includes(searchTerm.toLowerCase())
    );
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sortBy === "name") {
      const nameA =
        `${a.business.first || ""}${a.business.last || ""}`.toLowerCase();
      const nameB =
        `${b.business.first || ""}${b.business.last || ""}`.toLowerCase();
      return nameA.localeCompare(nameB);
    }
    if (sortBy === "company") {
      const compA = (a.business.name || "").toLowerCase();
      const compB = (b.business.name || "").toLowerCase();
      return compA.localeCompare(compB);
    }
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const mappedUniversalCards = universalCards.map((card) => ({
    id: card._id, // include the card id for deletion
    visibility: card.visibility, // or card.isPublic ? "public" : "private" if needed
    profile: {
      profilePic: card.profile?.profilePic,
      cardName: card.profile?.cardName,
    },
    theme: card.theme,
    business: {
      first: card.business?.first || "",
      last: card.business?.last || "",
      jobTitle: card.business?.jobTitle || "",
      name: card.business?.name || "",
      email: card.business?.email || "",
      phone: card.business?.phone || "",
    },
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
  }));

  // For universal cards: filter & sort logic
  const filteredUniversalCards = mappedUniversalCards.filter((card) => {
    const fullName =
      `${card.business.first} ${card.business.last}`.toLowerCase();
    const companyName = (card.business.name || "").toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      companyName.includes(searchTerm.toLowerCase())
    );
  });

  const sortedUniversalCards = [...filteredUniversalCards].sort((a, b) => {
    if (sortBy === "name") {
      const nameA = `${a.business.first}${a.business.last}`.toLowerCase();
      const nameB = `${b.business.first}${b.business.last}`.toLowerCase();
      return nameA.localeCompare(nameB);
    }
    if (sortBy === "company") {
      const compA = (a.business.name || "").toLowerCase();
      const compB = (b.business.name || "").toLowerCase();
      return compA.localeCompare(compB);
    }
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  // === THREE-DOTS MENU JSX (inline) ===
  // Updated to accept 'idx' and 'cardId'
  const renderThreeDotsMenu = (cardId, idx) => (
    <div className="relative group" onMouseLeave={handleMenuClose}>
      {/* 3-dots button */}
      <button
        className="
          p-2 text-gray-500 hover:text-gray-800z
          bg-white/90
          rounded-full
          cursor-pointer
          transition-colors
        "
        onClick={() => handleMenuToggle(idx)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="block"
        >
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      {/* Menu container */}
      <div
        className={`
          absolute
          ${openMenuIndex === idx ? "block" : "hidden"}
          group-hover:block
          right-0
          w-50
          bg-white
          border border-gray-200
          rounded
          shadow
          text-sm
          py-1--
        
        `}
      >
        {/* "View" */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleView(cardId);
          }}
          className="
            w-full flex items-center gap-2
            text-gray-700
            px-4 py-2
            hover:bg-gray-50
            cursor-pointer
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View
        </button>

        {/* "Edit" */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(cardId);
          }}
          className="
            w-full flex items-center gap-2
            text-gray-700
            px-4 py-2
            hover:bg-gray-50
            cursor-pointer
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
          Edit
        </button>

        {/* "Share" */}
        {selectedTab === "universal" && (
          <button
            className="
            w-full flex items-center gap-2
            text-gray-700
            px-4 py-2
            hover:bg-gray-50
            cursor-pointer
          "
            onClick={(e) => {
              e.stopPropagation();
              handleShare(cardId);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share
          </button>
        )}

        {/* "Analytics" (Pro Feature) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsAnalyticsModalOpen(true);
          }}
          className="
            w-full flex items-center gap-2
            text-gray-700
            px-4 py-2
            hover:bg-gray-50
            cursor-pointer
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <div className="flex items-center gap-1">
            Analytics
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "#eab308", cursor: "help" }}
            >
              <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
            </svg>
          </div>
        </button>
        {selectedTab === "local" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isAuthenticated) {
                handleSavePermanently(cardId);
              } else {
                setSignInMessage(
                  "This is a premium feature. Please log in to sync."
                );
                setIsSignInOpen(true);
              }
            }}
            className="w-full flex items-center gap-2
            text-gray-700
            px-4 py-2
            hover:bg-gray-50
            cursor-pointer
            "
          >
            {/* Save icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
              <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
              <path d="M7 3v4a1 1 0 0 0 1 1h7" />
            </svg>

            <span>Sync</span>
            {!isAuthenticated && (
              <Lock size={14} className="ml-1 text-yellow-500" />
            )}
          </button>
        )}

        {/* "Delete" */}
        {cardId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCard(cardId);
            }}
            className="w-full flex items-center gap-2 text-red-600 px-4 py-2 hover:bg-gray-50 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  );

  // Grid view for a given array of cards
  const renderGridView = (cardsArray) => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 break-words mt-6">
        {cardsArray.map((card, idx) => {
          var createdAt = card?.createdAt
            ? formatTimestamp(Number(card.createdAt))
            : "N/A";

          return (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg shadow transition-shadow duration-150 overflow-hidden p-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleView(card.id);
              }}
            >
              {/* Top image area with gradient overlay */}
              <div className="relative h-32">
                {card.profile.profilePic ? (
                  <img
                    src={card.profile.profilePic}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: card.theme }}
                  ></div>
                )}
                <div className="absolute inset-0 "></div>
                {/* Colored bar at bottom of image area using theme color */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-2"
                  style={{ backgroundColor: card.theme }}
                ></div>

                {/* Combine three-dots menu and badge in top-right */}
                <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                  <div onClick={(e) => e.stopPropagation()}>
                    {renderThreeDotsMenu(card.id, idx)}
                  </div>
                  <span
                    className={`
                  text-xs font-semibold px-2 py-1 rounded-full
                  ${
                    card.visibility === "public"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-700"
                  }
                `}
                  >
                    {card.visibility === "public" ? "Public" : "Private"}
                  </span>
                </div>
              </div>

              {/* Bottom area with card details */}
              <div className="p-2">
                <h3 className="text-gray-900 font-semibold text-base m-0">
                  {card.business.first} {card.business.last}
                </h3>
                <p className="text-sm leading-5 mt-1">
                  <span style={{ color: card.theme }}>
                    {card.business.jobTitle || "Role"}
                  </span>
                  {card.business.jobTitle && card.business.name ? (
                    <span className="mx-1">•</span>
                  ) : (
                    "\u00A0"
                  )}
                  <span className="font-medium">
                    {card.business.name || "Company"}
                  </span>
                </p>
                <div className="mt-4">
                  <div className="flex flex-col gap-2">
                    {/* Email Section */}
                    <div className="flex items-center">
                      {/* Email Icon */}
                      {card.business.email&&
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-gray-600 mr-1"
                        viewBox="0 0 512 512"
                        fill={card.theme}
                      >
                        <path
                          d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 
          26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 
          5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 
          15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 
          102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 
          73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 
          9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 
          0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 
          32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"
                        />
                      </svg>}
                      <p className="text-sm text-gray-600 truncate">
                        {card.business.email || "Email not provided"}
                      </p>
                    </div>

                    {/* Phone Section */}
                    <div className="flex items-center">
                      {/* Phone Icon */}
                      {card.business.phone&&
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4  mr-1"
                        fill={card.theme}
                        viewBox="0 0 24 24"
                        stroke={card.theme}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a2 2 0 011.9 1.37l1.2 3a2 2 0 01-.55 2.18l-2.12 2.12a16.88 16.88 0 006.59 6.59l2.12-2.12a2 2 0 012.18-.55l3 1.2A2 2 0 0121 15.72V19a2 2 0 01-2 2h-1c-7.716 0-14-6.284-14-14V5z"
                        />
                      </svg>}
                      <p className="text-sm text-gray-600 truncate">
                        {card.business.phone || "Phone not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 mt-2 pt-2">
                {/* Left side: card name */}
                <span className="text-sm font-semibold ml-2">
                  {card.profile.cardName}
                </span>

                {/* Right side: date with calendar icon */}
                <div className="flex items-center text-[0.7rem] text-gray-600">
                  <Calendar size={14} className="mr-1" />
                  <span className="mr-2">{createdAt}</span>
                </div>
              </div>
            </div>
          );
        })}
        <AddNewCard listView={false} />
      </div>
    </>
  );

  // List view for a given array of cards

  const renderListView = (cardsArray) => (
    <>
      <div className="min-h-screen flex flex-col gap-4 mt-6">
        {cardsArray.map((card, idx) => {
          // Add created and updated timestamps
          const createdAt = card?.createdAt
            ? formatTimestamp(Number(card.createdAt))
            : "N/A";
          const lastUpdated = card?.updatedAt
            ? formatTimestamp(new Date(card.updatedAt).getTime())
            : createdAt;

          return (
            <div
              key={idx}
              className="relative flex flex-row flex-wrap sm:flex-nowrap items-center bg-white border border-gray-200 rounded-lg shadow-sm p-4 transition-shadow hover:shadow-md cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleView(card.id);
              }}
              style={{
                borderLeft: `4px solid ${card.theme || "rgb(76, 217, 100)"}`,
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px",
                borderRadius: "8px",
                borderWidth: "0.8px 0.8px 0.8px 4px",
              }}
            >
              {/* Top-right actions */}
              <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
                {/* For larger screens: icon buttons with public/private badge */}
                <div className="hidden sm:flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    {/* Eye / View */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(card.id);
                      }}
                      className="text-gray-500 p-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    {/* Pencil / Edit */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(card.id);
                      }}
                      className="text-gray-500 p-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
                      </svg>
                    </button>

                    {/* Share */}
                    {selectedTab === "universal" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(card.id);
                        }}
                        className="text-gray-500 p-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                      </button>
                    )}

                    {/* Analytics (crown icon) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAnalyticsModalOpen(true);
                      }}
                      className="text-gray-500 p-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                      </svg>
                    </button>

                    {selectedTab === "local" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAuthenticated) {
                            handleSavePermanently(card.id);
                          } else {
                            setSignInMessage(
                              "This is a premium feature. Please log in to sync."
                            );
                            setIsSignInOpen(true);
                          }
                        }}
                        className="w-full flex items-center gap-2 text-gray-500 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        {/* Save icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                          <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
                          <path d="M7 3v4a1 1 0 0 0 1 1h7" />
                        </svg>
                      </button>
                    )}
                    {/* Trash / Delete */}
                    {card.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCard(card.id);
                        }}
                        className="text-gray-500 p-2 rounded-md hover:bg-gray-100 hover:text-red-600 transition cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <span
                    className={`text-xs font-light sm:font-semibold sm:px-2 sm:py-1 rounded-full ${
                      card.visibility === "public"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {card.visibility === "public" ? "Public" : "Private"}
                  </span>
                </div>
                {/* For small screens: display three-dots menu with public/private badge inline */}
                <div className="flex sm:hidden items-center gap-1 absolute top-2 z-50 overflow-visible">
                  <div className="flex-wrap ">
                    <div onClick={(e) => e.stopPropagation()}>
                      {renderThreeDotsMenu(card.id, idx)}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-light sm:font-semibold px-2 py-1 rounded-full ${
                        card.visibility === "public"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {card.visibility === "public" ? "Public" : "Private"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile pic or placeholder */}
              <div className="relative">
                {card.profile.profilePic ? (
                  <img
                    src={card.profile.profilePic}
                    alt={card.business.first}
                    className="w-12 h-12 object-cover rounded-full"
                    style={{
                      minWidth: "48px",
                      minHeight: "48px",
                    }}
                  />
                ) : (
                  <div className="w-13 h-13 bg-gray-100 flex items-center justify-center rounded-full">
                    <span className="text-gray-500 text-[0.6rem]">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              {/* Card info */}
              <div className="flex-1 min-w-0 mt-2 ml-4 pr-2 sm:pr-16">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-800 truncate flex-wrap">
                  {card.business.first} {card.business.last}
                </h2>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center gap-1">
                  <span
                    className="font-medium"
                    style={{ color: card.theme || "rgb(76, 217, 100)" }}
                  >
                    {card.business.jobTitle || "Role"}
                  </span>
                  <span>•</span>
                  <span className="font-medium">
                    {card.business.name || "Company"}
                  </span>
                </div>
                <div className="flex">
                  <div className="text-[0.7rem] sm:text-sm text-gray-500 mt-2 flex items-center gap-2 flex-wrap">
                    <span className="truncate">
                      {card.business.email || "Email not provided"}
                    </span>
                    <span className="hidden sm:block">•</span>
                    <span>{card.business.phone || "Phone not provided"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 mt-2 pt-2">
                {/* Left side: card name */}
                <span className="text-sm font-semibold ml-2">
                  {card.profile.cardName}
                </span>

                {/* Right side: date with calendar icon */}
                <div className="flex items-center text-[0.7rem] text-gray-600 ml-4">
                  <Calendar size={14} className="mr-1" />
                  <span className="mr-2">{createdAt}</span>
                </div>
              </div>
              </div>
            </div>
          );
        })}
        <AddNewCard listView={true} />
      </div>
    </>
  );
  useTitle("Dashboard | Your Business Card Hub | BizCardNow");

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Header onShowSignIn={() => setIsSignInOpen(true)} />

      <main className="flex-1">
        {isSaving && <CircularIndeterminate message={savingMessage} />}
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Top section: Dashboard header, tabs, etc. */}
            
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Left: Home icon + Title */}
                <div className="flex  gap-3 self-start">
                  <Link to="/new-card">
                    {" "}
                    <div className="text-gray-500 hover:text-gray-800 cursor-pointer align-left">
                      <span
                        role="img"
                        aria-label="Home"
                        className="text-2xl"
                        id="w2v-i"
                      >
                        <button
                          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                          onClick={() => navigate(-1)}
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                      </span>
                    </div>
                  </Link>
                  <h1 className="text-2xl font-bold text-gray-900 m-0">
                    Dashboard
                  </h1>
                </div>

                {/* Right: Action buttons */}
                <div className="grid grid-cols-3 gap-4 max-[607px]:grid-cols-2">
                  {/* Referrals */}
                  <button
                    onClick={() => setIsReferralModalOpen(true)}
                    className="w-full flex flex-nowrap items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 max-[425px]:px-4 max-[425px]:py-3 rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 max-[425px]:text-xs"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="min-w-0 overflow-hidden ">Referrals</span>
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  </button>

                  {/* Members Directory */}
                  <Link to="/members-directory" className="w-full">
                    <button className="w-full flex flex-nowrap items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 max-[425px]:px-4 max-[425px]:py-3 rounded-md transition-colors cursor-pointer focus:bg-blue-600 focus:text-white max-[425px]:text-xs">
                      <Users className="w-5 h-5" />
                      <span className="min-w-0 overflow-hidden">
                        Members Directory
                      </span>
                    </button>
                  </Link>

                  {/* Add New Card */}
                  <Link
                    to="/new-card"
                    className="w-full max-[607px]:col-span-2"
                  >
                    <button className="w-full flex flex-nowrap items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 max-[425px]:px-4 max-[425px]:py-3 rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 max-[425px]:text-xs">
                      <Plus className="w-5 h-5" />
                      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                        Add New Card
                      </span>
                    </button>
                  </Link>
                </div>
              </div>

              {/* Tabs: Local & Universal */}
              <div className="grid grid-cols-4 lg:grid-cols-6 items-center gap-3  mt-4 pt-4 max-[600px]:grid-cols-1">
                <button
                  onClick={() => setSelectedTab("local")}
                  className={`
      flex items-center justify-between 
       pl-2 pr-5 py-2
      rounded-md
      transition-colors
      cursor-pointer
      focus:bg-blue-600 focus:text-white
      ${
        selectedTab === "local"
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }
      w-auto max-[425px]:w-full
    `}
                >
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium md:whitespace-nowrap">
                      Local Cards
                    </span>
                  </div>
                  <span
                    className="
        text-sm 
        px-2 py-1
        bg-white/20
        rounded-full
        whitespace-nowrap
      "
                  >
                    {localCards.length}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedTab("universal")}
                  className={`
      flex items-center justify-between 
      pl-2 pr-5 py-2
      rounded-md
      transition-colors
      cursor-pointer
      focus:bg-blue-600 focus:text-white
      ${
        selectedTab === "universal"
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }
      w-auto max-[425px]:w-full
    `}
                >
                  <div className="flex items-center gap-1">
                    <Globe className="w-5 h-5" />
                    <span className="font-medium md:whitespace-nowrap ">
                      My Cards
                    </span>
                  </div>
                  <span
                    className="
        text-sm 
        px-2 py-1
        bg-white/20
        rounded-full
        whitespace-nowrap
      "
                  >
                    {universalCardsLen}
                  </span>
                </button>
              </div>
           

            {/* Search & Sort (applies to both tabs) */}
            <div className="shadow-sm p-6 bg-white border border-gray-200 rounded-lg mt-6">
  <div className="flex flex-col md:flex-row gap-4">
    {/* Search Bar */}
    <div className="relative flex-1">
      <Search className="w-5 h-5 text-gray-400 absolute top-2 left-2" />
      <input
        type="text"
        placeholder="Search cards..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
          w-full 
          pl-8 pr-4 py-2
          border border-gray-300 
          rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      />
    </div>

    {/* View Toggle & Sort */}
    <div className="flex items-center gap-4 w-full md:w-auto">
      {/* Grid/List Toggle */}
      <div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-md transition-colors ${
              view === "grid"
                ? "bg-white shadow-sm"
                : "text-gray-500 hover:bg-white hover:shadow-sm"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="block"
            >
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <path d="M3 9h18"></path>
              <path d="M3 15h18"></path>
              <path d="M9 3v18"></path>
              <path d="M15 3v18"></path>
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-md transition-colors ${
              view === "list"
                ? "bg-white shadow-sm"
                : "text-gray-500 hover:bg-white hover:shadow-sm"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="block"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="flex-1">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="name">Sort by Name</option>
          <option value="company">Sort by Company</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>
    </div>
  </div>
</div>


            {/* Main card content: Local or Universal */}
            <div>
              {/* LOCAL CARDS TAB */}
              {selectedTab === "local" && (
                <>
                  <>
                    {localCards.length === 0 ? (
                      <p className="text-gray-500 text-center">
                        No local cards found.
                      </p>
                    ) : view === "grid" ? (
                      renderGridView(sortedCards)
                    ) : (
                      renderListView(sortedCards)
                    )}
                  </>
                </>
              )}

              {selectedTab === "universal" && (
                <>
                  {!isAuthenticated ? (
                    <p className="text-gray-500 text-center">
                      Login to access my cards.
                    </p>
                  ) : loadingUniversal ? (
                    <CircularIndeterminate variant="small" />
                  ) : (
                    <>
                      {sortedUniversalCards.length === 0 ? (
                        <p className="text-gray-500 text-center">
                          No cards found. Create your first card!
                        </p>
                      ) : view === "grid" ? (
                        renderGridView(sortedUniversalCards)
                      ) : (
                        renderListView(sortedUniversalCards)
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Referral Modal */}
      {isReferralModalOpen && (
        <div
          className=" max-h-screen overflow-y-hidden flex items-center justify-center absolute inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm"
          onClick={() => setIsReferralModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-[18rem] sm:max-w-md mx-auto mx-2 p-6 rounded-lg shadow-lg relative"
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
            <div className="flex flex-col items-center space-y-4 text-center ">
              <Crown className="w-8 h-8 text-yellow-500" />
              <h2 className="text-xl font-bold">Referral Pro Feature</h2>
              <p className="text-gray-700 leading-relaxed">
                This Referral Pro Feature is coming soon! However, you can try
                out the{" "}
                <span className="text-blue-600 font-semibold">
                  Call-to-Action
                </span>{" "}
                and{" "}
                <span className="text-blue-600 font-semibold">Direct Ads</span>{" "}
                Pro features for free now.
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

      {/* Analytics Modal */}
      {isAnalyticsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)] backdrop-blur-sm"
          onClick={() => setIsAnalyticsModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md mx-auto p-6 rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button (X) */}
            <button
              onClick={() => setIsAnalyticsModalOpen(false)}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
              </svg>

              <h2 className="text-xl font-bold">Analytics Pro Feature</h2>
              <p className="text-gray-700 leading-relaxed">
                This Analytics Pro Feature is coming soon! However, you can try
                out the{" "}
                <span className="text-blue-600 font-semibold">
                  Call-to-Action
                </span>{" "}
                and{" "}
                <span className="text-blue-600 font-semibold">Direct Ads</span>{" "}
                Pro features for free now.
              </p>

              <button
                onClick={() => setIsAnalyticsModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onShowSignUp={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
        message={signInMessage}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onShowSignIn={() => {
          setIsSignUpOpen(false);
          setIsSignInOpen(true);
        }}
      />
      {isProFeatureModelOpen && (
        <div
          className="z-10 fixed inset-0 h-screen flex items-center justify-center bg-[rgba(0,0,0,0.3)] backdrop-blur-sm overflow-hidden"
          onClick={() => setIsProFeatureModelOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md mx-auto p-6 rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Content */}
            <div className="flex flex-col items-center space-y-4 text-center">
              <Crown className="w-8 h-8 text-yellow-500" />
              <h2 className="text-xl font-bold">Pro Feature</h2>
              <p className="text-gray-700 leading-relaxed">
                Only 2 cards can be synced. Upgrade to Pro to sync more cards.
              </p>

              <button
                onClick={() => setIsProFeatureModelOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
