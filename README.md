# QuickShow – cinematic ticketing ready for production & Vercel

QuickShow is a premium movie-ticketing experience built with a React/Vite frontend and a Spring Boot + MongoDB backend. The project now ships with polished UI/UX, seeded demo content, togglable mock APIs for static hosting, and deployment-ready build steps (Vercel for the frontend, any JVM host for the backend).

## Highlights

- ✨ **Hero-grade UI** with featured premieres, curated collections, partner theaters, and premium show highlights.
- 🎬 **Deep movie experience**: details pages, trailers, smart date filters, premium badges, and contextual CTAs.
- 🪄 **Mock data layer**: high-fidelity movies, shows, bookings, and favorites that work offline or on static hosting. Flip one env flag to hit the real backend.
- 💼 **Seat booking UX**: live availability, seat caps, booking summary, and local persistence backed by mock storage.
- 🔐 **Authentication-ready** via Clerk (just drop in your publishable key).
- 🚀 **Production readiness**: environment-driven configs, global CORS, Java 17 compatibility, CI-friendly builds, and a Vercel deployment recipe.

---

## Project structure

```
quickshow-booking-app/
├── backend/            # Spring Boot 3.5 + MongoDB
│   └── src/main/java/com/quickshow/backend
│       ├── config/     # Seeding + global CORS
│       ├── controller/ # REST endpoints
│       ├── service/    # Business logic
│       └── model/      # MongoDB documents
├── frontend/           # React 19 + Vite 7
│   └── src/
│       ├── data/       # Rich mock datasets
│       ├── lib/        # API orchestration, storage helpers
│       ├── components/ # UI building blocks
│       └── pages/      # Routes & experiences
└── README.md
```

---

## Environment variables

### Frontend (`frontend/.env`)

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx            # Clerk (optional—remove protected routes if unused)
VITE_API_URL=https://your-backend-domain/api      # Points to Spring Boot (defaults to http://localhost:8081/api)
VITE_USE_MOCK_DATA=true                           # true = rich demo data, false = force API (with mock fallback)
VITE_DEFAULT_USER_ID=demo-user                    # Used for booking mocks
```

> **Tip:** For a zero-backend Vercel deploy keep `VITE_USE_MOCK_DATA=true`. When you have the Java API hosted, flip it to `false` (or remove) and set `VITE_API_URL`.

### Backend (`backend/src/main/resources/application.properties`)

```properties
spring.data.mongodb.uri=${MONGODB_URI:mongodb://localhost:27017/quickshow}
spring.data.mongodb.database=${MONGODB_DB:quickshow}
server.port=${PORT:8081}
server.servlet.context-path=/api
spring.web.cors.allowed-origins=${ALLOWED_ORIGINS:http://localhost:5173,https://*.vercel.app}
```

Use environment variables (`MONGODB_URI`, `MONGODB_DB`, `PORT`, `ALLOWED_ORIGINS`) on your server/hosting platform.

---

## Local development

### Prerequisites
- Node.js ≥ 18
- Java 17
- Maven 3.9+
- MongoDB (local or Atlas)

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # production build (Vercel uses this)
```

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run   # http://localhost:8081/api
```

The `DataSeeder` seeds MongoDB with curated titles/shows the first time it runs.

---

## Deploying to Vercel (frontend)

1. **Create a Vercel project** pointing to the `frontend` folder.
2. **Set build & output:**
   - Build command: `npm run build`
   - Output directory: `dist`
3. **Add environment variables** (Settings → Environment Variables):
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_API_URL` (optional)
   - `VITE_USE_MOCK_DATA` (`true` for static demo, `false` when backend URL is reachable)
   - `VITE_DEFAULT_USER_ID`
4. Deploy. Vercel’s static hosting + mock data gives you a fully functional showcase without running the backend.

> When you later host the Spring Boot API (Render, Railway, Fly.io, Heroku, etc.), just point `VITE_API_URL` to it and disable mock data.

---

## Deploying the backend

Any JVM-friendly host works (Render, Railway, Azure App Service, AWS Elastic Beanstalk, etc.).

1. Provision MongoDB (Atlas recommended) and collect the connection string.
2. Set environment variables:
   - `MONGODB_URI`
   - `MONGODB_DB` (optional, else defaults to `quickshow`)
   - `PORT` (only if host requires a random port)
   - `ALLOWED_ORIGINS` (comma-separated list, e.g. `https://quickshow.vercel.app`)
3. Build & run:
   ```bash
   mvn -DskipTests package
   java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```
4. Update the frontend’s `VITE_API_URL` to this deployed URL and disable mock data.

---

## API surface (Spring Boot)

- **Movies**: `GET /api/movies`, `GET /api/movies/{id}`, `GET /api/movies/search?title=`, CRUD endpoints.
- **Shows**: `GET /api/shows/{id}`, `GET /api/shows/movie/{movieId}/date/{yyyy-MM-dd}`, plus CRUD.
- **Tickets**: booking + cancellation endpoints (`POST /api/tickets`, `PUT /api/tickets/{id}/cancel`, etc.).
- **Users & Theaters**: standard CRUD endpoints.

Global CORS + environment-driven origins keep the API consumption-ready for both localhost and Vercel domains.

---

## Dummy data & offline mode

- `frontend/src/data/mockData.js` ships with cinematic posters, trailers, partner theaters, premium showtimes, and starter bookings.
- `frontend/src/lib/quickshowApi.js` orchestrates between the real API and mock data. When mock mode is enabled (default for Vercel), reads/writes happen via `localStorage` so bookings and favourites persist per visitor.
- The backend `DataSeeder` mirrors the most popular titles to ensure a smooth transition once you connect to MongoDB.

---

## Testing & linting

```bash
# frontend
npm run lint
npm run build

# backend
mvn test
```

CI recommendation: run `npm run build` and `mvn -DskipTests=false test` before deploying.

---

## Support & contributions

1. Open an issue with context, screenshots/logs, and repro steps.
2. For UI tweaks or data updates, edit the React layer (`frontend/src`) and submit a PR.
3. For API/extensions, add service + controller tests where possible.

Enjoy the show! 🎟️🍿
