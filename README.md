# Wasel Palestine API

Backend API for a smart mobility and checkpoint intelligence platform. It stores and exposes information about checkpoints, road incidents, citizen reports, route estimates, weather context, alerts, and moderation/audit actions.

## Tech Stack

- Node.js + Express.js
- PostgreSQL + Sequelize
- JWT access/refresh tokens
- Docker + Docker Compose
- Apidog/API-Dog documentation
- k6 performance testing
- External APIs: OSRM routing + Open-Meteo weather

## Main Features

- User registration, login, refresh token, and logout
- Role-based access for users, moderators, and admins
- Checkpoint creation, listing, and status updates
- Incident creation, listing, verification, and closure
- Citizen report submission, voting, moderation, and duplicate handling
- Route estimation using routing/weather data and local incident penalties
- Alert subscriptions by region/category
- Audit log for moderation/admin actions

## Project Structure

```txt
src/
  config/ controllers/ middleware/ models/ routes/
  seeders/ services/ utils/ validators/ constants/
performance/
  incident-list-read.js report-write.js mixed-load.js spike-test.js soak-test.js
```

## Setup

Create `.env` in the project root:

```env
PORT=5000
NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_NAME=wasel_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_ACCESS_SECRET=wasel_access_secret_change_me
JWT_REFRESH_SECRET=wasel_refresh_secret_change_me
JWT_ACCESS_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=7d
AUTH_RATE_LIMIT_MAX=200
REPORT_RATE_LIMIT_MAX=1000
ROUTING_API_URL=https://router.project-osrm.org
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
```

Run the project:

```bash
docker compose up --build
```

Health check:

```txt
http://localhost:5000/health
```

Seed demo data:

```bash
docker exec -it wasel_api npm run db:seed
```

Demo accounts:

```txt
Admin: admin@wasel.local / Admin123!
User:  test@example.com / Test123!
```

## Base URL

```txt
http://localhost:5000/api/v1
```

## Key Endpoints

```txt
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me

GET   /checkpoints
POST  /checkpoints
PATCH /checkpoints/:id/status

GET  /incidents
POST /incidents
POST /incidents/:id/verify
POST /incidents/:id/close

POST /reports
GET  /reports
POST /reports/:id/vote
POST /reports/:id/moderate

POST /routes/estimate
POST /subscriptions
GET  /subscriptions/me
GET  /subscriptions/me/alerts
GET  /audit/moderation
```

Protected routes use:

```txt
Authorization: Bearer <accessToken>
```

## Performance Tests

Run from the project root:

```bash
k6 run performance/incident-list-read.js
k6 run performance/report-write.js
k6 run performance/mixed-load.js
k6 run performance/spike-test.js
k6 run performance/soak-test.js
```

## Documentation

API documentation is prepared in Apidog/API-Dog and includes requests, responses, auth flow, error examples, environment variables, and test results.

## Collaborators

| Name | Student ID |
|---|---|
| Muath Alrefai | 12011560 |
| Muhammad Alrefai | 12217414 |
