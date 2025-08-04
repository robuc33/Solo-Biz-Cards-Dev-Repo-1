// src/components/BusinessCardCreator.jsx
import { useState, useContext } from "react";
import { Box, Container } from "@mui/material";
import { CardDataContext } from "../contexts/CardContext";
import Header from "./Header";
import CardForm from "./CardForm";
import CardPreview from "./CardPreview";
import Footer from "./Footer";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import useTitle from "../hooks/useTitle";

 export function lightenColor(hex, factor) {
  hex = hex.replace(/^#/, "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const newR = Math.round(r + (255 - r) * factor);
  const newG = Math.round(g + (255 - g) * factor);
  const newB = Math.round(b + (255 - b) * factor);
  return (
    "#" +
    [newR, newG, newB]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

export default function BusinessCardCreator() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const { cardData } = useContext(CardDataContext);
  const { theme } = cardData;
  useTitle("Business Card Maker | Create Your Business Card | BizCardNow")

  return (
    <Box
      className="min-h-screen flex flex-col w-full"
      style={{ backgroundColor: lightenColor(theme, 0.9) }}
    >
      <Header onShowSignIn={() => setIsSignInOpen(true)} />

      <main className="flex-1">
        <div className="min-h-screen py-6 md:px-4">
          <Container maxWidth="xl" className="mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-[20px]">
              {/* Removed "mx-auto" here */}
              <div className="w-full  max-w-[650px] flex justify-center">
                <CardForm
                  onSignUpClick={() => setIsSignUpOpen(true)}
                  onSignInClick={() => setIsSignInOpen(true)}
                />
              </div>
              {/* Removed "mx-auto" here */}
              <div className="w-full  max-w-[630px] lg:sticky lg:top-6">
                <CardPreview />
              </div>
            </div>
          </Container>
        </div>
      </main>

      <Footer />

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onShowSignUp={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onShowSignIn={() => {
          setIsSignUpOpen(false);
          setIsSignInOpen(true);
        }}
      />
    </Box>
  );
}
