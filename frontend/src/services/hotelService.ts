
import type { Hotel } from "../types/hotel";

const API_URL = "http://localhost:8080/api/hotels";

export const getHotels = async (): Promise<Hotel[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch hotels");
  }

  return response.json();
};

export const searchHotels = async (
  location: string
): Promise<Hotel[]> => {
  const response = await fetch(
    `${API_URL}?location=${encodeURIComponent(location)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search hotels");
  }

  return response.json();
};

export const getHotelById = async (
  id: number
): Promise<Hotel> => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Hotel not found");
  }

  return response.json();
};
