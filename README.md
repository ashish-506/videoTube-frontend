# Videotube Frontend

React + Vite + Tailwind frontend for the Videotube backend — full feature set.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and point `VITE_API_BASE_URL` at your running backend
   (defaults to `http://localhost:8000/api/v1`).
3. Make sure your backend's `CORS_ORIGIN` env var is set to this app's dev URL
   (`http://localhost:5173`) — cookie-based auth requires an explicit origin, not `*`.
4. `npm run dev`

## Pages

- `/` — video feed (search, paginated)
- `/watch/:videoId` — player, like, save to playlist, subscribe, comments (add/edit/delete)
- `/channel/:username` — channel profile + their published videos (requires login — the
  backend's `getUserChannelProfile` endpoint is behind `verifyJWT`)
- `/login`, `/register`
- `/upload` — publish a video with progress bar
- `/dashboard` — your channel stats + manage your videos (publish/unpublish, delete)
- `/playlists`, `/playlist/:id` — create, view, and manage playlists

## Known backend-driven limitations

- No like *count* shown on the watch page — the backend has no endpoint for a single
  video's total like count, only a toggle + "videos I've liked" list. The like button
  reflects your own liked state only.
- Channel pages require being logged in, because `GET /users/c/:username` is behind
  `verifyJWT` on the backend as currently written.
