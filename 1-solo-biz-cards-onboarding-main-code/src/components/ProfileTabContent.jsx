// src/components/ProfileTabContent.jsx
import { useContext, useState, useRef, useEffect } from "react";
import { CardDataContext } from "../contexts/CardContext";
import { Camera, X } from "lucide-react";

import CommonFormElements from "./CommonFormElements";
import CropProfilePhotoModal from "./CropProfilePhotoModal";

export default function ProfileTabContent({ onSignInClick, onSignUpClick }) {
  const { cardData, setCardData } = useContext(CardDataContext);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Add state for tracking if the fields have been touched
  const [cardNameTouched, setCardNameTouched] = useState(false);
  const [businessCategoryTouched, setBusinessCategoryTouched] = useState(false);

  // Ensure default visibility is "private"
  useEffect(() => {
    if (cardData.visibility == null) {
      setCardData((prev) => ({
        ...prev,
        visibility: "private",
      }));
    }
  }, []); // runs on mount // Add an empty dependency array to run only on mount

  const handleCardNameChange = (e) => {
    setCardData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        cardName: e.target.value,
      },
    }));
  };

  // Handler for business category change
  const handleCategoryChange = (e) => {
    setCardData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        businessCategory: e.target.value,
        clientsPreference: "",  
      },
    }));
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      alert("Please upload a JPG, PNG, or WEBP file.");
      return;
    }

    if (file.size > maxSize) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setIsCropModalOpen(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImageUrl) => {
    setCardData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        profilePic: croppedImageUrl,
      },
    }));
  };

  const handleDeleteImage = () => {
    setCardData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        profilePic: null,
      },
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      {/* Card Name */}
      <div className="mb-8">
        <label className="block text-[rgb(55,65,81)] font-medium text-xs sm:text-sm leading-5 mb-1">
          Card Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., john-smith-business-card"
          className={`w-full p-2 pl-3 pr-3 border ${
            cardNameTouched && cardData.profile.cardName === ""
              ? "border-red-500"
              : "border-gray-300"
          } rounded-lg text-xs sm:text-sm leading-6`}
          value={cardData.profile.cardName}
          onChange={handleCardNameChange}
          onBlur={() => setCardNameTouched(true)}
        />
        {cardNameTouched && cardData.profile.cardName === "" ? (
          <p className="text-xs text-red-500 mt-1">Card name is required</p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            A unique identifier for your card&apos;s URL
          </p>
        )}
      </div>

      {/* Business Category Dropdown */}
      <div className="mb-8">
        <label className="block text-[rgb(55,65,81)] font-medium text-xs sm:text-sm leading-5 mb-1">
          Business Category <span className="text-red-500">*</span>
        </label>
        <select
          className={`w-full p-2 pl-3 pr-3 border appearance-none ${
            businessCategoryTouched && cardData.profile.businessCategory === ""
              ? "border-red-500"
              : "border-gray-300"
          } rounded-lg text-xs sm:text-sm leading-6`}
          value={cardData.profile.businessCategory || ""}
          onChange={handleCategoryChange}
          onBlur={() => setBusinessCategoryTouched(true)}
        >
          <option value="">Select Category</option>
          <option value="ARTS/MUSIC/WRITING">Arts/Music/Writing</option>
          <option value="BANKING/FINANCE">Banking/Finance</option>
          <option value="BUSINESS MGT">Business Mgt</option>
          <option value="COMMUNICATION">Communication</option>
          <option value="CONSTRUCTION">Construction</option>
          <option value="EDUCATION">Education</option>
          <option value="ENGINEERING">Engineering</option>
          <option value="ENTERTAINMENT">Entertainment</option>
          <option value="FARMING">Farming</option>
          <option value="GOV/POLITICS">Gov/Politics</option>
          <option value="HEALTHCARE">Healthcare</option>
          <option value="HOSPITALITY">Hospitality</option>
          <option value="IT/SOFTWARE">IT/Software</option>
          <option value="LEGAL">Legal</option>
          <option value="MANUFACTURING">Manufacturing</option>
          <option value="MILITARY">Military</option>
          <option value="NON-PROFIT">Non-Profit</option>
          <option value="REAL ESTATE">Real Estate</option>
          <option value="RETAIL">Retail</option>
          <option value="SALES/MARKETING">Sales/Marketing</option>
          <option value="SCIENCE/RESEARCH">Science/Research</option>
          <option value="SELF-EMPLOYED">Self-Employed</option>
          <option value="STUDENT">Student</option>
          <option value="TRANSPORTATION">Transportation</option>
          <option value="RETIRED">Retired</option>
          <option value="OTHER">Other</option>
        </select>
        {businessCategoryTouched && !cardData.profile.businessCategory ? (
          <p className="text-xs text-red-500 mt-1">
            Business category is required
          </p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            Please select a business category
          </p>
        )}
      </div>
      {cardData.profile.businessCategory && (
  <div className="mb-8">
    <label className="block text-[rgb(55,65,81)] font-medium text-xs sm:text-sm leading-5 mb-1">
      Clients/Leads Preference 
    </label>
    <select
      className="w-full p-2 pl-3 pr-3 border appearance-none border-gray-300 rounded-lg text-xs sm:text-sm leading-6"
      value={cardData.profile.clientsPreference || ""}
      onChange={(e) =>
        setCardData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            clientsPreference: e.target.value,
          },
        }))
      }
    >
      <option value="">Select Preference</option>
      <option value="local">Local Clients</option>
      <option value="non-local">Non-Local Clients</option>
      <option value="both">Both</option>
    </select>
    <p className="text-xs text-gray-500 mt-1">Select your target clients</p>
  </div>
)}


      {/* Profile Photo */}
      <div className="mb-8">
        <label className="block text-[rgb(55,65,81)] font-medium text-xs sm:text-sm leading-5 mb-1">
          Profile Photo
        </label>
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="relative group">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-150 overflow-hidden ${
                cardData.profile.profilePic
                  ? "bg-white border-3 border-white shadow-xl"
                  : "bg-[#e5e7eb] hover:bg-gray-300"
              }`}
            >
              {cardData.profile.profilePic ? (
                <img
                  src={cardData.profile.profilePic}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Camera size={20} className="text-gray-500" />
                  <span className="text-xs text-gray-500">Add Photo</span>
                </div>
              )}
            </button>

            {cardData.profile.profilePic && (
              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center p-1 hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Click to add/change photo (JPG, PNG, WEBP, max. 5MB)
          </p>
        </div>
      </div>

      {/* Common form elements: color, visibility, sign up/log in notice */}
      <CommonFormElements
        onSignInClick={onSignInClick}
        onSignUpClick={onSignUpClick}
      />

      {/* Crop Modal */}
      <CropProfilePhotoModal
        isOpen={isCropModalOpen}
        onClose={() => {
          setIsCropModalOpen(false);
          setSelectedImage(null);
        }}
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
