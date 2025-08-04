import { useContext, useState } from "react";
import { Lock } from "lucide-react";
import { CardDataContext } from "../contexts/CardContext";
import ActionButtons from "./common/ActionButtons";
import { useAuth } from "../contexts/AuthContext";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";

export default function AboutTabContent() {
  const { cardData, setCardData } = useContext(CardDataContext);
  const {
    sectionType = "aboutMe",
    customSectionTitle = "",
    aboutMe = "",
  } = cardData.about || {};
  const { isAuthenticated } = useAuth(); // Check if the user is logged in
  const [showSignIn, setShowSignIn] = useState(false); // Modal state
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  // Handle toggling between 'About Me' and 'Custom Section Title'
  const handleSectionTypeChange = (newType) => {
    if (newType === "custom" && !isAuthenticated) {
      setShowSignIn(true); // Show sign-in modal if user is not logged in
      return;
    }

    setCardData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        sectionType: newType,
      },
    }));
  };

  // Handle changes to the custom section title
  const handleCustomTitleChange = (e) => {
    setCardData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        customSectionTitle: e.target.value,
      },
    }));
  };

  // Handle changes to the text area
  const handleAboutChange = (e) => {
    const text = e.target.value.slice(0, 250); // enforce max 250 chars
    setCardData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        aboutMe: text,
      },
    }));
  };

  const charCount = aboutMe.length;

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Section Type */}
      <div>
        <label className="block text-sm text-gray-700 font-medium mb-2">
          Section Type
        </label>
        <div className="flex flex-wrap items-center gap-4">
          {/* About Me Radio */}
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="sectionType"
              className="mr-1"
              checked={sectionType === "aboutMe"}
              onChange={() => handleSectionTypeChange("aboutMe")}
            />
            <span className="text-sm text-gray-700">About Me</span>
          </label>

          {/* Custom Section Title Radio */}
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="sectionType"
              className="mr-1"
              checked={sectionType === "custom"}
              onChange={() => handleSectionTypeChange("custom")}
            />
            <span className="text-sm text-gray-700">Custom Section Title</span>
            <Lock size={14} className="ml-1 text-yellow-500" />
          </label>
        </div>
      </div>

      {/* If custom section title is selected, show the text input */}
      {sectionType === "custom" && (
        <div>
          <input
            type="text"
            placeholder="Enter custom section title"
            value={customSectionTitle}
            onChange={handleCustomTitleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      )}

      {/* Short Bio Section */}
      <div>
        <label className="block text-sm text-gray-700 font-medium mb-3">
          Short Bio, Company Description, Education, etc.{" "}
          <span className="text-gray-600">{charCount}/250</span>
        </label>
        <textarea
          rows={5}
          value={aboutMe}
          onChange={handleAboutChange}
          maxLength={250} // also enforce at the textarea level
          placeholder="Share your professional background, expertise, or company mission. What makes you or your business unique?"
          className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
        />
      </div>

      {/* Action Buttons */}
      <ActionButtons />

      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onShowSignUp={() => {
          setShowSignIn(false);
          setIsSignUpOpen(true);
        }}
        message="This is a premium feature. Please log in to access Custom Section Title."
      />

      {/* Sign Up Modal */}
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
