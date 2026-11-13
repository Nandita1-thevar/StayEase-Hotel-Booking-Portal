# Design Document

## 1. Architecture
Describe how the React frontend communicates with the Spring Boot REST API and how the backend persists data in MySQL.

## 2. Database design
Document Hotels, Rooms, and Bookings, their relationships, primary/foreign keys, and constraints.

## 3. API design
List each endpoint, request fields, response fields, and error responses.

## 4. Booking logic
Explain date validation, number-of-nights calculation, backend price calculation, availability checks, and cancellation.

## 5. Design decisions and trade-offs
Record decisions and alternatives considered.

## 6. Simultaneous bookings
Explain transaction boundaries and the database locking strategy used to prevent overbooking.

## 7. Surprise feature: Digital Hotel Travel Card
Explain QR generation, what the QR contains, how the backend verifies it, and PDF export if implemented.

## 8. Limitations and future improvements
List unfinished items and realistic next steps.
