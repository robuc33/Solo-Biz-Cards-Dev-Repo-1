import { useContext, useState, useRef } from "react";
import { Lock, X } from "lucide-react";
import { CardDataContext } from "../contexts/CardContext";
import ActionButtons from "./common/ActionButtons";
import { useAuth } from "../contexts/AuthContext";
import SignInModal from "./SignInModal.jsx";
import SignUpModal from "./SignUpModal.jsx";

export default function CtaTabContent() {
  const { cardData, setCardData } = useContext(CardDataContext);
  const { cta } = cardData;
  const { isAuthenticated } = useAuth(); // Check if the user is logged in
  const baseUrl = "https://calendly.com/";
  const [showSignIn, setShowSignIn] = useState(false); // Modal state
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [modelMsg, setModelMsg] = useState("");

  // Declare a ref for the ads image file input
  const adsImgInputRef = useRef(null);

  // Handle changes to appointment type
  const handleAppointmentTypeChange = (e) => {
    const newType = e.target.value;

    if ((newType === "cta" || newType === "directads") && !isAuthenticated) {
      const message =
        newType === "cta"
          ? "This is a premium feature. Please log in to access Call-to-Action."
          : "This is a premium feature. Please log in to access Direct Ads.";

      setModelMsg(message);
      setShowSignIn(true); // Show sign-in modal
      return;
    }

    setCardData((prev) => ({
      ...prev,
      cta: {
        ...prev.cta,
        type: newType,
      },
    }));
  };

  // Handle input changes
  const handleLinkChange = (e) =>
    setCardData((prev) => ({
      ...prev,
      cta: { ...prev.cta, link: e.target.value },
    }));
  const handleLabelChange = (e) =>
    setCardData((prev) => ({
      ...prev,
      cta: { ...prev.cta, label: e.target.value },
    }));
  const handleAdsTypeChange = (e) =>
    setCardData((prev) => ({
      ...prev,
      cta: { ...prev.cta, adsType: e.target.value },
    }));

  // Handle Image Upload for Direct Ads
  const handleadsImgChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 4.8 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size exceeds 5MB. Please select a smaller file.");
      if (adsImgInputRef.current) {
        adsImgInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setCardData((prev) => ({
        ...prev,
        cta: { ...prev.cta, adsImg: ev.target.result },
      }));
      // Clear the file input so that selecting the same file again will trigger onChange
      if (adsImgInputRef.current) {
        adsImgInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };
  const handleAdsImgDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleadsImgChange(fakeEvent);
    }
  };

  return (
    <div className="space-y-4">
      {/* Appointment Type Selection */}
      <div>
        <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-2">
          Appointment Type
        </label>
        <p className="text-gray-500 mb-2 text-sm">
          You must log in to use Pro Features. Sign-up is Free!
        </p>
        <div className="flex flex-wrap items-center gap-4 mb-4 mt-4">
          {/* Booking Link */}
          <label className="flex items-center gap-1 text-xs sm:text-sm">
            <input
              type="radio"
              name="appointmentType"
              value="booking"
              checked={cta.type === "booking"}
              onChange={handleAppointmentTypeChange}
            />
            <span>Booking Link</span>
          </label>

          {/* Call-to-Action (locked) */}
          <label className="flex items-center gap-1 text-xs sm:text-sm">
            <input
              type="radio"
              name="appointmentType"
              value="cta"
              checked={cta.type === "cta"}
              onChange={handleAppointmentTypeChange}
            />
            <span>Call-to-Action</span>
            <Lock size={14} className="ml-1 text-yellow-500" />
          </label>

          {/* Direct Ads (locked) */}
          <label className="flex items-center gap-1 text-xs sm:text-sm">
            <input
              type="radio"
              name="appointmentType"
              value="directads"
              checked={cta.type === "directads"}
              onChange={handleAppointmentTypeChange}
            />
            <span>Direct Ads</span>
            <Lock size={14} className="ml-1 text-yellow-500" />
          </label>

          <label className="flex items-center gap-1 text-xs sm:text-sm">
            <input type="checkbox" name="appointmentType" />
            <span>Leads Capture</span>
            <Lock size={14} className="ml-1 text-yellow-500" />
          </label>
        </div>
      </div>

      {/* Booking Link */}
      {cta.type === "booking" && (
        <div>
          <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-2">
            Calendly Link
          </label>
          <input
            type="text"
            placeholder="https://calendly.com/username"
            className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
            value={cta.link}
            onFocus={() => {
              if (!cta.link.startsWith(baseUrl))
                handleLinkChange({ target: { value: baseUrl } });
            }}
            onBlur={() => {
              if (cta.link === baseUrl)
                handleLinkChange({ target: { value: "" } });
            }}
            onChange={handleLinkChange}
          />
          <p className="text-xs text-gray-500 mt-2">
            Add your Calendly link to allow visitors to schedule meetings
          </p>
        </div>
      )}

      {/* CTA */}
      {cta.type === "cta" && (
        <div>
          <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-2">
            Custom CTA URL
          </label>
          <p className="text-sm text-gray-600 mt-2 mb-2">
            Add a custom call-to-action button with your own URL and label.
          </p>
          <input
            type="text"
            placeholder="https://example.com/contact"
            className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
            value={cta.link}
            onChange={handleLinkChange}
          />

          <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-2 mt-4">
            Custom CTA Label
          </label>
          <p className="text-sm text-gray-600">
            Add your custom call-to-action label to the button. i.e., Visit My
            Listing, My Portfolio, etc.
          </p>
          <p className="text-sm text-gray-600 mb-2">Keep it short.</p>
          <input
            type="text"
            placeholder="Call to Action"
            className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
            value={cta.label}
            onChange={handleLabelChange}
          />
        </div>
      )}

      {/* Direct Ads */}
      {cta.type === "directads" && (
        <div className="space-y-4">
          <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-2">
            Direct Ads Type
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
            value={cta.adsType || "product"}
            onChange={handleAdsTypeChange}
          >
            <option value="product">Product</option>
            <option value="event">Event</option>
            <option value="service">Service</option>
          </select>

          <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-2">
            Product Image
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded p-6 text-center cursor-pointer hover:bg-gray-50"
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAdsImgDrop(e);
            }}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="adsImgInput"
              onChange={handleadsImgChange}
              ref={adsImgInputRef}
            />
            {cta.adsImg ? (
              <div className="relative flex flex-col items-center">
                <img
                  src={cta.adsImg}
                  alt="Ads Preview"
                  className="max-h-48 object-cover rounded mb-2"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 m-2 bg-white rounded-full p-1 hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCardData((prev) => ({
                      ...prev,
                      cta: { ...prev.cta, adsImg: null },
                    }));
                  }}
                >
                  <X size={16} className="text-red-600" />
                </button>
              </div>
            ) : (
              <label htmlFor="adsImgInput" className="block">
                <p className="text-gray-600 text-sm mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  JPG, PNG or GIF (max. 5MB)
                </p>
                <p className="text-xs text-gray-500">
                  For optimal results, please use dimensions up to 8.5" x 11".
                </p>
              </label>
            )}
          </div>
        </div>
      )}

      <ActionButtons />

      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onShowSignUp={() => {
          setShowSignIn(false);
          setIsSignUpOpen(true);
        }}
        message={modelMsg}
      />

      {isSignUpOpen && (
        <SignUpModal
          isOpen={isSignUpOpen}
          onClose={() => setIsSignUpOpen(false)}
          onShowSignIn={() => {
            setIsSignUpOpen(false);
            setShowSignIn(true);
          }}
        />
      )}
    </div>
  );
}
