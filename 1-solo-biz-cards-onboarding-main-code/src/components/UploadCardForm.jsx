// src/components/UploadCardForm.jsx
import React, { useState, useContext } from "react";
import { CardDataContext } from "../contexts/CardContext";
import Tesseract from "tesseract.js";
import CircularIndeterminate from "./common/Loader"; // Adjust path as needed

/* 1) Enhanced parse function */
function parseOcrText(raw) {
  // Normalize the text: fix line breaks, quotes, excessive spaces
  let text = raw
    .replace(/\r\n/g, "\n")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s\s+/g, " ")
    .trim();

  const parsed = {
    theme: "#A3B9D7",
    profile: { cardName: "", profilePic: "" },
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
    about: { aboutMe: "" },
    cta: { type: "", link: "", label: "", adsType: "", adsImg: "" },
    rawText: text,
  };

  // 1) Name detection (try explicit "Name:" lines, fallback to a 2-word pattern)
  const nameLine = text.match(
    /(?:Name|Full\s*Name|Contact\s*Name)\s*[:\-]*\s+([A-Za-z]+)\s+([A-Za-z]+)/i
  );
  if (nameLine) {
    parsed.business.first = nameLine[1];
    parsed.business.last = nameLine[2];
  } else {
    // fallback: 2 capitalized words that might be a name
    const fullNameMatch = text.match(
      /\b([A-Z][a-zA-Z']{1,19})\s+([A-Z][a-zA-Z']{1,19})\b/
    );
    if (fullNameMatch) {
      parsed.business.first = fullNameMatch[1];
      parsed.business.last = fullNameMatch[2];
    }
  }

  // 2) Department
  if (/department/i.test(text)) {
    parsed.business.department = "Department";
  }

  // 3) Job Title
  const jobTitleMatch = text.match(
    /job\s*title\s*[»:-]?\s*([A-Za-z0-9\s.,'_\-]+)/i
  );
  if (jobTitleMatch) {
    parsed.business.jobTitle = jobTitleMatch[1]
      .split("\n")[0]
      .replace(/["]/g, "")
      .trim();
  }

  // 4) Company Name
  const companyMatch = text.match(/company\s*name\s*(.*)/i);
  if (companyMatch) {
    parsed.business.name = companyMatch[1]
      .split("\n")[0]
      .replace(/["]/g, "")
      .trim();
  }

  // 5) Slogan
  const sloganMatch = text.match(/slogan[:]?[\s"“”]*([A-Za-z0-9\s.,'"\-_/]+)/i);
  if (sloganMatch) {
    parsed.business.slogan = sloganMatch[1]
      .split("\n")[0]
      .replace(/["]/g, "")
      .trim();
  }

  // 6) Accreditations
  const accredMatch = text.match(/accreditations\s*[:]?(.+)/i);
  if (accredMatch) {
    parsed.business.accreditations = accredMatch[1].split("\n")[0].trim();
  }

  // 7) Phone (more flexible, capturing ext, etc.)
  //   e.g. +1 (333) 333-3333 ext. 123
  const phoneMatch = text.match(
    /(\+?\d{1,3}\s*\(?\d{1,4}\)?[\d\s\-().]{5,}\d(?:\s*(?:x|ext|#)\.?\s*\d+)?)/i
  );
  if (phoneMatch) {
    parsed.business.phone = phoneMatch[1].trim();
  }

  // 8) Email
  const emailMatch = text.match(
    /([a-zA-Z0-9_.+\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9.\-]+)/
  );
  if (emailMatch) {
    parsed.business.email = emailMatch[1].trim();
  }

  // 9) Website (http, www, or bare domain .com, .org, etc.)
  const websiteMatch = text.match(
    /(https?:\/\/[^\s]+|www\.[^\s]+|[A-Za-z0-9-]+\.[A-Za-z]{2,}\b)/i
  );
  if (websiteMatch) {
    parsed.business.website = websiteMatch[1].trim();
  }

  // 10) Address (loose match for \"address\" block or lines near \"Address\")
  //     This is a naive approach; you can improve if needed
  const addressBlockMatch = text.match(
    /(?:address|street\s*address)[^\n]*\n([\s\S]+?)(?:\n\n|about\s*me|$)/i
  );
  if (addressBlockMatch) {
    const lines = addressBlockMatch[1]
      .split(/\n|,/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines[0]) parsed.business.address.street = lines[0];
    if (lines[1]) parsed.business.address.city = lines[1];
    if (lines[2]) parsed.business.address.state = lines[2];
    if (lines[3]) parsed.business.address.zip = lines[3];
    if (lines[4]) parsed.business.address.country = lines[4];
  }

  // 11) About Me
  const aboutMeMatch = text.match(/about\s*me\s*\n([\s\S]+)/i);
  if (aboutMeMatch) {
    const aboutLines = aboutMeMatch[1].split("\n\n")[0].trim();
    parsed.about.aboutMe = aboutLines;
  }

  return parsed;
}

/* 2) Small field component */
function ExtractedField({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function UploadCardForm({ onApply }) {
  const { setCardData } = useContext(CardDataContext);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // New state for loader

  // 3) Handle file selection + OCR
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Start loader while processing
    setIsProcessing(true);

    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);

    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng", {
        tessedit_pageseg_mode: "3", // fully auto
      });

      let ocrData;
      // Attempt JSON parse if the card truly contained JSON
      try {
        ocrData = JSON.parse(text);
      } catch {
        // Fallback to regex parse
        ocrData = parseOcrText(text);
      }

      if (!ocrData.theme || typeof ocrData.theme !== "string") {
        ocrData.theme = "#A3B9D7";
      }
      setExtractedData(ocrData);
    } catch {
      // If OCR fails, fallback to an empty object with a safe theme
      setExtractedData({
        theme: "#A3B9D7",
        profile: { cardName: "", profilePic: "" },
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
          address: { street: "", city: "", state: "", zip: "", country: "" },
        },
        social: {
          linkedin: "",
          twitter: "",
          facebook: "",
          youtube: "",
          instagram: "",
          tiktok: "",
        },
        about: { aboutMe: "" },
        cta: { type: "", link: "", label: "", adsType: "", adsImg: "" },
      });
    } finally {
      // Stop loader after processing
      setIsProcessing(false);
    }
  };

  // New: Handle drag and drop file upload
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  };

  // Cancel/clear
  const handleCancelUpload = () => {
    setImagePreview(null);
    setExtractedData(null);
  };

  // 4) Apply extracted data to global form
  const handleApplyToForm = () => {
    try {
      if (extractedData) {
        if (!extractedData.theme || typeof extractedData.theme !== "string") {
          extractedData.theme = "#A3B9D7";
        }
        setCardData(extractedData);
        if (onApply) onApply();
      }
    } catch {
      alert(
        "An error occurred applying the data. Please fill fields manually."
      );
    }
  };

  // 5) Render the extracted form, but only for fields that have data
  const renderExtractedForm = () => {
    if (!extractedData) return null;

    const updateProfile = (key, val) => {
      setExtractedData((prev) => ({
        ...prev,
        profile: { ...prev.profile, [key]: val },
      }));
    };

    const updateBusiness = (key, val) => {
      setExtractedData((prev) => ({
        ...prev,
        business: { ...prev.business, [key]: val },
      }));
    };

    const updateAddress = (key, val) => {
      setExtractedData((prev) => ({
        ...prev,
        business: {
          ...prev.business,
          address: { ...prev.business.address, [key]: val },
        },
      }));
    };

    const updateAbout = (key, val) => {
      setExtractedData((prev) => ({
        ...prev,
        about: { ...prev.about, [key]: val },
      }));
    };

    const updateCta = (key, val) => {
      setExtractedData((prev) => ({
        ...prev,
        cta: { ...prev.cta, [key]: val },
      }));
    };

    // Decide which sections to show based on whether they have any data
    const hasProfileFields =
      extractedData.profile?.cardName || extractedData.profile?.profilePic;

    const hasBusinessFields = [
      extractedData.business?.first,
      extractedData.business?.last,
      extractedData.business?.accreditations,
      extractedData.business?.name,
      extractedData.business?.jobTitle,
      extractedData.business?.department,
      extractedData.business?.slogan,
      extractedData.business?.phone,
      extractedData.business?.email,
      extractedData.business?.website,
    ].some(Boolean);

    const hasAddressFields = [
      extractedData.business?.address?.street,
      extractedData.business?.address?.city,
      extractedData.business?.address?.state,
      extractedData.business?.address?.zip,
      extractedData.business?.address?.country,
    ].some(Boolean);

    const hasAboutFields = extractedData.about?.aboutMe;
    const hasCtaFields = [
      extractedData.cta?.type,
      extractedData.cta?.link,
      extractedData.cta?.label,
      extractedData.cta?.adsType,
      extractedData.cta?.adsImg,
    ].some(Boolean);

    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Extracted Information</h3>

        {/* PROFILE SECTION */}
        {hasProfileFields && (
          <div className="mb-6">
            <h4 className="text-base font-semibold text-gray-700 mb-2">
              Profile
            </h4>
            {extractedData.profile?.cardName && (
              <ExtractedField
                label="Card Name"
                value={extractedData.profile.cardName}
                onChange={(val) => updateProfile("cardName", val)}
              />
            )}
            {extractedData.profile?.profilePic && (
              <ExtractedField
                label="Profile Image (URL)"
                value={extractedData.profile.profilePic}
                onChange={(val) => updateProfile("profilePic", val)}
              />
            )}
          </div>
        )}

        {/* BUSINESS SECTION */}
        {hasBusinessFields && (
          <div className="mb-6">
            <h4 className="text-base font-semibold text-gray-700 mb-2">
              Business
            </h4>
            {extractedData.business?.first && (
              <ExtractedField
                label="First Name"
                value={extractedData.business.first}
                onChange={(val) => updateBusiness("first", val)}
              />
            )}
            {extractedData.business?.last && (
              <ExtractedField
                label="Last Name"
                value={extractedData.business.last}
                onChange={(val) => updateBusiness("last", val)}
              />
            )}
            {extractedData.business?.accreditations && (
              <ExtractedField
                label="Accreditations"
                value={extractedData.business.accreditations}
                onChange={(val) => updateBusiness("accreditations", val)}
              />
            )}
            {extractedData.business?.name && (
              <ExtractedField
                label="Company Name"
                value={extractedData.business.name}
                onChange={(val) => updateBusiness("name", val)}
              />
            )}
            {extractedData.business?.jobTitle && (
              <ExtractedField
                label="Job Title"
                value={extractedData.business.jobTitle}
                onChange={(val) => updateBusiness("jobTitle", val)}
              />
            )}
            {extractedData.business?.department && (
              <ExtractedField
                label="Department"
                value={extractedData.business.department}
                onChange={(val) => updateBusiness("department", val)}
              />
            )}
            {extractedData.business?.slogan && (
              <ExtractedField
                label="Slogan"
                value={extractedData.business.slogan}
                onChange={(val) => updateBusiness("slogan", val)}
              />
            )}
            {extractedData.business?.phone && (
              <ExtractedField
                label="Phone"
                value={extractedData.business.phone}
                onChange={(val) => updateBusiness("phone", val)}
              />
            )}
            {extractedData.business?.email && (
              <ExtractedField
                label="Email"
                value={extractedData.business.email}
                onChange={(val) => updateBusiness("email", val)}
              />
            )}
            {extractedData.business?.website && (
              <ExtractedField
                label="Website"
                value={extractedData.business.website}
                onChange={(val) => updateBusiness("website", val)}
              />
            )}

            {/* ADDRESS SUBSECTION */}
            {hasAddressFields && (
              <>
                <h5 className="text-sm font-medium text-gray-600 mt-4 mb-2">
                  Address
                </h5>
                {extractedData.business.address?.street && (
                  <ExtractedField
                    label="Street"
                    value={extractedData.business.address.street}
                    onChange={(val) => updateAddress("street", val)}
                  />
                )}
                {extractedData.business.address?.city && (
                  <ExtractedField
                    label="City"
                    value={extractedData.business.address.city}
                    onChange={(val) => updateAddress("city", val)}
                  />
                )}
                {extractedData.business.address?.state && (
                  <ExtractedField
                    label="State"
                    value={extractedData.business.address.state}
                    onChange={(val) => updateAddress("state", val)}
                  />
                )}
                {extractedData.business.address?.zip && (
                  <ExtractedField
                    label="Zip"
                    value={extractedData.business.address.zip}
                    onChange={(val) => updateAddress("zip", val)}
                  />
                )}
                {extractedData.business.address?.country && (
                  <ExtractedField
                    label="Country"
                    value={extractedData.business.address.country}
                    onChange={(val) => updateAddress("country", val)}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* ABOUT SECTION */}
        {hasAboutFields && (
          <div className="mb-6">
            <h4 className="text-base font-semibold text-gray-700 mb-2">
              About
            </h4>
            {extractedData.about?.aboutMe && (
              <ExtractedField
                label="About Me"
                value={extractedData.about.aboutMe}
                onChange={(val) => updateAbout("aboutMe", val)}
              />
            )}
          </div>
        )}

        {/* CTA SECTION */}
        {hasCtaFields && (
          <div className="mb-6">
            <h4 className="text-base font-semibold text-gray-700 mb-2">CTA</h4>
            {extractedData.cta?.type && (
              <ExtractedField
                label="Type"
                value={extractedData.cta.type}
                onChange={(val) => updateCta("type", val)}
              />
            )}
            {extractedData.cta?.link && (
              <ExtractedField
                label="Link"
                value={extractedData.cta.link}
                onChange={(val) => updateCta("link", val)}
              />
            )}
            {extractedData.cta?.label && (
              <ExtractedField
                label="Label"
                value={extractedData.cta.label}
                onChange={(val) => updateCta("label", val)}
              />
            )}
            {extractedData.cta?.adsType && (
              <ExtractedField
                label="Ads Type"
                value={extractedData.cta.adsType}
                onChange={(val) => updateCta("adsType", val)}
              />
            )}
            {extractedData.cta?.adsImg && (
              <ExtractedField
                label="Ads Image (URL)"
                value={extractedData.cta.adsImg}
                onChange={(val) => updateCta("adsImg", val)}
              />
            )}
          </div>
        )}

        {/* Apply Button */}
        <button
          onClick={handleApplyToForm}
          className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base cursor-pointer"
        >
          Apply to Form
        </button>
      </div>
    );
  };

  return (
    <div>
      {/* If no image yet, show the upload area */}
      {!imagePreview && (
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 text-center mb-4"
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
            handleDrop(e);
          }}
        >
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            Drop your business card image here or click to upload
          </p>
          <p className="text-xs sm:text-sm text-gray-400">
            Supports JPG, PNG, PDF (max 5MB)
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="cardUploadInput"
          />
          <label
            htmlFor="cardUploadInput"
            className="cursor-pointer text-blue-500 text-sm mt-2"
          >
            Click here to select a file
          </label>
        </div>
      )}

      {/* Show preview if an image is selected */}
      {imagePreview && (
        <div className="mb-4 relative flex justify-center">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-xs border border-gray-200 rounded"
          />
          <button
            onClick={handleCancelUpload}
            className="absolute top-0 right-0 m-2 bg-white rounded-full p-1 hover:bg-gray-200"
          >
            &#x2715;
          </button>
        </div>
      )}
      {isProcessing && (
        <CircularIndeterminate
          message="Processing your business card..."
          variant="small"
          className="mb-4"
          color="primary.main"
        />
      )}

      {/* If data was extracted, show form */}
      {extractedData && (
        <div className="p-4 border border-gray-200 rounded mb-4">
          {renderExtractedForm()}
        </div>
      )}
    </div>
  );
}
