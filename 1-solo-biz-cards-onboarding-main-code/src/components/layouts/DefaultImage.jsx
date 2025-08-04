// src/components/layouts/DefaultImage.jsx
import templateCard from "./image/template-card-2.png";

const DefaultImage = () => {
  return (
    <img
      src={templateCard}
      alt="template-card"
      className="w-full h-auto md:h-250 object-cover block"
    />
  );
};

export default DefaultImage;
