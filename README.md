# QuickShow - Movie Ticket Booking Application

A complete movie ticket booking web application built with React frontend, Java Spring Boot backend, and MongoDB database.

## Features

- 🎬 Browse and search movies
- 🎭 View movie details and trailers
- 🎫 Book movie tickets with seat selection
- 📅 View available show times and dates
- 💳 Complete booking process with payment
- 📱 Responsive design for all devices
- 🔐 User authentication and authorization
- 📋 Manage bookings and favorites
- 🎨 Modern and intuitive UI

## Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

### Backend
- **Spring Boot 3.5.4** - Java framework
- **Spring Data MongoDB** - MongoDB integration
- **Lombok** - Reduce boilerplate code
- **Maven** - Dependency management

### Database
- **MongoDB** - NoSQL database

## Prerequisites

Before running this application, make sure you have the following installed:

- **Java 24** or higher
- **Node.js 18** or higher
- **MongoDB** (local installation or MongoDB Atlas)
- **Maven** (for backend)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ShowTime
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies (Maven will download them automatically)
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Database Setup

Make sure MongoDB is running on your system. The application will automatically create the necessary collections when it starts.

If you're using MongoDB Atlas, update the connection string in `backend/src/main/resources/application.properties`.

## Project Structure

```
ShowTime/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/quickshow/backend/
│   │       ├── controller/  # REST controllers
│   │       ├── model/       # Data models
│   │       ├── repository/  # MongoDB repositories
│   │       ├── service/     # Business logic
│   │       └── QuickShowBackendApplication.java
│   └── src/main/resources/
│       └── application.properties
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and configurations
│   │   └── App.jsx         # Main app component
│   └── package.json
└── README.md
```

## API Endpoints

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/{id}` - Get movie by ID
- `GET /api/movies/genre/{genre}` - Get movies by genre
- `GET /api/movies/search?title={title}` - Search movies
- `POST /api/movies` - Create new movie
- `PUT /api/movies/{id}` - Update movie
- `DELETE /api/movies/{id}` - Delete movie

### Theaters
- `GET /api/theaters` - Get all theaters
- `GET /api/theaters/{id}` - Get theater by ID
- `GET /api/theaters/city/{city}` - Get theaters by city
- `POST /api/theaters` - Create new theater
- `PUT /api/theaters/{id}` - Update theater
- `DELETE /api/theaters/{id}` - Delete theater

### Shows
- `GET /api/shows` - Get all shows
- `GET /api/shows/{id}` - Get show by ID
- `GET /api/shows/movie/{movieId}` - Get shows by movie
- `GET /api/shows/theater/{theaterId}` - Get shows by theater
- `GET /api/shows/movie/{movieId}/date/{date}` - Get shows by movie and date
- `POST /api/shows` - Create new show
- `PUT /api/shows/{id}` - Update show
- `DELETE /api/shows/{id}` - Delete show

### Tickets
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/{id}` - Get ticket by ID
- `GET /api/tickets/user/{userId}` - Get tickets by user
- `GET /api/tickets/show/{showId}` - Get tickets by show
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/{id}` - Update ticket
- `PUT /api/tickets/{id}/cancel` - Cancel ticket
- `DELETE /api/tickets/{id}` - Delete ticket

## Usage

1. **Browse Movies**: Visit the home page to see all available movies
2. **Movie Details**: Click on a movie to view details, cast, and show times
3. **Select Show**: Choose a date and show time
4. **Seat Selection**: Select your preferred seats from the interactive seat layout
5. **Booking**: Complete the booking process and payment
6. **Manage Bookings**: View and manage your bookings in the "My Bookings" section

## Environment Variables

### Backend (.env or application.properties)
```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/quickshow
spring.data.mongodb.database=quickshow

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080
```


## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/yourusername/quickshow/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing library
- MongoDB for the powerful database
- All contributors and supporters

---

**Happy Movie Booking! 🎬🎫** 
