// src/components/ManualEntryForm.jsx
import { useContext, useState } from "react";
import { CardDataContext } from "../contexts/CardContext";

export default function ManualEntryForm() {
  const { cardData, setCardData } = useContext(CardDataContext);

  // Local error states for phone, email, and website
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [websiteError, setWebsiteError] = useState("");

  // General handler for business-level fields
  const handleChange = (field, value) => {
    setCardData((prev) => ({
      ...prev,
      business: {
        ...prev.business,
        [field]: value,
      },
    }));

    // Validation checks
    if (field === "phone") {
      // Strip out non-digit characters
      const digitsOnly = value.replace(/\D/g, "");
      if (value.trim() === "") {
        setPhoneError("");
      } else if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        setPhoneError("Phone number must be between 10 and 15 digits.");
      } else {
        setPhoneError("");
      }
    }

    if (field === "email") {
      if (value.trim() === "") {
        setEmailError("");
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setEmailError("Please enter a valid email address.");
        } else {
          setEmailError("");
        }
      }
    }

    if (field === "website") {
      if (value.trim() === "") {
        setWebsiteError("");
      } else {
        try {
          // Attempt to parse as a valid URL
          new URL(value);
          setWebsiteError("");
        } catch {
          setWebsiteError("Please enter a valid URL (e.g., https://example.com).");
        }
      }
    }
  };

  // Handler for nested address fields
  const handleAddressChange = (field, value) => {
    setCardData((prev) => ({
      ...prev,
      business: {
        ...prev.business,
        address: {
          ...prev.business.address,
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="grid gap-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
            First Name*
          </label>
          <input
            type="text"
            placeholder="First Name"
            value={cardData.business.first}
            onChange={(e) => handleChange("first", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
          />
        </div>
        {/* Last Name */}
        <div>
          <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
            Last Name*
          </label>
          <input
            type="text"
            placeholder="Last Name"
            value={cardData.business.last}
            onChange={(e) => handleChange("last", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Accreditations */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          Accreditations
        </label>
        <input
          type="text"
          placeholder="e.g., MBA, PhD, CPA (seperate with commas)"
          value={cardData.business.accreditations || ""}
          onChange={(e) => handleChange("accreditations", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
        />
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          Company Name
        </label>
        <input
          type="text"
          placeholder="Enter your company name"
          value={cardData.business.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
        />
      </div>

      {/* Job Title */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          Job Title
        </label>
        <input
          type="text"
          placeholder="e.g., Senior Software Engineer"
          value={cardData.business.jobTitle}
          onChange={(e) => handleChange("jobTitle", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
        />
      </div>

      {/* Department */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          Department
        </label>
        <input
          type="text"
          placeholder="e.g., Engineering, Sales, Marketing"
          value={cardData.business.department}
          onChange={(e) => handleChange("department", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
        />
      </div>

      {/* Company Slogan */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          Company Slogan
        </label>
        <input
          type="text"
          placeholder="Enter your slogan or tagline"
          value={cardData.business.slogan}
          onChange={(e) => handleChange("slogan", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          Phone Number <span className="text-gray-400 text-xs">Optional</span>
        </label>
        <input
          type="text"
          placeholder="e.g., +1 234 567 8901"
          value={cardData.business.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          onKeyPress={(e) => {
            // Allow only numbers, spaces, parentheses, plus, and hyphens
            const charCode = e.charCode;
            if (!/[0-9 ()+-]/.test(String.fromCharCode(charCode))) {
              e.preventDefault();
            }
          }}
          className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
        />
        <p className="text-gray-400 text-xs py-2">
          Format: (XXX) XXX-XXXX or +X (XXX) XXX-XXXX
        </p>
        {/* Dynamic phone error */}
        {phoneError && (
          <p className="text-red-500 text-xs">{phoneError}</p>
        )}
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          Email Address <span className="text-gray-400 text-xs">Optional</span>
        </label>
        <input
          type="text"
          placeholder="your.email@company.com"
          value={cardData.business.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
        />
        {/* Dynamic email error */}
        {emailError && (
          <p className="text-red-500 text-xs mt-1">{emailError}</p>
        )}
      </div>

      {/* Website URL */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          Website URL <span className="text-gray-400 text-xs">Optional</span>
        </label>
        <input
          type="text"
          placeholder="https://www.yourwebsite.com"
          value={cardData.business.website}
          onChange={(e) => handleChange("website", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
        />
        <p className="text-gray-400 text-xs py-2">
          Example: https://www.example.com or www.example.com
        </p>
        {/* Dynamic website error */}
        {websiteError && (
          <p className="text-red-500 text-xs">{websiteError}</p>
        )}
      </div>

      {/* Company Address Heading */}
      <p className="block text-sm sm:text-md text-[rgb(25,24,24)] font-bold mb-1">
        Company Address
      </p>

      {/* Street Address */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          Street Address
        </label>
        <input
          type="text"
          placeholder="123 business street"
          value={cardData.business.address.street}
          onChange={(e) => handleAddressChange("street", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
        />
      </div>

      {/* City and State/Province */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* City */}
        <div>
          <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
            City
          </label>
          <input
            type="text"
            placeholder="City"
            value={cardData.business.address.city}
            onChange={(e) => handleAddressChange("city", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
          />
        </div>
        {/* State/Province */}
        <div>
          <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
            State/Province
          </label>
          <input
            type="text"
            placeholder="State/Province"
            value={cardData.business.address.state}
            onChange={(e) => handleAddressChange("state", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* ZIP/Postal Code and Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ZIP/Postal Code */}
        <div>
          <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
            ZIP/Postal Code
          </label>
          <input
            type="text"
            placeholder="ZIP/Postal Code"
            value={cardData.business.address.zip}
            onChange={(e) => handleAddressChange("zip", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
          />
        </div>
        {/* Country */}
        <div>
          <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
            Country
          </label>
          <input
            type="text"
            placeholder="Country"
            value={cardData.business.address.country}
            onChange={(e) => handleAddressChange("country", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}
