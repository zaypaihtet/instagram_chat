# Instagram Chat Preview and Post Publisher

React/Vite chat preview UI with a separate server-backed publishing page.

## What is included

- Responsive chat preview UI
- Searchable conversation previews
- Publisher page at `/publisher`
- Express backend in `server/`
- Server-side publishing through an approved access token and account ID
- Optional official OAuth callback structure
- No Instagram username/password collection form

## Frontend

```bash
npm install
cp .env.example .env
npm run dev
```

Open:

```text
http://localhost:5173/
http://localhost:5173/publisher
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:4000
```

## Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

The API runs at:

```text
http://localhost:4000
```

Health check:

```text
http://localhost:4000/api/health
```

## Publishing configuration

Configure the backend `.env` with values obtained from your Meta developer app and current official API documentation.

For server-side publishing:

```env
INSTAGRAM_ACCESS_TOKEN=your-approved-access-token
INSTAGRAM_USER_ID=your-professional-account-user-id
INSTAGRAM_GRAPH_BASE_URL=https://current-graph-host/current-version
```

The image URL entered on `/publisher` must be a publicly reachable HTTPS URL. Secrets and access tokens must stay in `server/.env`; never place them in frontend variables or commit them to GitHub.

## OAuth configuration

The backend also contains these routes:

```text
GET /api/auth/instagram
GET /api/auth/instagram/callback
```

Set the authorize URL, token URL, scopes, app ID, app secret, and redirect URL from the current settings shown in your Meta developer app.

## Important

This project does not authenticate by collecting an Instagram username and password. Account authorization and publishing credentials must come from Meta's supported developer flow.
