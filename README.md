# Golf Booking App

A full-stack web application for booking golf tee times.

## Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Backend**: Node.js, Express
- **Database**: PostgreSQL

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Setup

### 1. Clone and install dependencies

```bash
npm install
```

### 2. Set up the database

Create a PostgreSQL database and run the schema:

```bash
psql -U postgres -c "CREATE DATABASE golfbooking;"
psql -U postgres -d golfbooking -f database/schema.sql
psql -U postgres -d golfbooking -f database/seed.sql
```

### 3. Configure environment

Copy the example env file and update with your settings:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your database credentials and JWT secret.

### 4. Run the application

Development mode (runs both frontend and backend):

```bash
npm run dev
```

Or run them separately:

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (protected)

### Tee Times
- `GET /api/tee-times/available` - Get available tee times
- `GET /api/tee-times/:id` - Get tee time details
- `POST /api/tee-times/generate` - Generate tee times (protected)

### Bookings
- `GET /api/bookings` - Get user's bookings (protected)
- `GET /api/bookings/:id` - Get booking details (protected)
- `POST /api/bookings` - Create booking (protected)
- `DELETE /api/bookings/:id` - Cancel booking (protected)

## Project Structure

```
golfbookingapp/
├── backend/
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth middleware
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   └── index.js      # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client
│   │   └── styles/       # CSS styles
│   └── package.json
├── database/
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Sample data
└── package.json          # Root package.json
```

## License

MIT
