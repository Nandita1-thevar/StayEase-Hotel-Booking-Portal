
package com.example.hotelbooking.service;

import com.example.hotelbooking.dto.BookingRequest;
import com.example.hotelbooking.entity.Booking;
import com.example.hotelbooking.entity.Room;
import com.example.hotelbooking.repository.BookingRepository;
import com.example.hotelbooking.repository.RoomRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import com.example.hotelbooking.dto.BookingVerificationResponse;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public BookingService(
            BookingRepository bookingRepository,
            RoomRepository roomRepository) {

        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    // Create a new booking
    @Transactional
    public Booking createBooking(BookingRequest request) {

        // Validate booking dates
        LocalDate checkIn = request.getCheckIn();
        LocalDate checkOut = request.getCheckOut();

        if (checkIn == null || checkOut == null ||
                !checkOut.isAfter(checkIn)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Check-out must be after check-in"
            );
        }

        // Prevent past check-in dates
        if (checkIn.isBefore(LocalDate.now())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Check-in cannot be in the past"
            );
        }

        // Lock room row to prevent simultaneous overbooking
        Room room = roomRepository.findByIdForUpdate(
                request.getRoomId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Room not found"
        ));

        // Validate room inventory
        if (room.getTotalRooms() == null ||
                room.getTotalRooms() <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Room category is currently unavailable"
            );
        }

        // Validate number of guests on the backend
        Integer numberOfGuests = request.getNumberOfGuests();

        if (numberOfGuests == null || numberOfGuests < 1) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "At least one guest is required"
            );
        }

        // Check maximum room capacity
        if (numberOfGuests > room.getTotalCapacity()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This room allows a maximum of "
                            + room.getTotalCapacity() + " guests"
            );
        }

        // Count overlapping confirmed bookings
        long overlappingBookings =
                bookingRepository.countOverlappingBookings(
                        room.getId(),
                        checkIn,
                        checkOut
                );

        // Check availability using physical room count
        if (overlappingBookings >= room.getTotalRooms()) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No rooms available for selected dates"
            );
        }

        // Calculate number of nights
        long nights = ChronoUnit.DAYS.between(
                checkIn, checkOut
        );

        // Calculate total amount on the backend
        BigDecimal totalAmount =
                room.getPricePerNight()
                        .multiply(BigDecimal.valueOf(nights));

        // Generate unique booking reference
        String reference = "HTL-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        // Create booking object
        Booking booking = new Booking();

        booking.setBookingReference(reference);
        booking.setRoom(room);
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setNumberOfGuests(numberOfGuests);
        booking.setCheckIn(checkIn);
        booking.setCheckOut(checkOut);
        booking.setTotalAmount(totalAmount);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);

        // Save booking to database
        return bookingRepository.save(booking);
    }

    // Retrieve booking using reference and email
    @Transactional(readOnly = true)
    public Booking getBooking(
            String reference,
            String email) {

        return bookingRepository
                .findByBookingReferenceAndCustomerEmail(
                        reference, email
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found"
                ));
    }

    // Cancel an existing booking
    @Transactional
    public Booking cancelBooking(
            String reference,
            String email) {

        Booking booking = bookingRepository
                .findByBookingReferenceAndCustomerEmail(
                        reference, email
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found"
                ));

        // Prevent repeated cancellation
        if (booking.getStatus() ==
                Booking.BookingStatus.CANCELLED) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Booking is already cancelled"
            );
        }

        // Update booking status
        booking.setStatus(
                Booking.BookingStatus.CANCELLED
        );

        return bookingRepository.save(booking);
    }
    // QR Code Booking Verification
    @Transactional(readOnly = true)
    public BookingVerificationResponse verifyBooking(String reference) {

        Booking booking = bookingRepository
                .findByBookingReference(reference)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Invalid booking reference"
                ));

        Room room = booking.getRoom();

        return new BookingVerificationResponse(
                booking.getBookingReference(),
                room.getHotel().getName(),
                room.getHotel().getLocation(),
                room.getRoomType(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getNumberOfGuests(),
                booking.getTotalAmount(),
                booking.getStatus().name()
        );
    }

}
