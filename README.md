# Instagram Chat Preview UI

A responsive Instagram-inspired chat list built with React and Vite.

## Included

- Instagram-style desktop and mobile layout
- Searchable conversation previews
- First three chats readable
- Remaining conversations blurred
- Login-to-continue overlay and modal
- Official Instagram OAuth redirect placeholder
- No Instagram username/password form

## Run

```bash
npm install
npm run dev
```

## Configure login

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your backend endpoint:

```env
VITE_INSTAGRAM_AUTH_URL=https://your-domain.com/auth/instagram
```

That backend route should start Meta's supported Instagram OAuth flow.

Do not collect Instagram passwords, cookies, or session tokens in this frontend.
