// src/components/CardPreview.jsx
import React, { useState, useContext } from "react";
import { CardDataContext } from "../contexts/CardContext";

import FancyCardLayout from "./layouts/FancyCardLayout";

export default function CardPreview() {
  const { cardData } = useContext(CardDataContext);
  

  return (
    <div className="sticky top-6" id="card-preview">
  
        <FancyCardLayout cardData={cardData} />
     
    </div>
  );
}
