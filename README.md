# StayEase – Hotel Booking Portal

StayEase is a full-stack hotel booking application developed using React, TypeScript, Java Spring Boot, and MySQL. It allows users to explore hotels, select rooms, make bookings, retrieve booking details, and cancel reservations.

## Technologies Used

| Layer | Technologies |
|---|---|
| Frontend | React.js, TypeScript, Vite, CSS |
| Backend | Java 17+, Spring Boot 3.4.2, Spring Data JPA |
| Database | MySQL |
| ORM | Hibernate |
| Routing | React Router |
| Additional Libraries | QRCode React, html2canvas, jsPDF, Lucide React |
| Build Tool | Maven |

## Project Structure

```text
hotel-booking-portal/
│
├── frontend/       # React + TypeScript application
├── backend/        # Java Spring Boot REST API
├── database/       # Database schema and sample data
├── .gitignore
├── README.md
└── DESIGN.md
```

## Key Features

- Hotel listing and room selection
- Check-in and check-out date selection
- Guest count and room capacity validation
- Booking creation and confirmation
- Automatic booking amount calculation based on room price and stay duration
- Booking lookup using booking reference and customer email
- Booking cancellation
- Room availability validation
- Transaction-based booking operations with database-level locking
- Prevention of overlapping confirmed bookings beyond available room inventory
- Digital Travel Card generation
- QR code-based booking verification
- PDF download of the Digital Travel Card
- Live booking status verification, including cancellation status

## Application Architecture

StayEase follows a three-layer architecture:

1. **Frontend:** React application responsible for the user interface and interactions.
2. **Backend:** Spring Boot REST API responsible for business logic, validation, and booking operations.
3. **Database:** MySQL stores hotel, room, and booking information.

## Prerequisites

Install the following before running the application:

- Java 17 or later
- Maven
- Node.js 20 or later
- npm
- MySQL

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Nandita1-thevar/StayEase-Hotel-Booking-Portal.git
cd StayEase-Hotel-Booking-Portal
```

### 2. Database Setup

- Start your MySQL server.
- Create a database named `hotel_booking`.
- Configure the database connection details in the backend configuration.
- Execute the SQL scripts available in the `database/` directory, if provided.

### 3. Run the Backend

Navigate to the backend directory:

```bash
cd backend
```

Run the Spring Boot application using Maven:

```bash
mvn spring-boot:run
```

The backend runs at:

```text
http://localhost:8080
```

### 4. Run the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Main API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/{reference}?email={email}` | Retrieve booking details |
| PUT | `/api/bookings/{reference}/cancel?email={email}` | Cancel a booking |
| GET | `/api/bookings/verify/{reference}` | Verify booking status |

## Booking and Concurrency Handling

The backend validates booking dates, guest capacity, and room availability before confirming a reservation.

Booking operations use Spring transactions and pessimistic database locking to help prevent concurrent requests from overbooking the same room inventory.

The booking amount is calculated on the backend using the room price and number of nights.

## Digital Travel Card

StayEase includes a Digital Travel Card with a QR code linked to the booking verification page. Scanning the QR code retrieves the latest booking information from the backend, allowing users to check whether a reservation is confirmed or cancelled.

Users can also download the Digital Travel Card as a PDF.

## Future Enhancements

- User authentication and authorization
- Online payment gateway integration
- Admin dashboard for hotel and room management
- Advanced hotel search and filtering
- Automated integration and concurrency testing
- Production deployment and hosting

## Security

Do not commit database passwords, API keys, environment files, or other sensitive credentials. Configure local credentials separately and keep them excluded from version control.

## Author

**Subanandida Thevar**

Full-Stack Hotel Booking Application – StayEase