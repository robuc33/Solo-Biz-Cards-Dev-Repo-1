//src/components/tabs/BusinessTabContent.jsx
import { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import ManualEntryForm from "./ManualEntryForm";
import UploadCardForm from "./UploadCardForm";
import ActionButtons from "./common/ActionButtons";

export default function BusinessTabContent() {
  const [subTab, setSubTab] = useState(0);

  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
  };

  // This callback will be called by the UploadCardForm after applying data
  const handleApplyData = () => {
    setSubTab(0); // Switch back to "Manual Entry"
  };

  return (
    <div>
      <Tabs
        value={subTab}
        onChange={handleSubTabChange}
        variant="standard"
        textColor="primary"
        indicatorColor="primary"
        sx={{
          minHeight: "auto",
          "& .MuiTab-root": {
            fontSize: "0.875rem",
            textTransform: "none",
            minWidth: "0",
            paddingLeft: "0.75rem",
            paddingRight: "0.75rem",
          },
        }}
      >
        <Tab label="Manual Entry" />
        <Tab label="Upload Card" />
      </Tabs>

      <div className="mt-4">
        {subTab === 0 ? (
          <ManualEntryForm />
        ) : (
          // Pass handleApplyData to UploadCardForm
          <UploadCardForm onApply={handleApplyData} />
        )}
      </div>

      <ActionButtons />
    </div>
  );
}
