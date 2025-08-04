import React, { useState } from "react";

const ShareModal = ({ isOpen, onClose, cardId, cardName }) => {
  const [copied, setCopied] = useState(false);

  // Create the shareable link using the view endpoint
  const shareableLink = `https://bizcardnow.com/view?cardId=${cardId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const shareToSocial = (platform) => {
    let url;
    const encodedUrl = encodeURIComponent(shareableLink);
    const text = encodeURIComponent(
      `Check out this business card: ${cardName || "Business Card"}`
    );

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${text}%20${encodedUrl}`;
        break;
    }

    window.open(url, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">
          Share {cardName || "Business Card"}
        </h3>

        <div className="mb-4">
          <p className="text-sm mb-2">Share this link:</p>
          <div className="flex">
            <input
              type="text"
              value={shareableLink}
              readOnly
              className="flex-grow p-2 border rounded-l-md text-sm"
            />
            <button
              onClick={handleCopy}
              className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="flex space-x-4 justify-center mb-4">
          <button
            onClick={() => shareToSocial("facebook")}
            className="p-2 bg-blue-600 text-white rounded-full"
          >
            FB
          </button>

          <button
            onClick={() => shareToSocial("twitter")}
            className="p-2 bg-blue-400 text-white rounded-full"
          >
            X
          </button>

          <button
            onClick={() => shareToSocial("linkedin")}
            className="p-2 bg-blue-700 text-white rounded-full"
          >
            LI
          </button>

          <button
            onClick={() => shareToSocial("whatsapp")}
            className="p-2 bg-green-500 text-white rounded-full"
          >
            WA
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-center"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
