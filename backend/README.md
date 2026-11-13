# StayEase – Backend

The StayEase backend is a RESTful API developed using Java and Spring Boot. It manages hotel bookings, room availability, booking validation, cancellation, and booking verification.

## Technologies Used

- Java 17+
- Spring Boot 3.4.2
- Spring Data JPA
- Hibernate ORM
- MySQL
- Maven
- REST APIs

## Key Responsibilities

- Manage hotel, room, and booking data
- Create and confirm hotel reservations
- Validate check-in and check-out dates
- Validate guest count against room capacity
- Check room availability before confirming bookings
- Calculate booking amounts on the server
- Retrieve bookings using booking reference and customer email
- Cancel existing reservations
- Verify the latest booking status using a booking reference
- Handle concurrent booking requests using database transactions and pessimistic locking

## Prerequisites

- Java 17 or later
- Maven
- MySQL Server

## Database Configuration

1. Start your MySQL server.
2. Create a database named `hotel_booking`.
3. Configure your MySQL connection URL, username, and password in the backend application configuration.
4. Ensure the database credentials are stored locally and are not committed to GitHub.

## Installation and Run

Navigate to the backend directory:

```bash
cd backend
```

Run the Spring Boot application using Maven:

```bash
mvn spring-boot:run
```

The backend API runs at:

```text
http://localhost:8080
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings/{reference}?email={email}` | Retrieve booking details |
| PUT | `/api/bookings/{reference}/cancel?email={email}` | Cancel a booking |
| GET | `/api/bookings/verify/{reference}` | Verify booking status |

## Booking Management

The booking service validates reservation dates, guest capacity, and room inventory before confirming a booking.

The total booking amount is calculated on the backend based on the room price and number of nights.

## Concurrency Handling

The application uses Spring's `@Transactional` annotation and pessimistic database locking to protect room inventory during booking operations and reduce the risk of overbooking.

Confirmed bookings are considered when checking overlapping reservations. Cancelled bookings do not block room availability.

## Booking Verification

The verification API retrieves the latest booking information using a unique booking reference. It returns details such as hotel name, room type, booking dates, guest count, total amount, and booking status.

This API is integrated with the frontend's QR-based Digital Travel Card.

## Project

**StayEase – Hotel Booking Portal**

Backend developed using Java, Spring Boot, Spring Data JPA, and MySQL.