import { api } from "./api";

export const fetchPublicCards = async () => {
  try {
    const response = await api.get("/card/public-cards");
    return response.data;
  } catch (error) {
    console.error("Error fetching public cards:", error);
    throw error;
  }
};
