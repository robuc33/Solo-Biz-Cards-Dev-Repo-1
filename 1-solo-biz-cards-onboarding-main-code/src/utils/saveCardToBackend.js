// src/utils/saveCardToBackend.js
import { api } from "./api";

// Helper: Convert a data URL to a File object.
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) return null;
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function saveCardToBackend(cardData) {
  // Create a FormData instance.
  const formData = new FormData();

  // Append top-level fields.
  formData.append("card", cardData.profile.cardName);
  formData.append("businessCategory", cardData.profile.businessCategory || "");
  formData.append("isPublic", cardData.visibility === "public");
  formData.append("theme", cardData.theme);

  // Build the nested JSON payload exactly as expected by the backend.
  const dataPayload = {
    name: {
      first: cardData.business.first,
      last: cardData.business.last,
    },
    bio: {
      title: "", // (Optional: add title if you have one)
      about: cardData.about.aboutMe,
    },
    accreditations: cardData.business.accreditations
      ? cardData.business.accreditations.split(",").map((s) => s.trim())
      : [],
    company: {
      name: cardData.business.name,
      slogan: cardData.business.slogan,
    },
    jobTitle: cardData.business.jobTitle,
    department: cardData.business.department,
    phone: cardData.business.phone,
    email: cardData.business.email,
    website: cardData.business.website,
    address: {
      // Map 'street' to 'location'
      location: cardData.business.address.street,
      city: cardData.business.address.city,
      state: cardData.business.address.state,
      country: cardData.business.address.country,
      zip: cardData.business.address.zip,
    },
    social: {
      linkedin: cardData.social.linkedin,
      twitter: cardData.social.twitter,
      facebook: cardData.social.facebook,
      youtube: cardData.social.youtube,
      instagram: cardData.social.instagram,
      tiktok: cardData.social.tiktok,
      calendly: "",
      cta: {
        link: cardData.cta.link,
        label: cardData.cta.label,
      },
      ads: {}, // 'img' will be set by the file upload middleware.
    },
    // Extra property so that the controller sets social.ads.adsType.
    ads: {
      adsType: cardData.cta.adsType,
    },
  };

  // Append the nested JSON as a string.
  formData.append("data", JSON.stringify(dataPayload));

  // Convert images from data URLs to File objects and append them.
  if (cardData.profile.profilePic) {
    const profileFile = dataURLtoFile(
      cardData.profile.profilePic,
      "profilePic.png"
    );
    if (profileFile) {
      formData.append("profilePic", profileFile);
    }
  }
  if (cardData.cta.adsImg) {
    const adsFile = dataURLtoFile(cardData.cta.adsImg, "adsImg.png");
    if (adsFile) {
      formData.append("adsImg", adsFile);
    }
  }

  return formData;
}
