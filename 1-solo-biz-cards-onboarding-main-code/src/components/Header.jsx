import { useState, useEffect, useContext } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Menu, MenuItem, Avatar, Typography, Divider } from "@mui/material";
import { LogOut, User, Home, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { CardDataContext } from "../contexts/CardContext.js";

const clearedCardData = {
  visibility: "private",
  theme: "#4299E1",
  profile: {
    cardName: "",
    profilePic: null,
  },
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
  about: {
    aboutMe: "",
  },
  cta: {
    type: "booking",
    link: "",
    label: "",
    adsType: "product",
    adsImg: null,
  },
};
export default function Header({ onShowSignIn }) {
  const { showToast } = useToast();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { setCardData } = useContext(CardDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    setAnchorEl(null);
  }, [user]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleMenuClose();
    const { success, error } = await logout();
    if (success) {
      showToast("Logged out successfully!", "success");
      setCardData(clearedCardData);
    } else {
      showToast(error, "error");
    }
  };

  // Render when user is signed in
  if (user) {
    return (
      <div className="fixed top-4 right-4 z-50">
        {/* Closed Header Button styled as provided */}
        <button
          onClick={handleMenuOpen}
          aria-controls="user-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : "false"}
          aria-label="User menu"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            transitionProperty:
              "color, background-color, border-color, text-decoration-color, fill, stroke",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            transitionDuration: "0.15s",
            backdropFilter: "blur(4px)",
            boxShadow:
              "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
            padding: "8px 12px",
            borderColor: "rgba(229,231,235,0.5)",
            borderWidth: "0.8px",
            borderRadius: "8px",
            gap: "8px",
            alignItems: "center",
            display: "flex",
            cursor: "pointer",
            appearance: "button",
            backgroundImage: "none",
            textTransform: "none",
            fontFamily:
              "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
            fontSize: "16px",
            fontWeight: "400",
            lineHeight: "24px",
            letterSpacing: "normal",
            color: "rgb(0, 0, 0)",
            margin: "0px",
            boxSizing: "border-box",
            borderStyle: "solid",
          }}
        >
          <div
            style={{
              backgroundColor: "rgb(37, 99, 235)",
              borderRadius: "9999px",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
              width: "1.25rem",
              height: "20px",
              display: "flex",
              boxSizing: "border-box",
              borderWidth: "0px",
              borderStyle: "solid",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{
                color: "rgb(255, 255, 255)",
                width: "0.75rem",
                height: "12px",
                display: "block",
                verticalAlign: "middle",
                boxSizing: "border-box",
                borderWidth: "0px",
                borderStyle: "solid",
              }}
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span className="hidden sm:block"
            style={{
              
              color: "rgb(55, 65, 81)",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "20px",
              boxSizing: "border-box",
            }}
          >
            {user.name}
          </span>
        </button>

        {/* The Menu with custom Paper styling */}
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            style: {
              backdropFilter: "blur(4px)",
              boxShadow:
                "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px",
              paddingTop: "4px",
              paddingBottom: "4px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(229, 231, 235, 0.5)",
              borderWidth: "0.8px",
              borderRadius: "8px",
              width: "14rem",
              marginTop: "8px",
              right: "0px",
              position: "absolute",
              boxSizing: "border-box",
              borderStyle: "solid",
            },
          }}
        >
          <div
            style={{
              padding: "8px 16px",
              borderBottom: "0.8px solid rgba(243,244,246,0.5)",
              boxSizing: "border-box",
            }}
          >
            <Typography
              style={{
                color: "rgb(17, 24, 39)",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.name}
            </Typography>
            <Typography
              style={{
                color: "rgb(107, 114, 128)",
                fontSize: "12px",
                lineHeight: "16px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginTop: "2px",
              }}
            >
              {user.email}
            </Typography>
          </div>
          <MenuItem
            onClick={() => navigate("/profile")}
            style={{
              transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              color: "rgb(55,65,81)",
              fontSize: "14px",
              lineHeight: "20px",
              padding: "8px 16px",
              gap: "8px",
              display: "flex",
              alignItems: "center",
              width: "100%",
              cursor: "pointer",
              backgroundColor: "transparent",
              border: "none",
              boxSizing: "border-box",
            }}
          >
            <User
              size={16}
              style={{
                width: "1rem",
                height: "16px",
                display: "block",
                verticalAlign: "middle",
              }}
            />
            Profile
          </MenuItem>
          <MenuItem
            component={Link}
            to="/new-card"
            onClick={handleMenuClose}
            style={{
              transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              color: "rgb(55,65,81)",
              fontSize: "14px",
              lineHeight: "20px",
              padding: "8px 16px",
              gap: "8px",
              display: "flex",
              alignItems: "center",
              width: "100%",
              cursor: "pointer",
              backgroundColor: "transparent",
              border: "none",
              boxSizing: "border-box",
            }}
          >
            <Home
              size={16}
              style={{
                width: "1rem",
                height: "16px",
                display: "block",
                verticalAlign: "middle",
              }}
            />
            Home Page
          </MenuItem>
          <div
            style={{
              borderTop: "0.8px solid rgb(243,244,246)",
              marginTop: "4px",
              marginBottom: "4px",
              boxSizing: "border-box",
            }}
          />
          <MenuItem
            onClick={handleLogout}
            style={{
              transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              color: "rgb(220,38,38)",
              fontSize: "14px",
              lineHeight: "20px",
              padding: "8px 16px",
              gap: "8px",
              display: "flex",
              alignItems: "center",
              width: "100%",
              cursor: "pointer",
              backgroundColor: "transparent",
              border: "none",
              boxSizing: "border-box",
            }}
          >
            <LogOut
              size={16}
              style={{
                width: "1rem",
                height: "16px",
                display: "block",
                verticalAlign: "middle",
              }}
            />
            Sign Out
          </MenuItem>
        </Menu>
      </div>
    );
  } else {
    // Render when no user is logged in
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={onShowSignIn}
          onClose={() => setIsSignInOpen(false)}
          onShowSignUp={() => {
            setIsSignInOpen(false);
            setIsSignUpOpen(true);
          }}
          aria-label="Sign in"
          className="p-2 text-blue-700 bg-blue-500/30 rounded-lg cursor-pointer transition-all duration-150 backdrop-blur-sm hover:bg-blue-500/40"
        >
          <LogIn className="w-4 h-4" />
        </button>
      </div>
    );
  }
}
