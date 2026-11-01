# Streamer - Full-Stack Video Streaming Platform

## 🌟 Project Overview

Streamer is a comprehensive full-stack video streaming and social platform inspired by YouTube and Twitch. It supports video uploads, live streaming, watch parties with real-time chat and reactions, user libraries (playlists, subscriptions, history, watch later, liked videos), short video cuts, explore/feed, profiles, and more.

Key features:
- **Video Upload & Streaming**: Secure uploads via Cloudinary, FFmpeg thumbnail generation, video processing.
- **Live Streaming**: Real-time stream handling.
- **Watch Parties**: Collaborative video watching with chat, reactions, participants sidebar.
- **User Library**: History, liked videos, playlists, subscriptions, watch later, my cuts.
- **Social Features**: Comments, likes, subscriptions, profiles.
- **Discovery**: Home feed, trending, explore, search.
- **Auth**: JWT/cookie-based authentication, bcrypt hashing.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.x
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT, Bcrypt
- **File Upload**: Multer, Cloudinary CDN
- **Real-time**: Socket.io (watch parties)
- **Video Processing**: FFmpeg (fluent-ffmpeg), ffprobe
- **Other**: CORS, Morgan logging, Rate limiting, Error handling middleware

**Backend Dependencies**:
```
@ffprobe-installer/win32-x64@^5.1.0
bcrypt@^6.0.0
cloudinary@^2.8.0
cookie-parser@^1.4.7
cors@^2.8.5
dotenv@^17.2.3
express@^5.2.1
ffmpeg-static@^5.3.0
ffprobe-static@^3.1.0
fluent-ffmpeg@^2.1.3
jsonwebtoken@^9.0.2
mongoose@^9.0.0
morgan@^1.10.1
multer@^2.0.2
node-fetch@^3.3.2
socket.io@^4.8.1
```
Dev: nodemon@^3.1.11

### Frontend
- **Framework**: React 19 + React Router 7
- **Build Tool**: Vite 7
- **State**: Zustand (authStore, libraryStore, profileStore, uiStore, watchPartyStore)
- **UI/Styling**: Tailwind CSS 4, Lucide React icons, Framer Motion animations
- **Real-time**: Socket.io-client
- **Other**: Axios API client, React Hot Toast notifications, Custom video player, Fast Average Color

**Frontend Dependencies**:
```
axios@^1.13.2
date-fns@^4.1.0
fast-average-color@^9.5.0
framer-motion@^12.23.25
lucide-react@^0.555.0
react@^19.2.0
react-dom@^19.2.0
react-hot-toast@^2.6.0
react-icons@^5.5.0
react-router-dom@^7.10.0
socket.io-client@^4.8.1
zustand@^5.0.9
```
Dev: ESLint 9, Tailwind/PostCSS/Autoprefixer, Vite React plugin, Types.

## 📁 Project Structure

```
streamer/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Cloudinary, Socket config
│   │   ├── controllers/     # Business logic (auth, video, stream, etc.)
│   │   ├── middleware/      # Auth, multer upload, rate limit, error handler
│   │   ├── models/          # Mongoose schemas (User, Video, Playlist, WatchParty, etc.)
│   │   ├── routes/          # API routes
│   │   ├── services/        # Service layer (videoQuery, auth, etc.)
│   │   ├── sockets/         # Watchparty sockets
│   │   ├── utils/           # Helpers (ApiError/Response, asyncHandler, tokens, FFmpeg)
│   │   ├── app.js           # Express app setup
│   │   └── index.js         # Server entry
│   ├── uploads/             # Temp uploads
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API clients (authApi, videoApi, etc.)
│   │   ├── components/      # UI: Navbar, Sidebar, VideoCard, CustomVideoPlayer, WatchPartyChat/Reactions, etc.
│   │   ├── config/          # Socket config
│   │   ├── layouts/         # MainLayout, WatchPartyLayout
│   │   ├── pages/           # Home, Explore, Library (History/Liked/Playlists/Subs/WatchLater), Watch, Auth, Profile, etc.
│   │   ├── router/          # Router index
│   │   ├── sockets/         # Client sockets
│   │   ├── store/           # Zustand stores
│   │   └── main.jsx         # Entry (with auth init)
│   └── package.json
└── README.md                # This file
```

## 🧪 Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Cloudinary account (for video storage/CDN)
- FFmpeg installed (handled via static binaries)

## 🔧 Setup & Installation

1. **Clone the repo**:
   ```
   git clone <repo-url>
   cd streamer
   ```

2. **Backend Setup**:
   ```
   cd backend
   npm install
   cd ../
   ```

3. **Frontend Setup**:
   ```
   cd frontend
   npm install
   cd ../
   ```

4. **Environment Variables**:
   Create `.env` in `backend/`:
   ```
   MONGODB_URL=mongodb://localhost:27017/streamify  # or Atlas URL
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   JWT_EXPIRES_IN=15d
   REFRESH_TOKEN_SECRET=your-refresh-secret-min-32-chars
   REFRESH_TOKEN_EXPIRES_IN=30d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. **Database**:
   - Local: Start MongoDB, DB name: `streamify`
   - Atlas: Use connection string in `MONGODB_URL`

## ▶️ Running the Application

### Development
Terminal 1 (Backend):
```
cd backend
npm run dev
```
Server: `http://localhost:5000`

Terminal 2 (Frontend):
```
cd frontend
npm run dev
```
App: `http://localhost:5173`

### Production
```
# Backend
cd backend
npm start

# Frontend (build & serve)
cd frontend
npm run build
npx serve dist  # or nginx/any static server
```

## 🌐 API Endpoints

Base URL: `/api`

| Category | Endpoints | Methods | Auth |
|----------|-----------|---------|------|
| **Auth** | `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh` | POST | Partial |
| **Videos** | `/videos/upload`, `/videos/:id`, `/videos/feed`, `/videos/search` | POST/GET | Partial |
| **Streams** | `/stream/start`, `/stream/stop` | POST | Yes |
| **Interactions** | `/interactions/like/:id`, `/interactions/view/:id` | POST | Partial |
| **Comments** | `/comments/:videoId`, `/comments/:id` | GET/POST/PUT/DELETE | Partial |
| **Playlists** | `/playlists`, `/playlists/:id/videos` | GET/POST/PUT/DELETE | Yes |
| **Subscriptions** | `/subscriptions/:channelId` | POST/DELETE | Yes |
| **Watch Later** | `/watch-later` | GET/POST/DELETE | Yes |
| **Watch Party** | `/watch-party/create`, `/watch-party/:id/join` | POST | Partial |
| **Feed/Explore** | `/feed/home`, `/feed/trending`, `/explore/categories` | GET | Partial |
| **Profile** | `/profile/:username`, `/profile/me` | GET/PUT | Yes |
| **Cuts** | `/cuts/upload`, `/cuts/:id` | POST/GET | Partial |

**Note**: Full OpenAPI docs can be generated. All endpoints use JSON, auth via `Authorization: Bearer <token>` or cookies.

## 🚀 Frontend Routes

| Page | Path | Features |
|------|------|----------|
| Home | `/` | Video rows, categories, trending |
| Explore | `/explore` | Category pills, search |
| Watch | `/watch/:id` | Custom video player, related cards, comments |
| Library | `/library/*` | History, Liked, Playlists, Subs, Watch Later, My Cuts |
| Profile | `/profile/:username` | Videos, subs count, avatar |
| Watch Party | `/watch-party/:id` | Video sync, chat, reactions, participants |
| Auth | `/login`, `/signup` | Forms |
| Search | `/search?q=` | Results page |
| Trending | `/trending` | Hot videos |

## 🔌 Real-time Features (Socket.io)

- **Watch Parties**:
  - Join/leave room
  - Chat messages
  - Reactions (emojis)
  - Participants list
  - Video sync (play/pause/seek)

Sockets configured on backend (`/config/socket.js`) and frontend (`/sockets/watchparty.socket.js`).

## 📱 Key Components

- **CustomVideoPlayer**: HLS/DASH support? Fullscreen, controls.
- **WatchParty Components**: Header, Sidebar (participants), Chat, Reactions, Video.
- **VideoCard/VideoRowSection**: Thumbnails, titles, views, duration.
- **Navbar/Topbar/Sidebar**: Search, library nav, profile.
- **AddToPlaylist**, **CategoryPills**, **Skeleton/Spinner** loaders.

## 🐛 Troubleshooting

- **CORS Errors**: Check `allowed origins` in app.js.
- **Upload Fails**: Verify Cloudinary env vars, multer limits.
- **Socket Issues**: Ensure frontend/backend ports match CORS.
- **FFmpeg Errors**: Windows? Prebuilt binaries included.
- **Mongo Connection**: Check `MONGODB_URL`, network.

## 🚀 Deployment

1. **Backend**: Heroku/Vercel/Railway + MongoDB Atlas + Cloudinary.
2. **Frontend**: Vercel/Netlify/Vite build.
3. **Env Vars**: Secure secrets.
4. **PM2/forever** for Node process.
5. **Nginx** reverse proxy for prod.

Example `Procfile` (Heroku):
```
web: npm start
```

## 🤝 Contributing

1. Fork & PR.
2. Follow ESLint/Tailwind conventions.
3. Add tests (Mocha/Chai?).
4. Update docs.

## 📄 License

ISC

## 👨‍💻 Authors

- [Your Name]

---

**⭐ Star this repo if useful!**
