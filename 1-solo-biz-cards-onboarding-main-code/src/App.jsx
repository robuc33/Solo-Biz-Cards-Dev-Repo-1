// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BusinessCardCreator from "./components/BusinessCardCreator";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import "./App.css";
import { CardDataProvider } from "./contexts/CardDataContext";
import Dashboard from "./pages/Dashboard";
import { ToastProvider } from "./contexts/ToastContext";
import { useAuth } from "./contexts/AuthContext";
import Public from "./pages/Public";
import { DownloadContext } from "./contexts/DownloadContext";
import ViewCard from "./pages/ViewCard";
import ProfileTab from "./components/ProfileTab";
import { useState } from "react";
import ScrollToTop from "./components/ScrollToTop";
import CircularIndeterminate from "./components/common/Loader";
import PassiveIncome from "./pages/PassiveIncome";
import HowItWorks from "./pages/HowItWorks";
import HowToUse from "./pages/HowToUse";
import Troubleshooting from "./pages/Troubleshooting";

function HomeRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading)
    return <CircularIndeterminate message="Setting things up for you..." />;
  return isAuthenticated ? <Dashboard /> : <BusinessCardCreator />;
}
function App() {
  const [downloadMode, setDownloadMode] = useState(false);
  return (
    <DownloadContext.Provider value={{ downloadMode, setDownloadMode }}>
      <ToastProvider>
        <CardDataProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/new-card" element={<BusinessCardCreator />}></Route>
              <Route
                path="/edit-card"
                element={<BusinessCardCreator />}
              ></Route>
              <Route path="/view/*" element={<ViewCard />} />
              <Route path="/profile" element={<ProfileTab />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/members-directory" element={<Public />} />
              <Route path="/passive-income" element={<PassiveIncome />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/how-to-use" element={<HowToUse />} />
              <Route path="/troubleshooting" element={<Troubleshooting />} />
            </Routes>
          </BrowserRouter>
        </CardDataProvider>
      </ToastProvider>
    </DownloadContext.Provider>
  );
}

export default App;
