# Frontendly Frontend

**Deploy:** https://frontendly-frontend.vercel.app

Frontend của Frontendly — học React qua challenges, gamification, leaderboard.

## Tech Stack

- **React:** ^19.2.5
- **Vite:** ^8.0.9
- **TypeScript:** ~6.0.2
- **Socket.IO Client:** ^4.8.3
- **State Management:** Zustand ^5.0.10
- **Styling:** Tailwind CSS ^4.2.2 (no CSS Modules)
- **Routing:** React Router ^7.12.0
- **Data Fetching:** TanStack Query ^5.90.12
- **Code Editor:** Monaco Editor ^0.55.1
- **Theme:** next-themes ^0.4.6
- **Animations:** framer-motion ^12.40.0
- **Icons:** lucide-react ^1.17.0

## Environment Requirements

- **Node Version:** Not specified in package.json
- **Package Manager:** Yarn (yarn.lock present)

## Installation

```bash
git clone <repository-url>
cd frontendly-frontend
yarn install
```

## Environment Variables

Required environment variables (create `.env` file):

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## Running the Project

```bash
yarn dev       # Vite dev server
yarn build     # TypeScript build + Vite build
yarn lint      # ESLint
yarn preview   # Preview production build
yarn test      # Vitest tests
```

## Directory Structure

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── assets/              # Static assets (images, icons)
├── components/          # Reusable UI components
│   ├── AuthRequiredModal/
│   ├── Avatar/
│   ├── Badge/
│   ├── Button/
│   ├── Card/
│   ├── Header/
│   ├── Footer/
│   ├── Input/
│   ├── Modal/
│   ├── Toast/
│   ├── landing/         # Landing page components
│   └── ...
├── config/              # Environment configuration
├── constants/           # Route constants
├── data/                # Static data (curriculum)
├── features/            # Feature-specific modules
│   ├── ai-chat/         # AI tutoring feature
│   ├── auth/            # Authentication
│   ├── challenge/       # Challenge catalog
│   ├── editor/          # Code workspace
│   ├── entrance-test/   # Placement test
│   ├── gamification/    # XP, badges, streak
│   ├── leaderboard/     # Rankings
│   ├── learning-path/   # Roadmap, theory, practice
│   ├── profile/         # User profile
│   └── sandbox/         # Free coding environment
├── hooks/               # Custom React hooks
├── layouts/             # Page layouts
├── pages/               # Route pages
├── services/            # API layer
├── store/               # Zustand stores
├── types/               # TypeScript types
└── utils/               # Utility functions
```

## Main Pages/Features

| Page/Route | Description |
|-------------|-------------|
| `/` | Landing page with hero section, features, gamification preview |
| `/entrance-test` | 20-question placement test for personalized learning path |
| `/learning-path` | Roadmap with milestones, study plan, lesson progress |
| `/learning-path/milestone/:milestoneId/lesson/:lessonId` | Theory content with enhanced reading experience |
| `/workspace/:exerciseId` | Code editor with Monaco, 4-file support (html/css/js/jsx) |
| `/challenge/lobby` | Challenge catalog with 20 exercises across 3 difficulty levels |
| `/profile` | User profile with XP, badges, streak, activity heatmap |
| `/leaderboard` | Global rankings with gamification stats |
| `/sandbox` | Sandbox list for free code experimentation |
| `/sandbox/:sandboxId` | Individual sandbox editor |
| `/login` | Login page with email/password and Google OAuth |
| `/register` | Registration page |
| `/forgot-password` | Password reset request |
| `/reset-password` | Password reset with token |
| `/contact` | Contact page |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/banned` | Banned user page |
| `/404` | Not found page |

## Coding Conventions

**ESLint Config:**
- Extends: `js.configs.recommended`, `tseslint.configs.recommended`, `reactHooks`, `reactRefresh`
- Files: `**/*.{ts,tsx}`
- ECMA Version: 2020
- Globals: browser environment

**Component/File Naming:**
- Components: PascalCase (e.g., `UserProfile.tsx`, `TheoryPage.tsx`)
- Utilities: camelCase (e.g., `editorHelpers.ts`, `storage.ts`)
- Styles: kebab-case (e.g., `workspace.css`, `TheoryPage.css`)
- Feature folders: kebab-case (e.g., `learning-path`, `entrance-test`)

**State Management:**
- Zustand stores in `src/store/` directory
- Stores: `auth.store.ts`, `guest.store.ts`, `roadmapStore.ts`
- Pattern: `create()` with typed state and actions

## Backend Connection

**API Layer:** `src/services/api.ts`

**Configuration:**
- Base URL: `ENV.API_URL` from `src/config/env.ts`
- Timeout: 30 seconds
- Default headers: `Content-Type: application/json`

**Authentication:**
- Token storage: `localStorage` (`accessToken`, `refreshToken`)
- Request interceptor: Adds `Authorization: Bearer ${token}` header
- Response interceptor: Handles 401 errors with automatic token refresh
- Refresh flow: Queues requests during refresh, updates localStorage with new tokens
- 403 handling: Redirects to `/banned` for banned users

**Socket.IO:**
- Connection URL: `ENV.SOCKET_URL` from environment
- Used for real-time features (currently minimal: `hello` event in UserGateway)

## Testing

**Test Setup:**
- Framework: Vitest ^4.1.10
- Testing Library: @testing-library/react ^16.3.2, @testing-library/jest-dom ^6.9.1
- Test Environment: jsdom ^29.1.1

## Build & Deploy

**Platform:** Vercel (configured via `vercel.json`)

**Vercel Configuration:**
- Rewrites: SPA routing (`/(.*)` → `/index.html`)
- Headers: Cache control for assets (`/assets/*` → public, max-age=31536000, immutable)

**Build Settings:**
- Framework: Vite
- Build Command: `yarn build`
- Output Directory: `dist`

**Environment Variables (Production):**
- `VITE_API_URL`: Backend API URL
- `VITE_SOCKET_URL`: WebSocket URL
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID

