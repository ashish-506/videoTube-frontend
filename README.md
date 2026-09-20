# Videotube — Frontend

A React frontend for the Videotube video-sharing platform — auth, a searchable video feed, watch page with comments/likes/subscriptions, playlists, channel profiles, and a creator dashboard.

**Live app:** https://video-tube-frontend-zeta.vercel.app  
**Backend repo:** [link](https://github.com/ashish-506/video-tube-backend)

## Tech Stack

- **React** (Vite) — component-based UI
- **Tailwind CSS** — utility-first styling with a custom design token system
- **react-router-dom** — client-side routing, protected routes
- **axios** — API client with an interceptor that automatically retries requests once after a silent token refresh on 401s
- **react-hot-toast** — notifications
- **lucide-react** — icons

## Features / Pages

| Route | Description |
|---|---|
| `/` | Video feed — search, channel results, infinite "Load more" pagination |
| `/watch/:videoId` | Video player, like, save-to-playlist, subscribe, comments (add/edit/delete) |
| `/channel/:username` | Public channel profile + their published videos |
| `/login`, `/register` | Auth pages |
| `/upload` | Publish a video with a live upload-progress bar (protected) |
| `/dashboard` | Creator stats + manage own videos — publish/unpublish, delete (protected) |
| `/playlists`, `/playlist/:id` | Create, view, and manage playlists (protected) |

## Getting Started

```bash
git clone <this-repo-url>
cd <repo>
npm install
cp .env.example .env
```

Set `VITE_API_BASE_URL` in `.env` to your backend's API base (e.g. `http://localhost:8000/api/v1` locally, or the deployed backend URL in production).

```bash
npm run dev
```

## Backend Requirement — CORS + Cookies

Authentication relies on httpOnly cookies (`withCredentials: true` on every request). For this to work, the backend's CORS configuration must set an **exact** matching origin (no wildcard, no trailing slash) with `credentials: true`, e.g.:

```js
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
```

In production, since the frontend and backend are on different domains (Vercel/Render), cookies additionally require `secure: true` and `sameSite: "none"` on the backend.

## Deployment

Deployed on Vercel: build command `npm run build`, output directory `dist`, with `VITE_API_BASE_URL` set as an environment variable pointing at the deployed backend. Since Vite bakes environment variables into the build at compile time, a new deployment is required after changing this value — it won't take effect on an already-built bundle.

## Known Limitations

- No like *count* is shown on the watch page — the backend only exposes a like toggle and a "videos I've liked" list, not a total-like-count endpoint for an arbitrary video.
- Channel pages require being logged in, since the backend's channel-profile endpoint is authenticated.