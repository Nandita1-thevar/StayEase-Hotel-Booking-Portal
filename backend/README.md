# Backend

## Prerequisites
- JDK 17 or newer
- Maven (or use the Maven wrapper if generated)
- MySQL Server

## Configure
Set database credentials in environment variables:
- `DB_URL` (example: `jdbc:mysql://localhost:3306/hotel_booking`)
- `DB_USERNAME`
- `DB_PASSWORD`

Then run:
```bash
mvn spring-boot:run
```

The API is configured for port 8080. Implement endpoints under `/api`.
