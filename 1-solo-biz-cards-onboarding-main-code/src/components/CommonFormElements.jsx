// src/components/CommonFormElements.jsx
import { useContext, useState } from "react";
import { CardDataContext } from "../contexts/CardContext";
import { Link } from "react-router-dom";
import ActionButtons from "./common/ActionButtons";
import { useAuth } from "../contexts/AuthContext";

export default function CommonFormElements({ onSignInClick, onSignUpClick }) {
  const { cardData, setCardData } = useContext(CardDataContext);
  const { visibility, theme } = cardData;
  const { isAuthenticated } = useAuth();

  const colorPresets = [
    "#F95F5F",
    "#FF8A4C",
    "#FFD93D",
    "#B87D4B",
    "#4CD964",
    "#4ECDC4",
    "#4299E1",
    "#5856D6",
    "#AF52DE",
    "#FF2D55",
    "#2C3E50",
    "#8E8E93",
  ];
  const [defaultTheme, setDefaultTheme] = useState("#4299E1");

  const handleSetVisibility = (newVisibility) => {
    setCardData((prev) => ({ ...prev, visibility: newVisibility }));
  };
  const sanitizeColor = (color) => {
    if (typeof color !== "string") return "#4299E1";
    return color.toLowerCase().includes("oklch") ? "#4299E1" : color;
  };
  const handleSettheme = (color) => {
    const safeColor = sanitizeColor(color);
    setCardData((prev) => ({ ...prev, theme: safeColor }));
  };

  return (
    <div>
      {/* Card Visibility */}
      <div className="mb-8">
        <label className="block text-[rgb(55,65,81)] font-medium text-sm sm:text-base leading-5 mb-1">
          Card Visibility
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => handleSetVisibility("public")}
            className={`px-3 hover:bg-[rgb(22,163,74)] cursor-pointer hover:text-white py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-150 ${
              visibility === "public"
                ? "bg-[rgb(22,163,74)] text-white"
                : "bg-[rgb(243,244,246)] text-[rgb(75,85,99)]"
            }`}
          >
            Public
          </button>
          <button
            onClick={() => handleSetVisibility("private")}
            className={`px-3 hover:bg-[rgb(37, 99, 235)] cursor-pointer hover:text-white py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-150 ${
              visibility === "private"
                ? "bg-[rgb(37,99,235)] text-white"
                : "bg-[rgb(243,244,246)] text-[rgb(75,85,99)]"
            }`}
          >
            Private
          </button>
        </div>
        {visibility === "public" ? (
          <p className="text-xs text-gray-500 mt-1">
            Your card will be visible in the members directory
          </p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            Only people with the direct link can view your card
          </p>
        )}
      </div>

      {/* Brand Color */}
      <div className="mb-8">
        <label className="block text-[rgb(55,65,81)] font-medium text-sm sm:text-base leading-5 mb-1">
          Brand Color
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-1">
            <input
              type="color"
              value={theme || defaultTheme}
              onChange={(e) => handleSettheme(e.target.value)}
              className="w-8 h-8 p-0 rounded border-none cursor-pointer"
            />
            <input
              type="text"
              value={theme || defaultTheme}
              onChange={(e) => handleSettheme(e.target.value)}
              className="w-20 text-xs sm:text-sm p-1 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex flex-wrap gap-[8px] w-full">
            {colorPresets.map((color) => (
              <button
                key={color}
                onClick={() => handleSettheme(color)}
                className="w-7 h-7  rounded-full border border-gray-300 cursor-pointer hover:scale-[1.09]"
                style={
                  (theme || defaultTheme).toLowerCase() === color.toLowerCase()
                    ? {
                        backgroundColor: color,
                        boxShadow: "0 0 0 1.5px white, 0 0 0 3.5px " + color,
                      }
                    : { backgroundColor: color }
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons (Download, Share, etc.) */}
      <ActionButtons />

      {/* Sign Up / Log In Notice */}
      <div className="mt-8 text-center">
        {!isAuthenticated && (
          <>
            <p className="text-xs sm:text-sm text-gray-600">
              Want to save your card?{" "}
              <button
                onClick={onSignUpClick}
                className="text-[rgb(37,99,235)] font-medium cursor-pointer"
              >
                Sign up
              </button>{" "}
              or{" "}
              <button
                onClick={onSignInClick}
                className="text-[rgb(37,99,235)] font-medium cursor-pointer"
              >
                log in
              </button>
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              By continuing, you agree to our{" "}
              <Link to="/privacy-policy">
                <span className="text-[rgb(37,99,235)] no-underline">
                  Privacy Policy
                </span>
              </Link>{" "}
              and{" "}
              <Link to="/terms-of-service">
                <span className="text-[rgb(37,99,235)] no-underline">
                  Terms of Service
                </span>{" "}
              </Link>
            </p>{" "}
          </>
        )}
      </div>
    </div>
  );
}
