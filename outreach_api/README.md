# Settra outreach tracker API

A small FastAPI + SQLite API for the standalone `outreach-frontend` app.

## Run for frontend development

From the repository root, start only the API in Docker and run the frontend's
Vinext development server locally:

```bash
docker compose up -d --build outreach-api
cd outreach-frontend
npm run dev
```

Open the URL printed by Vinext (normally `http://localhost:3000`). Localhost,
127.0.0.1, and IPv6 loopback origins are accepted on any development port.

## Run the production-style stack with Docker

From the repository root:

```bash
docker compose up --build
```

Open [http://localhost:3001](http://localhost:3001). This frontend runs a
production build and therefore does not hot reload. Docker
keeps the SQLite file in a named `outreach-data` volume, so restarting the
stack does not erase your contacts or activity history.

Stop it with `docker compose down`. Do not run `docker compose down -v` unless
you intentionally want to permanently delete the outreach database.

To share this with another person, run the Compose stack on a private host with
a persistent Docker volume, use the real API URL as
`NEXT_PUBLIC_OUTREACH_API_URL` during the website build, and include the website
URL in `OUTREACH_ALLOWED_ORIGINS`. Add authentication before exposing either
service to the public internet—the starter deliberately has no sign-in system.

The local Compose default permits both `localhost:3001` and `127.0.0.1:3001`,
which browsers treat as separate origins.

Useful environment variables:

- `OUTREACH_DB_PATH`: path for the SQLite file.
- `OUTREACH_ALLOWED_ORIGINS`: comma-separated frontend origins allowed by CORS.
- `OUTREACH_ALLOWED_ORIGIN_REGEX`: optional regex for allowed browser origins.
