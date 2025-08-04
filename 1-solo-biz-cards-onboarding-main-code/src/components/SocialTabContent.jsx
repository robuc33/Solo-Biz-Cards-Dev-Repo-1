import { useState, useContext } from "react";
import { CardDataContext } from "../contexts/CardContext";
import ActionButtons from "./common/ActionButtons";

export default function SocialTabContent() {
  const { cardData, setCardData } = useContext(CardDataContext);
  const socialUrls = cardData.social;
  const [warning, setWarning] = useState("");

  // Base URLs for each platform.
  const baseUrls = {
    linkedin: "https://linkedin.com/in/",
    twitter: "https://twitter.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/@",
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/@",
  };

  // Count a field as active if it has any non-empty value.
  const countActiveSocials = () => {
    return Object.keys(baseUrls).reduce((count, platform) => {
      const value = socialUrls[platform];
      if (value && value.trim() !== "") {
        return count + 1;
      }
      return count;
    }, 0);
  };

  // Determine if a field should be locked (readOnly)
  // Lock if there are already 4 active socials and this field is still empty.
  const isLocked = (platform) => {
    const activeCount = countActiveSocials();
    const isFieldActive =
      socialUrls[platform] && socialUrls[platform].trim() !== "";
    return activeCount >= 4 && !isFieldActive;
  };

  // When an input receives focus:
  // If it's empty and allowed, prefill with its base URL.
  // Otherwise, if the maximum is reached, set a warning.
  const handleFocus = (platform) => {
    // Clear any previous warning.
    setWarning("");
    if (isLocked(platform)) {
      setWarning("Maximum of 4 social media links allowed");
      return;
    }
    if (!socialUrls[platform] || socialUrls[platform].trim() === "") {
      if (countActiveSocials() < 4) {
        setCardData((prev) => ({
          ...prev,
          social: {
            ...prev.social,
            [platform]: baseUrls[platform],
          },
        }));
      }
    }
  };

  // On blur, if the value remains exactly the base URL, clear it.
  const handleBlur = (platform) => {
    setWarning("");
    if (socialUrls[platform] === baseUrls[platform]) {
      setCardData((prev) => ({
        ...prev,
        social: {
          ...prev.social,
          [platform]: "",
        },
      }));
    }
  };

  // Update the field as the user types.
  const handleChange = (platform, value) => {
    setCardData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value,
      },
    }));
  };

  // Prevent deletion of the base placeholder via backspace.
  const handleKeyDown = (platform, e) => {
    if (e.key === "Backspace" && socialUrls[platform] === baseUrls[platform]) {
      e.preventDefault();
    }
  };

  // Common input props for cleaner code.
  const commonInputProps = (platform) => ({
    type: "text",
    value: socialUrls[platform] || "",
    onFocus: () => handleFocus(platform),
    onBlur: () => handleBlur(platform),
    onChange: (e) => handleChange(platform, e.target.value),
    onKeyDown: (e) => handleKeyDown(platform, e),
    // Instead of disabled, use readOnly when locked.
    readOnly: isLocked(platform),
    // Apply a "locked" style when readOnly.
    className: `w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-sm ${
      isLocked(platform) ? "bg-gray-100 cursor-not-allowed" : ""
    }`,
  });

  return (
    <div className="space-y-4">
      {warning && (
        <div className="p-3 bg-red-100 text-red-700 rounded">{warning}</div>
      )}

      {/* LinkedIn */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          LinkedIn URL
        </label>
        <input
          placeholder="https://linkedin.com/in/your-profile"
          {...commonInputProps("linkedin")}
        />
      </div>

      {/* Twitter */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          Twitter URL
        </label>
        <input
          placeholder="https://twitter.com/username"
          {...commonInputProps("twitter")}
        />
      </div>

      {/* Facebook */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          Facebook Page URL
        </label>
        <input
          placeholder="https://facebook.com/username"
          {...commonInputProps("facebook")}
        />
      </div>

      {/* YouTube */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          YouTube Channel URL
        </label>
        <input
          placeholder="https://youtube.com/@channelname"
          {...commonInputProps("youtube")}
        />
      </div>

      {/* Instagram */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          Instagram URL
        </label>
        <input
          placeholder="https://instagram.com/username"
          {...commonInputProps("instagram")}
        />
      </div>

      {/* TikTok */}
      <div>
        <label className="block text-xs sm:text-sm text-[rgb(55,65,81)] font-medium mb-1">
          TikTok URL
        </label>
        <input
          placeholder="https://tiktok.com/@username"
          {...commonInputProps("tiktok")}
        />
      </div>

      <ActionButtons />
    </div>
  );
}
