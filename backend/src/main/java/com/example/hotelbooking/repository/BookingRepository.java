
package com.example.hotelbooking.repository;

import com.example.hotelbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingReferenceAndCustomerEmail(
        String bookingReference,
        String customerEmail
    );
    Optional<Booking> findByBookingReference(String bookingReference);

    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.room.id = :roomId
        AND b.status = com.example.hotelbooking.entity.Booking.BookingStatus.CONFIRMED
        AND b.checkIn < :checkOut
        AND b.checkOut > :checkIn
    """)
    long countOverlappingBookings(
        @Param("roomId") Long roomId,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );
}
