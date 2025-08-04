import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import UpgradeToProModal from "./UpgradeToPro";
import { lightenColor } from "./BusinessCardCreator";
import { createPortal } from "react-dom";

const ShareModal = ({
  setShowShareModal,
  shareableLink,
  isLocal,
  theme,
  profile,
  business,
}) => {
  const [qrCode, setQrCode] = useState(null);
  const [showUpgradeToPro, setShowUpgradeToPro] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  // Use theme prop or fallback to default blue
  const themeColor = theme || "#2871FA";

  // If running locally, override shareableLink
  if (isLocal) {
    shareableLink = window.location.origin;
  }

  useEffect(() => {
    if (shareableLink) {
      // Adjust QR size as needed
      setQrCode(
        <QRCodeSVG
          value={shareableLink}
          size={240}
          level="H"
          fgColor={themeColor}
        />
      );
    }
  }, [shareableLink]);

  // Copy to clipboard
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareableLink);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  // Show Upgrade modal if local, else open correct share link
  function handleEmailShare() {
    if (isLocal) {
      setShowUpgradeToPro(true);
    } else {
      const subject = encodeURIComponent("My BizCard");
      console.log("Businesss", business);

      const asterisks = "**********************";
      const nameLine = `${business.first} ${business.last}'s Business Card`;

      const bodyContent = `${asterisks}\n${nameLine}\n${asterisks}\n${shareableLink}`;
      const body = encodeURIComponent(bodyContent);

      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  }

  function handleTextShare() {
    if (isLocal) {
      setShowUpgradeToPro(true);
    } else {
      const asterisks = "**********************";
      const nameLine = `${business.first} ${business.last}'s Business Card`;
      const smsContent = `${asterisks}\n${nameLine}\n${asterisks}\n${shareableLink}`;
      const smsMessage = encodeURIComponent(smsContent);

      window.location.href = `sms:?body=${smsMessage}`;
    }
  }
  function handleLinkedInShare() {
    if (isLocal) {
      setShowUpgradeToPro(true);
    } else {
      const asterisks = "**********************";
      const nameLine = `${business.first} ${business.last}'s Business Card`;
      const description = `${asterisks}\n${nameLine}\n${asterisks}\n`;
      const encodedDescription = encodeURIComponent(description);

      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${shareableLink}&text=${encodedDescription}`,
        "_blank"
      );
    }
  }

  function handleTwitterShare() {
    if (isLocal) {
      setShowUpgradeToPro(true);
    } else {
      const asterisks = "**********************"; // 22 asterisks
      const nameLine = `${business.first} ${business.last}'s Business Card`;

      const tweetText = `${asterisks}\n${nameLine}\n${asterisks}`;
      const encodedTweetText = encodeURIComponent(tweetText);
      const encodedURL = encodeURIComponent(shareableLink);

      const twitterShareUrl = `https://x.com/intent/post?text=${encodedTweetText}&url=${encodedURL}`;
      window.open(twitterShareUrl, "_blank");
    }
  }

  function handleWhatsAppShare() {
    if (isLocal) {
      setShowUpgradeToPro(true);
    } else {
      const asterisks = "**********************";
      const nameLine = `${business.first} ${business.last}'s Business Card`;
      const message = `${asterisks}\n${nameLine}\n${asterisks}\n${shareableLink}`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    }
  }
  function handleFacebookShare() {
    if (isLocal) {
      setShowUpgradeToPro(true);
    } else {
      const encodedLink = encodeURIComponent(shareableLink);
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
        "_blank"
      );
    }
  }

  function handleInstagramShare() {
    if (isLocal) {
      setShowUpgradeToPro(true);
    } else {
      // Instagram does not support direct URL sharing like Facebook.
      window.open("https://www.instagram.com/", "_blank");
    }
  }

  const qrPopup =
    showQrCode &&
    createPortal(
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex justify-center items-center z-50">
        <div className="relative bg-white px-8 py-8 pt-12 mx-2 rounded-lg shadow-lg">
          <button
            onClick={() => setShowQrCode(false)}
            className="absolute -top-1 -right-0 text-4xl cursor-pointer hover:scale-125 transition-all rounded-full w-8 h-8 flex items-center justify-center m-2 text-gray-800"
            aria-label="Close"
          >
            ×
          </button>
          <div className=" absolute top-3 left-25 " style={{ color: theme }}>
            Scan to share
          </div>
          {qrCode}
        </div>
      </div>,
      document.body
    );

  return (
    <>
      {showUpgradeToPro && (
        <UpgradeToProModal
          isOpen={showUpgradeToPro}
          onClose={() => setShowUpgradeToPro(false)}
        />
      )}

      {qrPopup}
      <div className="relative w-full bg-white px-4">
        {/* Heading */}
        <h2 className="text-center  text-lg font-semibold mb-5">
          Share this card
        </h2>
        {/* QR Code box */}
        <div
          style={{ "--safetheme": lightenColor(themeColor, 0.9) }}
          className="flex flex-col items-center border border-[#E1E8ED] rounded-[15px] p-4 mb-3  hover-safetheme"
        >
          {/* "Share QR Code" link */}
          <button
            className={`mt-2 font-medium text-lg cursor-pointer mb-2`}
            onClick={() => setShowQrCode(true)}
          >
            Share QR Code
          </button>
        </div>

        {/* Link + Copy box */}
        <div
          style={{ "--safetheme": lightenColor(themeColor, 0.9) }}
          className="flex items-center justify-between border border-[#E1E8ED] rounded-[15px] px-4 py-2 mb-3 hover:bg-[var(--safetheme)]"
        >
          <svg
            className="mr-1"
            aria-hidden="true"
            viewBox="0 0 448 512"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              boxSizing: "border-box",
              display: "block",
              height: "18px",
              position: "relative",
              width: "2em",
            }}
          >
            <path
              fill={themeColor}
              d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"
              style={{ transition: "none", boxSizing: "border-box" }}
            ></path>
          </svg>
          <span className="truncate mr-2 px-2 py-1">{shareableLink}</span>
          <button
            onClick={handleCopy}
            className="text-sm font-medium cursor-pointer"
          >
            Copy
          </button>
        </div>

        <div className="border border-[#E1E8ED] rounded-[15px] overflow-hidden mb-0 px-2">
          {/* Share via Email */}
          <div
            onClick={handleEmailShare}
            style={{ "--safetheme": lightenColor(themeColor, 0.9) }}
            className={`flex items-center justify-between px-4 py-1 hover:bg-[var(--safetheme)] rounded-lg cursor-pointer mt-2`}
          >
            <div className="flex items-center gap-3">
              {/* Circle icon (blue) */}
              <div
                className="w-9 h-9 p-2 text-white rounded-full flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                {/* Envelope icon (white) */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 512 512"
                  style={{ height: "18px", width: "18px" }}
                >
                  <path
                    fill="currentColor"
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
                </svg>
              </div>
              <span>Share via Email</span>
            </div>
            <div
              style={{ color: themeColor }}
              className="font-semibold text-base"
            >
              &gt;
            </div>
          </div>

          {/* Share via text */}
          <div
            onClick={handleTextShare}
            style={{ "--safetheme": lightenColor(themeColor, 0.9) }}
            className={`flex items-center justify-between px-4 py-1 hover:bg-[var(--safetheme)] rounded-lg cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 p-2 text-white rounded-full flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                {/* "SMS" icon or phone icon (white) */}
                {/* Updated SMS icon for Share via text */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-text-icon lucide-message-square-text"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/></svg>
              </div>
              <span>Share via Text</span>
            </div>
            <div
              style={{ color: themeColor }}
              className="font-semibold text-base"
            >
              &gt;
            </div>
          </div>

          {/* Share via Facebook */}
          <div
            onClick={handleFacebookShare}
            style={{ "--safetheme": lightenColor(themeColor, 0.9) }}
            className="flex items-center justify-between px-4 py-1 hover:bg-[var(--safetheme)] rounded-lg cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 p-2 text-white rounded-full flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                {/* Facebook icon */}
                <svg
                  viewBox="0 0 320 512"
                  style={{ height: "16px", width: "16px" }}
                >
                  <path
                    fill="currentColor"
                    d="M279.14 288l14.22-92.66h-88.91V117.34c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.53 0 225.36 0c-73.22 0-121.09 44.38-121.09 124.72v70.62H22.89V288h81.38v224h100.2V288z"
                  />
                </svg>
              </div>
              <span>Share via Facebook</span>
            </div>
            <div
              style={{ color: themeColor }}
              className="font-semibold text-base"
            >
              &gt;
            </div>
          </div>

          {/* Share via Instagram */}
          <div
            onClick={handleInstagramShare}
            style={{ "--safetheme": lightenColor(themeColor, 0.9) }}
            className="flex items-center justify-between px-4 py-1 hover:bg-[var(--safetheme)] rounded-lg cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 p-2 text-white rounded-full flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                {/* Instagram icon */}
                <svg
                  viewBox="0 0 448 512"
                  style={{ height: "16px", width: "16px" }}
                >
                  <path
                    fill="currentColor"
                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9S287.7 141 224.1 141zm0 189.6c-41.3 0-74.7-33.4-74.7-74.7s33.4-74.7 74.7-74.7 74.7 33.4 74.7 74.7-33.4 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.9-26.9 26.9-14.9 0-26.9-12-26.9-26.9s12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.7-9.9-67.3-36.2-93.5s-57.8-34.5-93.5-36.2C293.6 32 258.6 32 224 32s-69.6 0-93.9 1.7c-35.7 1.7-67.3 9.9-93.5 36.2S32 112.3 30.3 148C28.6 172.4 28.6 207.4 28.6 242s0 69.6 1.7 93.9c1.7 35.7 9.9 67.3 36.2 93.5s57.8 34.5 93.5 36.2C154.4 480 189.4 480 224 480s69.6 0 93.9-1.7c35.7-1.7 67.3-9.9 93.5-36.2 26.3-26.2 34.5-57.8 36.2-93.5 1.7-24.4 1.7-59.4 1.7-93.9s0-69.6-1.7-93.9zM398.8 388c-7.8 19.6-22.9 34.7-42.5 42.5-29.4 11.7-99.1 9-132.3 9s-102.9 2.6-132.3-9c-19.6-7.8-34.7-22.9-42.5-42.5-11.7-29.4-9-99.1-9-132.3s-2.6-102.9 9-132.3c7.8-19.6 22.9-34.7 42.5-42.5C121.1 46.6 190.8 49.3 224 49.3s102.9-2.6 132.3 9c19.6 7.8 34.7 22.9 42.5 42.5 11.7 29.4 9 99.1 9 132.3s2.7 102.9-9 132.3z"
                  />
                </svg>
              </div>
              <span>Share via Instagram</span>
            </div>
            <div
              style={{ color: themeColor }}
              className="font-semibold text-base"
            >
              &gt;
            </div>
          </div>

          {/* Share via LinkedIn */}
          <div
            onClick={handleLinkedInShare}
            style={{ "--safetheme": lightenColor(themeColor, 0.9) }}
            className={`flex items-center justify-between px-4 py-1 hover:bg-[var(--safetheme)] rounded-lg cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 p-2 text-white rounded-full flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                {/* LinkedIn icon (white) */}
                <svg
                  viewBox="0 0 448 512"
                  style={{ height: "16px", width: "16px" }}
                >
                  <path
                    fill="currentColor"
                    d="M100.28 448H7.4V149.9h92.88zM53.79 
                    108.1A53.79 53.79 0 1 1 53.8 
                    0a53.79 53.79 0 1 1 0 108.1zM447.9 
                    448h-92.68V302.4c0-34.7-.7-79.3-48.3-79.3-48.3 
                    0-55.7 37.8-55.7 76.7V448h-92.78V149.9h89.13v40.8h1.3c12.4-23.5 
                    42.5-48.3 87.4-48.3 93.5 0 110.6 
                    61.5 110.6 141.3V448z"
                  />
                </svg>
              </div>
              <span>Share via LinkedIn</span>
            </div>
            <div
              style={{ color: themeColor }}
              className="font-semibold text-base"
            >
              &gt;
            </div>
          </div>

          {/* Share via Twitter/X */}
          <div
            onClick={handleTwitterShare}
            style={{ "--safetheme": lightenColor(themeColor, 0.9) }}
            className={`flex items-center justify-between px-4 py-1 hover:bg-[var(--safetheme)] rounded-lg cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 p-2 text-white rounded-full flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                {/* Twitter icon (white) */}
                <svg
                  viewBox="0 0 512 512"
                  style={{ height: "16px", width: "16px" }}
                >
                  <path
                    fill="currentColor"
                    d="M459.4 151.7c.3 
                    4.5.3 9.1.3 13.6 0 138.7-105.6 
                    298.7-298.7 298.7-59.5 0-114.7-17.2-161.1-47 
                    8.4.9 16.8 1.3 25.2 1.3 
                    49.3 0 94.8-16.8 
                    130.7-45-46.1-.9-84.8-31.2-98.1-72.8 
                    6.5.9 12.9 1.6 19.7 
                    1.6 9.4 0 18.7-1.3 
                    27.5-3.6-48.1-9.7-84.3-52.1-84.3-103v-1.3 
                    c14.3 7.9 30.7 12.6 
                    48.1 13.2-28.4-19-46.8-51.2-46.8-87.7 
                    0-19.4 5.2-37.3 
                    14.3-52.8 51.9 63.7 129.7 105.6 
                    217.3 110  -1.6-7.9-2.6-15.8-2.6-24 
                    0-57.4 46.8-104.1 
                    104.1-104.1 30 0 57.2 12.6 
                    76.3 33.1 23.7-4.5 46.1-13.2 
                    66.2-25-7.9 24.4-24.4 44.8-46.1 
                    57.6 21.1-2.3 41.6-8.1 60.5-16.2 
                    -14 20.8-31.4 39.1-51.6 53.6z"
                  />
                </svg>
              </div>
              <span>Share via Twitter/X</span>
            </div>
            <div
              style={{ color: themeColor }}
              className="font-semibold text-base"
            >
              &gt;
            </div>
          </div>

          {/* Share via WhatsApp */}
          <div
            onClick={handleWhatsAppShare}
            style={{ "--safetheme": lightenColor(themeColor, 0.9) }}
            className={`flex items-center justify-between px-4 py-1 hover:bg-[var(--safetheme)] rounded-lg cursor-pointer mb-2`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 p-2 text-white rounded-full flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                {/* WhatsApp icon (white) */}
                <svg
                  viewBox="0 0 448 512"
                  style={{ height: "16px", width: "16px" }}
                >
                  <path
                    fill="currentColor"
                    d="M380.9 97.1C339 55.1 283.2 
                    32 223.9 32c-122.4 0-222 
                    99.6-222 222 0 39.1 
                    10.2 77.3 29.6 111L0 
                    480l117.7-30.9c32.4 17.7 
                    68.9 27 106.1 27h.1c122.3 
                    0 224.1-99.6 224.1-222 
                    0-59.3-25.2-115-67.1-157zm-157 
                    341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4 
                    -69.8 18.3L72 
                    359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 
                    0-101.7 82.8-184.5 184.6-184.5 
                    49.3 0 95.6 19.2 130.4 54.1 
                    34.8 34.9 56.2 81.2 56.1 
                    130.5 0 101.8-84.9 
                    184.6-186.6 184.6zm101.2-138.2
                    c-5.5-2.8-32.8-16.2-37.9-18
                    -5.1-1.9-8.8-2.8-12.5 
                    2.8-3.7 5.6-14.3 
                    18-17.6 21.8-3.2 
                    3.7-6.5 4.2-12 
                    1.4-32.6-16.3-54-29.1
                    -75.5-66-5.7-9.8
                    5.7-9.1 16.3-30.3 1.8-3.7
                    .9-6.9-.5-9.7-1.4-2.8-12.5-30.1
                    -17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5
                    -3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 
                    1.4-14.8 6.9-5.1 5.6-19.4 19
                    -19.4 46.3 0 27.3 19.9 53.7
                    22.6 57.4 2.8 3.7 39.1 
                    59.7 94.8 83.8 35.2 
                    15.2 49 16.5 
                    66.6 13.9 10.7-1.6 
                    32.8-13.4 
                    37.4-26.4 4.6-13 
                    4.6-24.1 3.2-26.4
                    -1.3-2.5-5-3.9
                    -10.5-6.6z"
                  />
                </svg>
              </div>
              <span>Share via WhatsApp</span>
            </div>
            <div
              style={{ color: themeColor }}
              className="font-semibold text-base"
            >
              &gt;
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareModal;
