# Settra outreach frontend

Standalone React, TypeScript, Tailwind, and Vinext frontend for the Settra
outreach tracker. It talks to the separate FastAPI API through
`NEXT_PUBLIC_OUTREACH_API_URL` (default: `http://localhost:8001`).

For frontend development with hot reload, start only the API container from
the repository root:

```bash
docker compose up -d --build outreach-api
cd outreach-frontend
npm run dev
```

Open the URL printed by Vinext (normally
[http://localhost:3000](http://localhost:3000)). The API accepts local browser
origins on any port, so Vinext can safely choose another port if `3000` is in
use.

To run a production-style Docker build instead, run `docker compose up
--build` from the repository root and open
[http://localhost:3001](http://localhost:3001). That frontend is intentionally
static and does not hot reload source changes.
