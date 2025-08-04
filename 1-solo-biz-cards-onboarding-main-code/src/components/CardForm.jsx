// src/components/CardForm.jsx
import { useContext, useState } from "react";
import { Paper, Tabs, Tab, Box } from "@mui/material";

import ProfileTabContent from "./ProfileTabContent";
import BusinessTabContent from "./BusinessTabContent";
import SocialTabContent from "./SocialTabContent";
import AboutTabContent from "./AboutTabContent";
import CtaTabContent from "./CtaTabContent";
import { RotateCcw } from "lucide-react";
import { CardDataContext } from "../contexts/CardContext";
import { initialCardData } from "../contexts/CardDataContext";

// A helper component for tab panels
function TabPanel({ children, value, index, ...other }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`main-tabpanel-${index}`}
      aria-labelledby={`main-tab-${index}`}
      className="mt-4"
      {...other}
    >
      {value === index && children}
    </Box>
  );
}

export default function CardForm({ onSignInClick, onSignUpClick }) {
  const { cardData, setCardData } = useContext(CardDataContext);
  const [tabValue, setTabValue] = useState(0);
  const tabs = ["Profile", "Business", "Social", "About", "CTA"];

  const isDifferent =
    JSON.stringify(cardData) !== JSON.stringify(initialCardData);
  // Called when a "tab" is clicked
  const handleTabClick = (index) => {
    setTabValue(index);
  };
  return (
    <Paper
      elevation={0}
      square
      className="p-6 bg-white rounded-lg max-w-[39rem] w-full mx-auto"
      sx={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.20)" }}
    >
      <div className="flex items-center justify-between ">
        <h1 className="text-xl sm:text-2xl font-bold leading-8 mb-4">
          Create Your Business Card
        </h1>
        {isDifferent && (
          <div
            onClick={() => setCardData(initialCardData)}
            className="flex items-center gap-1 font-semibold cursor-pointer text-gray-800 bg-gray-200 hover:bg-gray-300 px-2 py-2 rounded-md"
          >
            <span className="text-xs">Clear</span>
            <RotateCcw className="w-3 h-3" />
          </div>
        )}
      </div>
      <p className="text-xs sm:text-sm text-[rgb(75,85,99)] mb-2">
        Free digital business card download and use
      </p>

      {/* Custom tabs */}
      <div className="flex flex-wrap sm:flex-nowrap w-full gap-1">
        {tabs.map((label, index) => (
          <div
            key={label}
            id={`main-tab-${index}`}
            onClick={() => handleTabClick(index)}
            className={`
              cursor-pointer text-center rounded-lg transition-colors font-medium mb-1 
              px-3 sm:px-4 py-2 capitalize text-sm sm:text-base
              ${
                index < 4
                  ? "w-[calc(50%-4px)] sm:flex-1"
                  : "w-[calc(100%-6px)] sm:flex-1"
              }
              ${
                tabValue === index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 font-normal hover:bg-gray-200"
              }
            `}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <ProfileTabContent
          onSignInClick={onSignInClick}
          onSignUpClick={onSignUpClick}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <BusinessTabContent />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <SocialTabContent />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <AboutTabContent />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <CtaTabContent />
      </TabPanel>
    </Paper>
  );
}
