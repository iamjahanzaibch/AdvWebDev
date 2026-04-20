# Final Project - Full Stack Booking System

This is a complete full-stack application combining:
- **Frontend**: React with Vite and React Router
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL

## Project Structure

```
final-project/
├── frontend/
│   ├── package.json
│   ├── Dockerfile
│   ├── index.html
│   ├── vite.config.js
│   ├── originalPage/
│   └── src/
├── backend/
│   ├── package.json
│   ├── Dockerfile
│   ├── server.js
│   └── src/
├── database files (db/init/ with SQL scripts)
├── docker-compose.yml (orchestrates all services)
└── .env (environment configuration)
```

## Features

1. **HomePage** - Displays booking information and navigation
2. **FormPage** - Booking form with validation that submits data to the backend API
3. **Backend API** - REST API at `/api/bookings` for creating and retrieving bookings
4. **Database** - PostgreSQL database storing all booking submissions

## Running the Project

### Option 1: Using Docker (Recommended)

```bash
# Build and run all services (database, backend, frontend)
docker compose up -d --build

# Access the application at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:5000
# - Database: localhost:5432
```

### Option 2: Local Development

#### Prerequisites
- Node.js 20+
- PostgreSQL running locally

#### Setup

```bash
# Install dependencies
npm install

# Or install by area if you want to work directly in each subproject
# cd frontend && npm install
# cd ../backend && npm install

# Create .env file with database credentials
PGHOST=localhost
PGPORT=5432
PGDATABASE=booking_db
PGUSER=booking_dbuser
PGPASSWORD=Secret1234!
IPORT=5000

# Create database and run migrations
createdb booking_db
psql -U booking_dbuser -d booking_db -f db/init/001_create_bookings.sql

# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
npm run dev:frontend
```

## API Endpoints

### POST /api/bookings
Submit a new booking request

**Request body:**
```json
{
  "fullName": "John Doe",
  "emailAddress": "john@example.com",
  "bookingDate": "2026-04-25",
  "attendees": 4
}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "booking_date": "2026-04-25",
    "attendees": 4,
    "created_at": "2026-04-20T10:30:00.000Z"
  },
  "message": "Booking created successfully"
}
```

### GET /api/bookings
Retrieve all bookings

### GET /api/bookings/:id
Retrieve a specific booking by ID

## Development

### Debugging

#### Docker logs
```bash
# Backend logs
docker logs final-project-backend -f

# Database logs
docker logs final-project-db -f

# Frontend logs
docker logs final-project-frontend -f
```

#### Database access
```bash
docker exec -it final-project-db psql -U booking_dbuser -d booking_db
```

### Code formatting
```bash
npm run format
```

## Configuration

The project uses the following environment variables:

- `VITE_API_BASE_URL` - Frontend API base URL (default: http://localhost:5000)
- `IPORT` - Backend port (default: 5000)
- `PGHOST` - Database host
- `PGPORT` - Database port (default: 5432)
- `PGDATABASE` - Database name
- `PGUSER` - Database user
- `PGPASSWORD` - Database password

## Deployment

### Building for production

```bash
# Build frontend
npm run build

# The backend runs with `node server.js`
```

### Production environment variables
- Set `VITE_API_BASE_URL` to your production backend URL
- Set database credentials for the production database
- Update `PGHOST` to your production database host

## Troubleshooting

### Database connection errors
- Ensure PostgreSQL is running
- Check credentials in .env file
- Verify database and user exist

### Frontend can't reach backend
- Check VITE_API_BASE_URL is correctly set
- Verify backend is running on the correct port
- Check docker-compose network configuration

### Docker issues
- Remove containers: `docker compose down --volumes`
- Rebuild: `docker compose up -d --build`
- View logs: `docker compose logs -f`
