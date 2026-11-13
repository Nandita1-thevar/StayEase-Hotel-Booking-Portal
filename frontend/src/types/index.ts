export type BookingStatus = 'CONFIRMED' | 'CANCELLED'

export interface Hotel {
  id: number
  name: string
  location: string
  description: string
  amenities: string[]
}

export interface Booking {
  bookingReference: string
  customerName: string
  customerEmail?: string
  checkIn: string
  checkOut: string
  totalAmount: number
  status: BookingStatus
}
