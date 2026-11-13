package com.example.hotelbooking.dto;


import java.math.BigDecimal;
import java.time.LocalDate;

public class BookingVerificationResponse {

    private String bookingReference;
    private String hotelName;
    private String hotelLocation;
    private String roomType;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer numberOfGuests;
    private BigDecimal totalAmount;
    private String status;

    public BookingVerificationResponse(
            String bookingReference,
            String hotelName,
            String hotelLocation,
            String roomType,
            LocalDate checkIn,
            LocalDate checkOut,
            Integer numberOfGuests,
            BigDecimal totalAmount,
            String status) {

        this.bookingReference = bookingReference;
        this.hotelName = hotelName;
        this.hotelLocation = hotelLocation;
        this.roomType = roomType;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.numberOfGuests = numberOfGuests;
        this.totalAmount = totalAmount;
        this.status = status;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public String getHotelName() {
        return hotelName;
    }

    public String getHotelLocation() {
        return hotelLocation;
    }

    public String getRoomType() {
        return roomType;
    }

    public LocalDate getCheckIn() {
        return checkIn;
    }

    public LocalDate getCheckOut() {
        return checkOut;
    }

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getStatus() {
        return status;
    }
}
