// src/components/UpgradeToProModal.jsx
import React from "react";
import { Save } from "lucide-react";
import { createPortal } from "react-dom";

const UpgradeToProModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    createPortal(
    <div
      className="fixed inset-0 h-screen flex items-center justify-center bg-[rgba(0,0,0,0.3)] backdrop-blur-sm overflow-hidden z-9999"
      onClick={onClose}
    >
      <div
        className="bg-white w-11/12 sm:w-full max-w-md mx-auto p-4 sm:p-6 rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <Save className="w-8 h-8 text-yellow-500" />
          <h2 className="text-xl sm:text-2xl font-bold">Sync to cloud</h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            You need to sync card to cloud to share.
          </p>

          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm sm:text-base"
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body)
  );
};

export default UpgradeToProModal;
