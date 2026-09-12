# Panalium Backend

Backend scaffold using Node.js, Express and Firebase Admin SDK.

Quick start

1. Install dependencies
```bash
cd server
npm install
```

2. Provide credentials
- Option A (local): place the service account JSON at `server/.secrets/serviceAccountKey.json` and set `GOOGLE_APPLICATION_CREDENTIALS=./.secrets/serviceAccountKey.json` in `.env`.
- Option B (CI): set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` in environment.

3. Run dev server
```bash
npm run dev
```

Endpoints
- `POST /api/auth/register` { email, password, displayName, role? }
- `POST /api/auth/create-admin` (requires admin auth)
- `GET /api/auth/me` (requires auth)
