# StayEase – Frontend

StayEase is a full-stack hotel booking application that provides users with an interface to search hotels, select rooms, make reservations, and manage their bookings.

## Technologies Used

- React.js
- TypeScript
- Vite
- CSS
- React Router
- Lucide React
- QRCode React
- html2canvas
- jsPDF

## Features

- Hotel listing and room selection
- Check-in and check-out date selection
- Guest selection and booking form
- Booking confirmation
- Booking lookup using booking reference and email
- Booking cancellation
- Digital Travel Card generation
- QR code-based booking verification
- PDF download of the Digital Travel Card
- Responsive booking verification page

## Prerequisites

- Node.js 20 or later
- npm
- Backend application running on Spring Boot

## Installation

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

## Run the Application

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## Backend Integration

The frontend communicates with the Spring Boot backend through REST APIs.

Backend base URL:

```text
http://localhost:8080
```

Ensure the backend is running and the configured API base URL points to the correct backend address.

## Application Routes

| Route | Description |
|---|---|
| `/` | Hotel listing and booking homepage |
| `/verify/:reference` | Booking verification using the booking reference |

## Build for Production

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

**Project:** StayEase – Hotel Booking Portal  
**Frontend:** React + TypeScript + Vite