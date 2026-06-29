# Frontendly Frontend

React/Vite app cho nền tảng học frontend gamified: entrance test, personalized learning path, workspace editor, profile, leaderboard.

Backend repo: `../frontendly-backend`.

## Chạy local

```bash
yarn install
yarn dev
```

App: `http://localhost:5173` · API: `http://localhost:3000/api/v1`

Backend cần chạy trước (`yarn seed` + `yarn start:dev`).

## Env (`.env`)

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=replace-with-google-client-id
```

## Scripts

```bash
yarn dev       # Vite dev server
yarn build     # tsc + vite build
yarn lint      # ESLint
yarn preview   # preview production build
```

## Trạng thái kiểm tra

```
yarn lint   ✅
yarn build  ✅
```

## Tech stack

React 19 · Vite 8 · TypeScript · React Router 7 · TanStack Query · Zustand · Tailwind CSS 4 · Monaco · next-themes · framer-motion

## Routes

| Route | Mô tả |
|-------|--------|
| `/` | Home / landing |
| `/entrance-test` | Bài test đầu vào (20 câu) |
| `/learning-path` | Roadmap + study plan |
| `/learning-path/milestone/:id/lesson/:lessonId` | Theory |
| `/workspace/:exerciseId` | Code editor |
| `/challenge/lobby` | Challenge catalog |
| `/profile` | Profile + gamification |
| `/leaderboard` | Bảng xếp hạng |

## Features

### Entrance Test + Personalized Path

1. User làm 20 câu → `POST /entrance-test/submit`
2. Hiển thị score, level, study plan, lesson status (`auto_passed` / `required` / `locked`)
3. Auth user: sync qua `POST /learning-content/sync-placement-test` (cấp XP)
4. Guest: lưu path trong `localStorage` (`frontendly-personalized-path`)

Files: `src/features/entrance-test/`, `src/pages/EntranceTestPage.tsx`

### Learning Path

- Roadmap từ `GET /roadmaps/:skillId` merge với personalized path
- Study plan panel trên Learning Path page
- Lesson icons: ✓ Mastered · ▶ Active · 🔒 Locked

Files: `src/features/learning-path/`, `src/pages/LearningPathPage.tsx`

### Gamification

- SideBar + ProfilePage: XP, level, streak, badges từ `/users/me`, `/users/progress`
- Entrance test: hiển thị XP earned khi auto-pass
- Hook: `src/features/gamification/hooks/useGamificationProfile.ts`

### Dark mode

- Toggle: Header (Sun/Moon icon)
- Provider: `next-themes` trong `App.tsx` (`storageKey: frontendly-theme`)
- Design tokens: `src/index.css` — `--color-main-bg`, `--color-surface`, `--color-heading`, ...
- Class `.dark` / `.light` trên `<html>`

Tất cả page chính dùng CSS variables, không hardcode màu light-only.

### Workspace Editor

Monaco editor 4 file (html/css/js/jsx), submit tới `/exercises/:id/:userId/submit`.

## Cấu trúc

```text
src/
├── components/       # Button, Card, Header, Toast...
├── features/
│   ├── auth/
│   ├── entrance-test/
│   ├── learning-path/
│   ├── editor/
│   ├── gamification/
│   ├── profile/
│   └── challenge/
├── pages/
├── services/api.ts   # Axios client
├── store/            # Zustand (auth, guest, roadmap)
└── index.css         # Design tokens + dark mode
```

## Deploy — Vercel

### Bước 1: Import project

1. [vercel.com](https://vercel.com) → **Add New Project** → import GitHub repo frontend
2. Framework: **Vite**
3. Build: `yarn build` · Output: `dist`

### Bước 2: Environment Variables

| Variable | Production value |
|----------|------------------|
| `VITE_API_URL` | `https://<your-backend>.onrender.com/api/v1` |
| `VITE_SOCKET_URL` | `https://<your-backend>.onrender.com` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |

### Bước 3: Deploy

Vercel tự deploy mỗi push lên `main`. File `vercel.json` đã cấu hình SPA rewrite.

## CI/CD (GitHub Actions)

Workflow: `.github/workflows/ci.yml`

| Trigger | Jobs |
|---------|------|
| push/PR `main`, `develop` | `yarn lint` → `yarn build` |

Vercel có thể kết nối GitHub để auto-deploy song song với CI.

## Luồng deploy end-to-end

```text
Developer push main
    │
    ├─► GitHub Actions (backend): lint → build → Render deploy hook
    │
    ├─► GitHub Actions (frontend): lint → build
    │
    └─► Vercel: auto deploy frontend
              │
              ▼
    User browser ──► Vercel (SPA) ──► Render API (NestJS + MongoDB)
```

**Checklist production:**

1. MongoDB Atlas (hoặc Render MongoDB) → set `DB_URI` trên Render
2. Render backend deploy + `yarn seed`
3. Set `CORS_ORIGINS` = URL Vercel frontend
4. Vercel frontend deploy + env vars
5. Google OAuth: thêm redirect URIs cho cả local + production

## Trạng thái kiểm tra

```
yarn lint   ✅
yarn build  ✅
```

## API phụ thuộc

Chi tiết đầy đủ: xem `../frontendly-backend/README.md`.

Các endpoint frontend gọi trực tiếp:

- Auth: `/auth/*`
- User: `/users/me`, `/users/progress`, `/users/badges`, `/users/activity`
- Entrance: `/entrance-test/questions`, `/entrance-test/submit`
- Learning: `/roadmaps/:skillId`, `/stages/:stageId/*`, `/learning-content/sync-placement-test`
- Exercises: `/exercises/:id/:userId`, `/exercises/:id/:userId/submit`
- Challenge: `/challenge/exercises`
- Leaderboard: `/leaderboard`
