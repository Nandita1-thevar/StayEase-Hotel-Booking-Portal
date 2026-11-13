CREATE DATABASE IF NOT EXISTS hotel_booking;
USE hotel_booking;

-- TODO: Add hotels, rooms, and bookings tables.
-- Suggested constraints:
-- hotels: PRIMARY KEY (id)
-- rooms: FOREIGN KEY (hotel_id) REFERENCES hotels(id)
-- bookings: FOREIGN KEY (room_id) REFERENCES rooms(id)
-- bookings: UNIQUE (booking_reference)
