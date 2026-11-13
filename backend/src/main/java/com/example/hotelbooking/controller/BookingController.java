
package com.example.hotelbooking.controller;

import com.example.hotelbooking.dto.BookingRequest;
import com.example.hotelbooking.entity.Booking;
import com.example.hotelbooking.service.BookingService;
import com.example.hotelbooking.dto.BookingVerificationResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://192.168.18.89:5173"
})
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Create booking
    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody BookingRequest request) {

        Booking booking = bookingService.createBooking(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(booking);
    }

    // Retrieve booking
    @GetMapping("/{reference}")
    public ResponseEntity<Booking> getBooking(
            @PathVariable String reference,
            @RequestParam String email) {

        return ResponseEntity.ok(
                bookingService.getBooking(reference, email)
        );
    }

    // Cancel booking
    @PutMapping("/{reference}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable String reference,
            @RequestParam String email) {

        return ResponseEntity.ok(
                bookingService.cancelBooking(reference, email)
        );
    }
    // Public QR Code Booking Verification
    @GetMapping("/verify/{reference}")
    public ResponseEntity<BookingVerificationResponse> verifyBooking(
            @PathVariable String reference) {

        return ResponseEntity.ok(
                bookingService.verifyBooking(reference)
        );
    }
}
