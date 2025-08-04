import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast.jsx";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  // Function to show a toast
  const showToast = useCallback(
    (message, type, link, btnText, duration, position) => {
      setToast({ message, type, link, btnText, duration, position });
    },
    []
  );

  // Function to hide the toast
  const hideToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {/* Render the Toast component if there is a toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          link={toast.link}
          btnText={toast.btnText}
          duration={toast.duration}
          position={toast.position}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};

// Custom hook to use the ToastContext
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};