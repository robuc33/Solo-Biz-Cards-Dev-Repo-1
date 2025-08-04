// src/components/layouts/FancyCardLayout.jsx
import { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet";
import { createPortal } from "react-dom";
import DefaultImage from "./DefaultImage";
import { lightenColor } from "../../components/BusinessCardCreator";
import { DownloadContext } from "../../contexts/DownloadContext";
import SignUpModal from "../SignUpModal";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Instagram,
  Image,
  Calendar,
  X,
  Share2,
  Download,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { fetchCardById } from "../../utils/fetchCards";
import ShareModal from "../ShareModal";
import CircularIndeterminate from "../common/Loader";
import useTitle from "../../hooks/useTitle";
import ContactModal from "../ContactModal";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
export default function FancyCardLayout({ cardData }) {
  const { isAuthenticated } = useAuth();
  const handleDownloadVCard = async (cardId) => {
    let vCard = null;
    const storedCards = JSON.parse(localStorage.getItem("savedCards") || "[]");

    if (cardId) {
      const localCard = storedCards.find(
        (card) => card.id === cardId || card._id === cardId
      );
      if (localCard) {
        vCard = localCard;
      } else {
        try {
          const { data } = await fetchCardById(cardId);
          vCard = data;
        } catch (error) {
          console.error("Error fetching card:", error);
          return;
        }
      }
    } else {
      console.warn("No card ID provided.");
      return;
    }

    if (!vCard) {
      console.error("Card data not found.");
      return;
    }

    const {
      business: {
        first = "",
        last = "",
        accreditations = "",
        name: companyName = "",
        jobTitle = "",
        phone = "",
        email = "",
        website = "",
        address: {
          street = "",
          city = "",
          state = "",
          zip = "",
          country = "",
        } = {},
      } = {},
    } = vCard;

    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:${last};${first};;;
FN:${first} ${last}
ORG:${companyName}
TITLE:${jobTitle}
TEL;TYPE=WORK,VOICE:${phone}
EMAIL;TYPE=INTERNET:${email}
URL:${website}
ADR;TYPE=WORK:;;${street};${city};${state};${zip};${country}
NOTE:${accreditations}
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${business.first}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
    setTimeout(() => {
      setGreatJobModal(true);
    }, 1000);
  };

  function formatPhoneNumber(raw) {
    // Remove all non-digit characters
    const digits = raw.replace(/\D/g, "");

    // If less than 10 digits, return raw
    if (digits.length < 10) return raw;

    // Determine country code if present
    const countryCode =
      digits.length > 10 ? digits.slice(0, digits.length - 10) : "";
    const areaCode = digits.slice(digits.length - 10, digits.length - 7);
    const prefix = digits.slice(digits.length - 7, digits.length - 4);
    const lineNumber = digits.slice(-4);

    if (countryCode) {
      return `+${countryCode} (${areaCode}) ${prefix}-${lineNumber}`;
    } else {
      return `(${areaCode}) ${prefix}-${lineNumber}`;
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareableLink);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [fetchedCardData, setFetchedCardData] = useState(null);
  const { user } = useAuth();
  const receivedCardData =
    cardData || location.state?.cardData || fetchedCardData;

  const isViewRoute = /^\/view(\/.+|\?cardId=.+)?$/.test(location.pathname);
  const dynamicTitle =
    isViewRoute &&
    receivedCardData?.business?.first &&
    receivedCardData?.business?.last
      ? `${receivedCardData.business.first} ${receivedCardData.business.last}'s Digital Business Card | BizCardNow`
      : "Business Card Maker | Create Your Business Card | BizCardNow";

  // Call useTitle unconditionally
  useTitle(dynamicTitle);
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const { cardId: cardIdFromParams } = useParams();
  const cardId = searchParams.get("cardId") || cardIdFromParams;

  // Local state for the Direct Ads modal
  const [isAdsModalOpen, setIsAdsModalOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareModalData, setShareModalData] = useState({
    isLocal: false,
    shareableLink: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [greatJobModal, setGreatJobModal] = useState(false);
  const [shareModalAnimateClass, setShareModalAnimateClass] =
    useState("translate-y-full");
  const [contactModalAnimateClass, setContactModalAnimateClass] =
    useState("translate-y-full");
  const [thankYouAnimateClass, setThankYouAnimateClass] =
    useState("translate-y-full");
  const [customMessage, setCustomMessage] = useState("");
  const [customTile, setCustomTile] = useState("");
  const [customButtonText, setCustomButtonText] = useState("");
  const [thankYouKey, setThankYouKey] = useState(0);
  const handleCloseShareModal = () => {
    setShareModalAnimateClass("translate-y-full");
    setTimeout(() => {
      setShowShareModal(false);
      setTimeout(() => {
        setShowContactModal(true);
        setTimeout(() => {
          setContactModalAnimateClass("translate-y-0");
        }, 500);
      }, 200);
    }, 700);
  };
  const handleCloseContactModal = () => {
    setContactModalAnimateClass("translate-y-full");
    setTimeout(() => {
      setShowContactModal(false);
      setCustomMessage(
        `The first digital business card that turns networking into passive income.`
      );
      setCustomTile("Free BizCard Offer!!!");
      setCustomButtonText("Get Your Free! BizCard Today");
      setGreatJobModal(true);
    }, 700);
  };

  useEffect(() => {
    if (showContactModal) {
      setContactModalAnimateClass("translate-y-full");
      setTimeout(() => {
        setContactModalAnimateClass("translate-y-0");
      }, 50);
    }
  }, [showContactModal]);
  useEffect(() => {
    if (showShareModal) {
      setShareModalAnimateClass("translate-y-full");
      setTimeout(() => {
        setShareModalAnimateClass("translate-y-0");
      }, 50);
    }
  }, [showShareModal]);

  useEffect(() => {
    if (!receivedCardData && cardId) {
      fetchCardById(cardId)
        .then((response) => {
          if (response.success) {
            setFetchedCardData(response.data);
          } else {
            console.error("Card not found.");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch card.", err);
        });
    }
  }, [cardId, receivedCardData]);
  useEffect(() => {
    if (greatJobModal) {
      // Force a re-mount by updating the key.
      setThankYouKey((prev) => prev + 1);
      // Start the modal offscreen.
      setThankYouAnimateClass("translate-y-full");
      // After a short delay, animate it into view.
      setTimeout(() => {
        setThankYouAnimateClass("translate-y-0");
      }, 50);
    }
  }, [greatJobModal]);
  function handleShare() {
    const isLocal = window.location.pathname.startsWith("/view/local");

    if (!isLocal) {
      if (!receivedCardData || !receivedCardData._id) {
        alert("Card data is missing!");
        return;
      }
      const shareableLink = `${window.location.origin}/view?cardId=${receivedCardData._id}`;
      navigator.clipboard.writeText(shareableLink);
    }

    setShowShareModal(true);
    setShareModalData({
      isLocal,
      shareableLink: !isLocal
        ? `${window.location.origin}/view?cardId=${receivedCardData._id}`
        : null,
      theme: safetheme,
    });
  }

  if (!receivedCardData) {
    return <CircularIndeterminate message="Loading card..." />;
  }
  const shareableLink = `${window.location.origin}/view?cardId=${receivedCardData._id}`;
  const { profile, business, social, about, cta, theme } = receivedCardData;
  const { downloadMode } = useContext(DownloadContext);

  // Fallback if theme is empty or contains "oklch"
  const effectivetheme =
    theme && theme.includes("oklch") ? "#4299E1" : theme || "#4299E1";

  // Force safe theme color: if effectivetheme is not in "#rrggbb" format, use a default.
  const safetheme =
    effectivetheme && effectivetheme.length === 7 ? effectivetheme : "#4299E1";

  // Determine if any relevant data is entered (include social & about as needed)
  const hasData = Boolean(
    profile.profilePic ||
      business.first ||
      business.last ||
      business.accreditations ||
      business.name ||
      business.jobTitle ||
      business.department ||
      business.slogan ||
      (business.address &&
        (business.address.street ||
          business.address.city ||
          business.address.state ||
          business.address.zip ||
          business.address.country)) ||
      business.phone ||
      business.email ||
      business.website ||
      about.aboutMe ||
      about.sectionType || // if user has toggled section type
      about.customSectionTitle ||
      social.linkedin ||
      social.twitter ||
      social.facebook ||
      social.youtube ||
      social.instagram ||
      social.tiktok ||
      cta.link
  );

  // Build full name text from first and last
  const fullNameText = `${business.first} ${business.last}`.trim();

  // Combined title (jobTitle • department)
  const combinedTitle = business.jobTitle
    ? business.department
      ? `${business.jobTitle} • ${business.department}`
      : business.jobTitle
    : business.department || "";

  // Build a single address string from address parts
  const fullAddress =
    business.address &&
    [
      business.address.street,
      business.address.city,
      business.address.state,
      business.address.zip,
      business.address.country,
    ]
      .filter(Boolean)
      .join(", ");

  // For the About section, derive defaults similar to AboutTabContent:
  // If sectionType is "custom" and a custom title is provided, use that;
  // Otherwise (default "aboutMe"), show "About Me" as the heading.
  const {
    sectionType = "aboutMe",
    customSectionTitle = "",
    aboutMe: aboutText = "",
  } = about;
  const aboutHeading =
    sectionType === "custom" && customSectionTitle
      ? customSectionTitle
      : "About Me";

  // Label for the CTA button (for direct ads)
  const directAdsLabel =
    cta.adsType === "event"
      ? "Event"
      : cta.adsType === "service"
        ? "Service"
        : "Product";
  const closeThankYouPopup = () => {
    // Animate out the popup
    setThankYouAnimateClass("translate-y-full");
    setTimeout(() => {
      setGreatJobModal(false);
      setCustomMessage("");
      setCustomTile("");
      setCustomButtonText("");
      // Reset for next time
      setThankYouAnimateClass("translate-y-0");
    }, 500);
  };
  const thankYouPopup =
    greatJobModal &&
    createPortal(
      <div
        onClick={(e) => {
          // If clicking on the backdrop (not on its child content), close the popup
          if (e.target === e.currentTarget) {
            closeThankYouPopup();
          }
        }}
        className="fixed inset-0 z-999 flex justify-center items-end bg-black/20 -mb-4"
      >
        <div
          key={thankYouKey}
          className={`
              relative bg-white p-4 mb-4 transform transition-all duration-500 
              ${thankYouAnimateClass} pointer-events-auto mx-auto  
              w-[calc(100%-1rem)] max-w-[448px] rounded-t-3xl shadow-2xl text-center
            `}
        >
          {/* Close (x) button in top-right */}
          <button
            onClick={() => {
              // Animate out first
              setThankYouAnimateClass("translate-y-full");
              setTimeout(() => {
                setGreatJobModal(false);
                setCustomMessage("");
                setCustomTile("");
                setCustomButtonText("");
                // Reset animation state for next time
                setThankYouAnimateClass("translate-y-0");
              }, 500);
            }}
            className="
                  absolute
                  top-0
                  right-1
                  text-gray-700
                  hover:scale-110
                  transition-transform
                  text-3xl
                  cursor-pointer
                  font-bold
                  leading-none
                  p-[10px]
                "
            aria-label="Close"
          >
            ×
          </button>

          {/* Stars */}
          <div className="flex justify-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-red-500 text-xl mr-0.5">
                ★
              </span>
            ))}
          </div>

          {/* Heading */}
          <p className="text-center text-lg font-bold mb-1">
            {customTile || `Great Job!!!`}
          </p>
          {/* Subtext with the name */}
          <span className="text-center text-gray-500">
            ***************************************
          </span>
          <div className="max-w-[18rem] mx-auto">
            <p className="text-center text-gray-500 border-dashed max-w-xs -mx-3">
              {customMessage ||
                `${business.first}'s contact details were
              downloaded to your phone.`}
            </p>
          </div>
          <span className="text-center text-gray-500">
            ***************************************
          </span>

          {/* Button */}
          <Link to="/">
            <button
              className="mt-3 block mx-auto text-white font-medium py-1 px-6 rounded-full w-full max-w-[20rem] cursor-pointer "
              style={{ backgroundColor: safetheme }}
            >
              {customButtonText || "Get a BizCard Free!"}
            </button>
          </Link>
        </div>
      </div>,
      document.body
    );

  return (
    <>

      <div
        className={`min-h-screen pb-[98px] ${
          /^\/view(?:\?cardId=[^&]+)?$/.test(
            location.pathname + location.search
          )
            ? "pt-8"
            : ""
        }`}
      >
        <div
          className={`max-w-md mx-auto rounded-lg overflow-hidden text-gray-800 duration-200 ${!hasData ? "sm:bg-transparent sm:shadow-none" : "bg-white shadow-xl"}`}
        >
          {/^\/view\/[^/]+(\/[^/]+)?$/.test(location.pathname) &&
            createPortal(
              <div className="flex items-center justify-between sm:justify-center mb-6 pt-6 px-2 ">
                <div className="hover:text-gray-900">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(-1);
                    }}
                    className="flex items-center gap-2 cursor-pointer normal-case font-sans text-base font-normal leading-6 tracking-normal py-2 px-4 border-0 text-gray-600 hover:text-gray-900"
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
                      className="block align-middle text-gray-600 hover:text-gray-900"
                    >
                      <path d="m12 19-7-7 7-7"></path>
                      <path d="M19 12H5"></path>
                    </svg>
                    Back
                  </button>
                </div>

                <div>
                  {/* Copy Button */}
                  {location.pathname.startsWith("/view/local") ? (
                    !isAuthenticated ? (
                      <p className="cursor-pointer bg-white border border-gray-200 rounded-lg shadow-sm normal-case font-sans text-base  leading-6 tracking-normal py-2 px-4">
                      <span>
                      This Card is saved on your device only. To Sync and share
                        <span
                        onClick={() => setIsSignUpOpen(true)}
                        className="italic underline ml-1">Create Account.</span>
                      </span>
                    </p>
                    
                    
                    ) : (
                      <p className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 rounded-lg shadow-sm normal-case font-sans text-base font-normal leading-6 tracking-normal py-2 px-4">
                        This card is locally saved on your device only and cant' be shared.
                      </p>
                    )
                  ) : (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 rounded-lg shadow-sm normal-case font-sans text-base font-normal leading-6 tracking-normal py-2 px-4"
                    >
                      {/* Show this link span on sm and above */}
                      <span className="hidden sm:block font-medium text-sm leading-5 p-2 ">
                        {shareableLink}
                      </span>

                      {/* Show this text on screens below sm only */}
                      <span className="block sm:hidden font-medium text-sm leading-5">
                        Copy URL
                      </span>

                      {receivedCardData._id && (
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
                          className="block align-middle"
                        >
                          <rect
                            width="14"
                            height="14"
                            x="8"
                            y="8"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>,
              document.getElementById("root")
            )}
          {(() => {
            if (document.getElementById("root")) {
              document.getElementById("root").style.backgroundColor =
                lightenColor(safetheme, 0.8) || "#fff";
            }
            return null;
          })()}

          {!hasData ? (
            <DefaultImage />
          ) : (
            <>
              {/* Top Image Section: shown only if profile image is provided */}
              {profile.profilePic && (
                <div className="relative w-full h-95 bg-gray-200">
                  <img
                    src={profile.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {(profile.profilePic || business.first || business.last) && (
                <div
                  className="w-full h-5"
                  style={{ backgroundColor: safetheme }}
                ></div>
              )}

              {/* Main Card Content */}
              <div className="px-5 sm:px-8 py-5">
                {/* Name, Accreditations, Title, Department, Company, Slogan */}
                <div className="text-center mb-4">
                  {/* Single line: Full name, asterisk, accreditations */}
                  {(fullNameText || business.accreditations) && (
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words whitespace-pre-wrap">
                      {fullNameText}
                      {business.accreditations && (
                        <>
                          <span className="text-gray-400 text-base sm:text-lg font-normal mx-2">
                            {business.accreditations}
                          </span>
                        </>
                      )}
                    </h2>
                  )}

                  {/* Single line: Job title in theme color, bullet, department in gray */}
                  {combinedTitle && (
                    <p className="text-lg sm:text-xl  mt-1">
                      {/* If there's a job title, show in theme color */}
                      {business.jobTitle && (
                        <span style={{ color: safetheme }}>
                          {business.jobTitle}
                        </span>
                      )}
                      {/* Bullet if both jobTitle and department exist */}
                      {business.jobTitle && business.department && (
                        <span className="mx-1 text-gray-500">•</span>
                      )}
                      {/* If there's a department, show in gray */}
                      {business.department && (
                        <span className="text-gray-500">
                          {business.department}
                        </span>
                      )}
                    </p>
                  )}
                  {/* Company Name */}
                  {business.name && (
                    <p className="text-lg sm:text-xl text-gray-700 mt-1 font-bold break-words whitespace-pre-wrap">
                      {business.name}
                    </p>
                  )}

                  {/* Company Slogan */}
                  {business.slogan && (
                    <p className=" italic text-gray-600 mt-3 break-words whitespace-pre-wrap">
                      “{business.slogan}”
                    </p>
                  )}
                </div>

                {/* Main CTA Button */}
                {(cta.type === "booking" || cta.type === "cta") && cta.link && (
                  <div className="flex justify-center mb-5 mt-4">
                    <button
                      onClick={() => window.open(cta.link, "_blank")}
                      className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-white rounded-lg transition-colors text-base sm:text-lg font-medium hover:opacity-90 cursor-pointer"
                      style={{
                        backgroundColor: safetheme,
                      }}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      {cta.type === "booking"
                        ? "Schedule Meeting"
                        : cta.label || "Learn More"}
                    </button>
                  </div>
                )}

                {/* Direct Ads Button */}
                {cta.type === "directads" && cta.adsImg && (
                  <div
                    className="flex justify-center mb-5"
                    onMouseEnter={(e) => e.stopPropagation()}
                    onMouseLeave={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setIsAdsModalOpen(true)}
                      className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-white rounded-lg transition-colors text-base sm:text-lg font-medium hover:opacity-90 cursor-pointer"
                      style={{ backgroundColor: safetheme }}
                    >
                      <Image className="w-5 h-5 mr-2" />
                      View Our {directAdsLabel}
                    </button>
                  </div>
                )}

                {/* Contact Info */}
                <div>
                  <div className="space-y-0 mb-4">
                    {business.phone && (
                      <div
                        className="flex items-center gap-4 py-2 transition-all duration-150 cursor-pointer"
                        style={{
                          width: "calc(100% + 4rem)", // extend width by parent's padding (2rem each side)
                          marginLeft: "-2rem", // shift left so that it starts at the parent's edge
                          paddingLeft: "2rem", // keep inner content aligned
                          paddingRight: "2rem",
                        }}
                        onClick={() => window.open(`tel:${business.phone}`)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = lightenColor(
                            effectivetheme,
                            0.8
                          );
                          const textEl =
                            e.currentTarget.querySelector(".contact-text");
                          if (textEl) textEl.style.color = effectivetheme;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          const textEl =
                            e.currentTarget.querySelector(".contact-text");
                          if (textEl) textEl.style.color = "inherit";
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 p-3"
                          style={{ backgroundColor: safetheme }}
                        >
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="contact-text text-gray-700 font-bold  break-words break-all whitespace-pre-wrap">
                            {formatPhoneNumber(business.phone)}
                          </p>
                          <p className="text-sm text-gray-500">Phone</p>
                        </div>
                      </div>
                    )}

                    {business.email && (
                      <div
                        className="flex items-center gap-4 py-2 transition-all duration-150 cursor-pointer"
                        style={{
                          width: "calc(100% + 4rem)", // extend width by parent's padding (2rem each side)
                          marginLeft: "-2rem", // shift left so that it starts at the parent's edge
                          paddingLeft: "2rem", // keep inner content aligned
                          paddingRight: "2rem",
                        }}
                        onClick={() => window.open(`mailto:${business.email}`)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = lightenColor(
                            effectivetheme,
                            0.8
                          );
                          const textEl =
                            e.currentTarget.querySelector(".contact-text");
                          if (textEl) textEl.style.color = effectivetheme;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          const textEl =
                            e.currentTarget.querySelector(".contact-text");
                          if (textEl) textEl.style.color = "inherit";
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 p-3"
                          style={{ backgroundColor: safetheme }}
                        >
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="contact-text text-gray-700 font-bold  break-words break-all whitespace-pre-wrap">
                            {business.email}
                          </p>
                          <p className="text-sm text-gray-500">Email</p>
                        </div>
                      </div>
                    )}

                    {business.website && (
                      <div
                        className="flex items-center gap-4 py-2 transition-all duration-150 cursor-pointer"
                        style={{
                          width: "calc(100% + 4rem)", // extend width by parent's padding (2rem each side)
                          marginLeft: "-2rem", // shift left so that it starts at the parent's edge
                          paddingLeft: "2rem", // keep inner content aligned
                          paddingRight: "2rem",
                        }}
                        onClick={() => window.open(business.website, "_blank")}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = lightenColor(
                            effectivetheme,
                            0.8
                          );
                          const textEl =
                            e.currentTarget.querySelector(".contact-text");
                          if (textEl) textEl.style.color = effectivetheme;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          const textEl =
                            e.currentTarget.querySelector(".contact-text");
                          if (textEl) textEl.style.color = "inherit";
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 p-3"
                          style={{ backgroundColor: safetheme }}
                        >
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="contact-text text-gray-700 font-bold  break-words break-all whitespace-pre-wrap">
                            {business.website}
                          </p>
                          <p className="text-sm text-gray-500">Website</p>
                        </div>
                      </div>
                    )}

                    {fullAddress && (
                      <div
                        className="flex items-center gap-4 py-2 transition-all duration-150 cursor-pointer"
                        style={{
                          width: "calc(100% + 4rem)", // extend width by parent's padding (2rem each side)
                          marginLeft: "-2rem", // shift left so that it starts at the parent's edge
                          paddingLeft: "2rem", // keep inner content aligned
                          paddingRight: "2rem",
                        }}
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              fullAddress
                            )}`,
                            "_blank"
                          )
                        }
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = lightenColor(
                            effectivetheme,
                            0.8
                          );
                          const textEl =
                            e.currentTarget.querySelector(".contact-text");
                          if (textEl) textEl.style.color = effectivetheme;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          const textEl =
                            e.currentTarget.querySelector(".contact-text");
                          if (textEl) textEl.style.color = "inherit";
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 p-3"
                          style={{ backgroundColor: safetheme }}
                        >
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="contact-text text-gray-700 font-bold  break-words break-all whitespace-pre-wrap">
                            {fullAddress}
                          </p>
                          <p className="text-sm text-gray-500">Address</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {(about.sectionType ||
                  about.customSectionTitle ||
                  aboutText) && (
                  <div className="h-[1px] w-full bg-gray-200  mb-5"></div>
                )}

                {(about.sectionType ||
                  about.customSectionTitle ||
                  aboutText) && (
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1.5 break-words whitespace-pre-wrap">
                      {aboutHeading}
                    </h3>
                    <p className=" text-gray-600 leading-relaxed break-words whitespace-pre-wrap">
                      {aboutText}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mt-5">
                  {social.linkedin && (
                    <a
                      href={social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div
                        style={{ "--safetheme": lightenColor(safetheme, 0.8) }}
                        className="p-2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 bg-[rgb(243,244,246)] hover:bg-[var(--safetheme)]"
                      >
                        <Linkedin
                          className="w-6 h-6"
                          style={{ color: safetheme }}
                        />
                      </div>
                    </a>
                  )}
                  {social.twitter && (
                    <a
                      href={social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div
                        style={{ "--safetheme": lightenColor(safetheme, 0.8) }}
                        className="p-2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 bg-[rgb(243,244,246)] hover:bg-[var(--safetheme)]"
                      >
                        <Twitter
                          className="w-6 h-6"
                          style={{ color: safetheme }}
                        />
                      </div>
                    </a>
                  )}
                  {social.facebook && (
                    <a
                      href={social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div
                        style={{ "--safetheme": lightenColor(safetheme, 0.8) }}
                        className="p-2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 bg-[rgb(243,244,246)] hover:bg-[var(--safetheme)]"
                      >
                        <Facebook
                          className="w-6 h-6"
                          style={{ color: safetheme }}
                        />
                      </div>
                    </a>
                  )}
                  {social.youtube && (
                    <a
                      href={social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div
                        style={{ "--safetheme": lightenColor(safetheme, 0.8) }}
                        className="p-2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 bg-[rgb(243,244,246)] hover:bg-[var(--safetheme)]"
                      >
                        <Youtube
                          className="w-6 h-6"
                          style={{ color: safetheme }}
                        />
                      </div>
                    </a>
                  )}
                  {social.instagram && (
                    <a
                      href={social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div
                        style={{ "--safetheme": lightenColor(safetheme, 0.8) }}
                        className="p-2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 bg-[rgb(243,244,246)] hover:bg-[var(--safetheme)]"
                      >
                        <Instagram
                          className="w-6 h-6"
                          style={{ color: safetheme }}
                        />
                      </div>
                    </a>
                  )}
                  {social.tiktok && (
                    <a
                      href={social.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div
                        style={{ "--safetheme": lightenColor(safetheme, 0.8) }}
                        className="p-2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 bg-[rgb(243,244,246)] hover:bg-[var(--safetheme)]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 512 512"
                          style={{ color: safetheme }}
                        >
                          <path d="M370.5 179.4c-12.5 0-24.2-3.1-34.3-8.8v166.2c0 54.6-44.4 99-99 99s-99-44.4-99-99 44.4-99 99-99c12.3 0 24 2.2 35 6.3v53.6c-6.3-3.5-13.3-5.6-20.7-5.6-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50V84.1c19.3 10.9 41.3 17.2 65 17.2 73.3 0 133-59.7 133-133V0h-38.3v31.3c-15.8-11.3-35.3-18.3-56.7-18.3z" />
                        </svg>
                      </div>
                    </a>
                  )}
                </div>
              </div>
              <p
                id="watermark"
                className="relative bottom-2 left-1/2 transform -translate-x-1/2 text-gray-300 text-center text-sm w-[260px] italic pb-1"
                style={{
                  pointerEvents: "none",
                  display: downloadMode ? "block" : "none",
                }}
              >
                Created Free By https://bizcardnow.com
              </p>
            </>
          )}

          {/^\/view(\/.+|\?cardId=.+)?$/.test(location.pathname) &&
            !showShareModal &&
            !showContactModal && (
              <>
                <div className="fixed bottom-0 left-0 w-full flex flex-col items-center  py-4 z-500 ">
                  <div className="flex gap-x-4 px-2  mb-[20px] flex-nowrap">
                    <button
                      onClick={handleShare}
                      className="h-[40px] px-4 rounded-lg text-white font-medium transition-all duration-200 flex items-center cursor-pointer justify-center w-full whitespace-nowrap sm:w-auto"
                      style={{ backgroundColor: safetheme }}
                    >
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Share Card</span>
                    </button>

                    <button
                      onClick={() =>
                        handleDownloadVCard(
                          receivedCardData._id || receivedCardData.id
                        )
                      }
                      className="h-[40px] px-4 rounded-lg text-white font-medium transition-all duration-200 flex items-center cursor-pointer justify-center w-full whitespace-nowrap sm:w-auto"
                      style={{ backgroundColor: safetheme }}
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Save Contact</span>
                    </button>
                  </div>

                  <div
                    className="fixed bottom-0 w-[95%] min-[600px]:w-[28rem] text-white text-center rounded-t-lg flex items-center justify-center mx-2"
                    style={{ backgroundColor: safetheme, fontSize: "12px" }}
                  >
                    <span className="italic">
                      Created by:{" "}
                      <Link
                        to="https://bizcardnow.com"
                        className="text-white no-underline"
                      >
                        https://bizcardnow.com
                      </Link>
                    </span>
                  </div>
                </div>
                {thankYouPopup}
              </>
            )}

          {/* Direct Ads Modal */}
          {isAdsModalOpen &&
            cta.adsImg &&
            createPortal(
              <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                  onClick={() => setIsAdsModalOpen(false)}
                />
                <div className="relative z-10  rounded-xl  w-full max-w-2xl">
                  {/* This container centers the image and limits its max-height */}
                  <div className="relative flex items-center justify-center w-full max-h-[98dvh]">
                    {/* Wrapping the image in an inline-block with overflow-auto places scrollbars right by it if needed */}
                    <div className="overflow-auto inline-block relative max-w-max">
                      <img
                        src={cta.adsImg}
                        alt="Ad Preview"
                        className="block max-w-full max-h-[98dvh] object-contain rounded-lg"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <button
                        onClick={() => setIsAdsModalOpen(false)}
                        className="absolute right-0 top-0 z-20 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <X size={24} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}

          {showShareModal && (
            <div
              className="fixed inset-0 flex items-end justify-center bg-black/30"
              onClick={(e) => {
                if (e.target === e.currentTarget) handleCloseShareModal();
              }}
            >
              {/* Main Modal Container */}
              <div
                className={`
        relative 
        bg-white 
         mx-auto  
      w-[calc(100%-1rem)]
      max-w-[448px]            
        max-h-[98dvh] 
        rounded-t-3xl 
        shadow-2xl 
        overflow-visible 
        transform 
        transition-transform 
        duration-700 
        ${shareModalAnimateClass}
      `}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button at top-right */}
                <button
                  onClick={handleCloseShareModal}
                  className="
          absolute 
          top-4 
          right-4 
          p-2 
          bg-white 
          z-10 
          cursor-pointer
          rounded-full 
          hover:scale-110 
          transition-transform
        "
                  aria-label="Close"
                >
                  <svg
                    style={{
                      fill: "rgb(0, 0, 0)",
                      height: "24px",
                      width: "24px",
                    }}
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>

                {/* Profile Picture Overlap */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-13 z-10">
                  {receivedCardData.profile?.profilePic ? (
                    <img
                      src={receivedCardData.profile.profilePic}
                      alt="Profile"
                      className="w-26 h-26 rounded-full border-4 border-white object-cover"
                    />
                  ) : (
                    <div className="w-26 h-26 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                      No image
                    </div>
                  )}
                </div>

                {/* Scrollable Content Area */}
                <div className="overflow-y-auto rounded-t-3xl max-h-[calc(98dvh-4rem)] pt-16 pb-6">
                  {/* Added w-full */}
                  <ShareModal
                    setShowShareModal={handleCloseShareModal}
                    business={business}
                    profile={profile}
                    shareableLink={shareableLink}
                    isLocal={shareModalData.isLocal}
                    theme={safetheme}
                  />
                </div>
              </div>
            </div>
          )}

          {showContactModal && (
            <ContactModal
              showContactModal={showContactModal}
              setShowContactModal={handleCloseContactModal}
              handleCloseContactModal={handleCloseContactModal}
              contactModalAnimateClass={contactModalAnimateClass}
              username={business.first || "user"}
              isSubmitting={isSubmitting}
              receivedCardData={receivedCardData}
              theme={safetheme}
              onSubmitContact={(data) => {
                data.cardName = receivedCardData.profile.cardName;
                data.receiverEmail = receivedCardData.user.email;
                data.cardLink = shareableLink;
                setIsSubmitting(true);

                fetch(`${import.meta.env.VITE_API_URL}/api/send-contact`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                })
                  .then((response) => response.json())
                  .then((result) => {
                    showToast("Sent successfully!", "success");
                    setIsSubmitting(false);
                    setShowContactModal(false);
                    setCustomMessage(
                      `The first digital business card that turns networking into passive income.`
                    );
                    setCustomTile("Free BizCard Offer!!!");
                    setCustomButtonText("Get Your Free! BizCard Today");
                    setGreatJobModal(true);
                  })
                  .catch((error) => {
                    console.error("Error sending email:", error);
                    setIsSubmitting(false);
                  });
              }}
            />
          )}
        </div>
      </div>
       <SignUpModal
              isOpen={isSignUpOpen}
              onClose={() => setIsSignUpOpen(false)}
              onShowSignIn={() => {
                setIsSignUpOpen(false);
                setIsSignInOpen(true);
              }}
            />
    </>
  );
}

FancyCardLayout.defaultProps = {
  cardData: {
    profile: { cardName: "Untitled", profilePic: "" },
    business: {
      first: "",
      last: "",
      accreditations: "",
      name: "",
      jobTitle: "",
      department: "",
      slogan: "",
      address: { street: "", city: "", state: "", zip: "", country: "" },
      phone: "",
      email: "",
      website: "",
    },
    social: {
      linkedin: "",
      twitter: "",
      facebook: "",
      youtube: "",
      instagram: "",
      tiktok: "",
    },
    about: { aboutMe: "", sectionType: "", customSectionTitle: "" },
    cta: {
      type: "booking",
      link: "",
      label: "",
      adsType: "product",
      adsImg: "",
    },
    theme: "#4299E1",
  },
};
