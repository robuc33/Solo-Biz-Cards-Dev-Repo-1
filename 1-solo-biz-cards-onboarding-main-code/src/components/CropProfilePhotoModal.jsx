import { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { X } from "lucide-react";

export default function CropProfilePhotoModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
}) {
  // Set a default crop as percentage; this will be overridden on image load.
  const [crop, setCrop] = useState({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const imageRef = useRef(null);

  const handleImageLoad = (img) => {
    // Get the rendered dimensions of the image
    const { width: renderedWidth, height: renderedHeight } = img.getBoundingClientRect();
    if (!renderedWidth || !renderedHeight) return;
  
    // If the image is small (mobile), use fixed crop values
    const isMobile = renderedWidth < 450;
    const desiredCrop = isMobile
      ? { width: 240, height: 210 }
      : {
          width: Math.min(450, renderedWidth),
          height: Math.min(390, renderedHeight),
        };
  
    const cropPercent = {
      unit: "%",
      width: (desiredCrop.width / renderedWidth) * 100,
      height: (desiredCrop.height / renderedHeight) * 100,
      x: (((renderedWidth - desiredCrop.width) / 2) / renderedWidth) * 100,
      y: (((renderedHeight - desiredCrop.height) / 2) / renderedHeight) * 100,
    };
  
    setCrop(cropPercent);
  };
  

  const getCroppedImg = () => {
    if (!imageRef.current || !crop.width || !crop.height) return null;
  
    const image = imageRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
  
    let pixelCrop = {};
  
    if (!crop.unit || crop.unit === "%") {
      pixelCrop.x = (crop.x / 100) * image.width * scaleX;
      pixelCrop.y = (crop.y / 100) * image.height * scaleY;
      pixelCrop.width = (crop.width / 100) * image.width * scaleX;
      pixelCrop.height = (crop.height / 100) * image.height * scaleY;
    } else {
      pixelCrop.x = crop.x * scaleX;
      pixelCrop.y = crop.y * scaleY;
      pixelCrop.width = crop.width * scaleX;
      pixelCrop.height = crop.height * scaleY;
    }
  
    // Create canvas with fixed dimensions 450 x 450
    const canvas = document.createElement("canvas");
    canvas.width = 450;
    canvas.height = 390;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
  
    // Draw the cropped image into the fixed-size canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    return canvas.toDataURL("image/jpeg", 0.9);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-calc(100svh-100px)">
        {/* Header with Close Icon */}
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-xl font-semibold">Crop Profile Photo</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-150"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="relative max-h-[70vh] overflow-y-auto overflow-x-hidden">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                // Set the aspect ratio to 450/450 to match your desired preview
                aspect={450 / 390}
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop preview"
                  className="max-w-full h-auto"
                  onLoad={(e) => handleImageLoad(e.currentTarget)}
                />
              </ReactCrop>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-5 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const croppedImage = getCroppedImg();
                if (croppedImage) onCropComplete(croppedImage);
                onClose();
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-150"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
