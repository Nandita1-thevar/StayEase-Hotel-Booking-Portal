
export interface Room {
  id: number;
  roomType: string;
  pricePerNight: number;
  totalCapacity: number;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  amenities: string;
  rooms: Room[];
}
