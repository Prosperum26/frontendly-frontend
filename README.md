# Frontendly Frontend

Frontend React/Vite cho Frontendly, nền tảng học React/frontend theo hướng gamified. App này hiển thị learning path, workspace editor, challenge, profile, leaderboard, notification và các luồng auth.

Backend repo tương ứng nằm ở `../frontendly-backend` trong workspace local hiện tại, nhưng hai folder được xem như hai repo riêng.

## Chạy local

```bash
yarn install
yarn dev
```

App mặc định chạy ở `http://localhost:5173` và gọi backend qua `VITE_API_URL`.

Backend local mặc định:

- API base: `http://localhost:3000/api/v1`
- Socket URL: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

## Tech stack

- React 19, TypeScript, Vite 8
- React Router 7, TanStack Query 5, Zustand
- Tailwind CSS 4, next-themes, lucide-react, framer-motion
- Monaco editor, Socket.IO client, Axios

## Env

Tạo `.env` trong folder này:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=replace-with-google-client-id
```

## Scripts

```bash
yarn dev
yarn build
yarn lint
yarn preview
```

## Cấu trúc chính

```text
src/
├── components/      # UI dùng chung
├── config/          # env, firebase, theme
├── constants/       # routes, app constants, XP constants
├── features/        # auth, learning-path, editor, challenge, profile...
├── hooks/           # hooks dùng chung
├── layouts/         # Main/Auth/Workspace layout
├── pages/           # route-level pages
├── services/        # Axios và Socket.IO client
├── store/           # Zustand stores
├── types/           # shared TypeScript types
└── utils/           # helper functions
```

## Tính năng giao diện

- Auth: login, register, forgot/reset password, Google login.
- Learning path: roadmap, milestone detail, theory, completion screens.
- Workspace: Monaco editor, preview, exercise submit.
- Challenge: lobby và battle page.
- Profile: user card, badge, progress, heatmap, avatar upload.
- Leaderboard, notifications, toast, protected routes.

## Backend endpoints app đang phụ thuộc

Các endpoint chính nằm dưới `VITE_API_URL`, mặc định là `/api/v1`.

- Auth: `/auth/register`, `/auth/login`, `/auth/google`, `/auth/refresh-token`, `/auth/logout`, `/auth/logout-all`, `/auth/forgot-password`, `/auth/reset-password`.
- User/profile: `/users/me`, `/users/me/password`, `/users/me/avatar`, `/users/progress`, `/users/badges`, `/users/activity`, `/users/activity/stats`, `/users/streak`, `/users/learning-progress`.
- Learning path: `/roadmaps/:skillId`, `/stages/:stageId/theory`, `/stages/:stageId/complete`, `/stages/:stageId/unlock-practice`, `/stages/:stageId/practices`, `/learning-content/skills`, `/learning-content/progress/summary`.
- Exercises/workspace: `/exercises/:exerciseId/:userId`, `/exercises/:exerciseId/:userId/submit`, `/lp-exercises/:exerciseId/submit`.
- Leaderboard: `/leaderboard`, `/leaderboard/:userId/rank`.

## Trạng thái kiểm tra

Lần kiểm tra gần nhất trong workspace ngày 2026-06-21:

- `yarn build`: pass.
- `yarn lint`: fail với 10 errors và 1 warning.

Các lỗi lint hiện tại:

- `src/components/Toast/ToastContext.tsx`: Fast Refresh rule.
- `src/features/auth/components/GoogleButton.tsx`, `src/features/auth/hooks/useAuth.ts`, `src/features/auth/hooks/useGoogleLogin.ts`, `src/utils/storage.ts`: còn `any`.
- `src/utils/validation.ts`: regex escape thừa.
- `src/pages/workspace/WorkspacePage.tsx`: thiếu dependency `stageId` trong `useCallback`.

Vite build cũng cảnh báo bundle chính lớn khoảng 698 kB sau minify. Nên lazy-load các page nặng như workspace/Monaco/challenge.

## Điểm cần cải thiện

- Sửa lint để quality gate xanh: Fast Refresh export, các `any`, regex escape, dependency hook.
- Code-split các route/page nặng, ưu tiên workspace/Monaco/challenge.
- Bổ sung test frontend hoặc ít nhất smoke/e2e cho auth, learning path và workspace.
- Rà lại các file có dấu hiệu trùng phiên bản, ví dụ `src/pages/WorkspacePage.tsx` và `src/pages/workspace/WorkspacePage.tsx`.
- Nên thêm `.env.example` để onboarding bớt phụ thuộc vào README.
