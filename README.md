# Frontendly Frontend

Frontendly Frontend là app React/Vite cho nền tảng học frontend theo hướng gamified. App hiển thị landing/home, entrance test, learning path, lesson theory, workspace code editor, challenge catalog, profile, leaderboard, toast/notification và các luồng auth.

Repo backend tương ứng nằm ở `../frontendly-backend`. Hai thư mục được xem như hai repo riêng trong workspace local.

## Chạy Local

```bash
yarn install
yarn dev
```

App mặc định chạy ở `http://localhost:5173`.

Backend local mặc định:

- API base: `http://localhost:3000/api/v1`
- Socket URL: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

## Env

Tạo `.env` trong folder frontend:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=replace-with-google-client-id
```

`VITE_API_URL` được dùng bởi Axios client ở `src/services/api.ts`. `VITE_SOCKET_URL` được giữ cho realtime/socket client nếu cần. Google login sẽ hiển thị trạng thái chưa cấu hình nếu client id là placeholder.

## Scripts

```bash
yarn dev      # Vite dev server
yarn build    # TypeScript build + Vite production build
yarn lint     # ESLint
yarn preview  # Preview production build
```

## Tech Stack

- React 19, TypeScript, Vite 8
- React Router 7
- TanStack Query 5
- Zustand
- Tailwind CSS 4
- Monaco editor
- Axios
- Socket.IO client
- next-themes
- lucide-react
- framer-motion

## Cấu Trúc Chính

```text
src/
├── components/      # UI dùng chung: Button, Card, Toast, ProtectedRoute...
├── config/          # env, firebase, theme
├── constants/       # routes, app constants, XP constants
├── features/        # auth, learning-path, editor, challenge, entrance-test...
├── hooks/           # hooks dùng chung
├── layouts/         # AuthLayout, MainLayout, WorkspaceLayout
├── pages/           # route-level pages
├── services/        # Axios và Socket.IO client
├── store/           # Zustand stores
├── types/           # shared TypeScript types
└── utils/           # helper functions
```

## Route Chính

- `/`: home/landing.
- `/entrance-test`: bài kiểm tra đầu vào.
- `/learning-path`: roadmap tổng quan.
- `/learning-path/milestone/:milestoneId`: chi tiết milestone.
- `/learning-path/milestone/:milestoneId/lesson/:lessonId`: lesson theory.
- `/learning-path/milestone/:milestoneId/lesson/:lessonId/complete`: completion screen.
- `/workspace/:exerciseId`: Monaco workspace để làm bài tập.
- `/challenge/lobby`: challenge catalog, tức danh sách bài tập code để người dùng chọn và mở vào workspace.
- `/profile`: profile, protected.
- `/leaderboard`: leaderboard.
- `/login`, `/register`, `/forgot-password`, `/reset-password`: auth pages.
- `/banned`: account banned page.

Lưu ý: project không còn feature battle/matchmaking. Challenge chỉ là catalog bài tập code, không có room, match, battle realtime.

## Feature Hiện Có

### Auth

- Login/register bằng email/password.
- Google login qua `@react-oauth/google`.
- Forgot/reset password.
- Session verification khi app boot.
- Token lưu trong localStorage.
- Protected route cho các trang cần login, workspace cho phép guest qua `allowGuest`.

Các file quan trọng:

- `src/features/auth/services/auth.service.ts`
- `src/features/auth/hooks/useAuth.ts`
- `src/features/auth/hooks/useGoogleLogin.ts`
- `src/store/auth.store.ts`

### Entrance Test

- Page: `src/pages/EntranceTestPage.tsx`
- Hook: `src/features/entrance-test/hooks/useEntranceTest.ts`
- Service: `src/features/entrance-test/services/entrance-test.service.ts`

Frontend gọi:

- `GET /entrance-test/questions`
- `POST /entrance-test/submit`

Service có fallback local để frontend vẫn chạy được khi backend chưa bật. Kết quả trả về `skipToMilestoneId` và `skillId`.

### Learning Path

- Roadmap/milestone/lesson theory/progress summary.
- Các page và component chính nằm trong `src/features/learning-path` và `src/pages/LearningPathPage.tsx`.
- Guest progress được lưu qua `src/store/guest.store.ts`.

Frontend phụ thuộc các endpoint:

- `/roadmaps/:skillId`
- `/stages/:stageId/theory`
- `/stages/:stageId/complete`
- `/stages/:stageId/unlock-practice`
- `/stages/:stageId/practices`
- `/learning-content/skills`
- `/learning-content/progress/summary`

### Workspace Editor

- Page wrapper: `src/pages/workspace/WorkspacePage.tsx`
- Compatibility page: `src/pages/WorkspacePage.tsx`
- Monaco editor components: `src/features/editor/components`
- Service contract: `src/features/editor/services/editor.service.ts`
- Types: `src/features/editor/types/editor.types.ts`

Workspace hỗ trợ 4 file:

- `html`
- `css`
- `js`
- `jsx`

Frontend đọc exercise từ backend và map các field:

- `html_content`, `css_content`, `js_content`, `jsx_content`
- `evaluation_config`
- `requirements`
- `restrictions`
- `target_design` hoặc `target_designs`
- `navigation`

Submit gửi:

```ts
{
  editorContent: {
    html: string,
    css: string,
    js: string,
    jsx: string
  }
}
```

Response evaluator được map về:

- lint errors cho HTML/CSS/JS/JSX
- requirement results
- visual results
- behavior results
- `match_percentage`
- `isCompleted`

### Challenge Catalog

- Page: `src/pages/ChallengeLobbyPage.tsx`
- Service: `src/features/challenge/services/challenge.service.ts`
- Type: `src/features/challenge/types/challenge.types.ts`

Challenge là danh sách bài tập code. Card challenge trỏ tới `/workspace/:exerciseId`.

Frontend gọi:

- `GET /challenge/exercises`

Service có fallback catalog local nếu backend chưa sẵn sàng. Không có battle, room, matchmaking, live standings hoặc match result trong scope hiện tại.

### Profile, Gamification, Leaderboard

- Profile page: `src/pages/ProfilePage.tsx`
- Profile types/components nằm trong `src/features/profile`
- Gamification types nằm trong `src/features/gamification`
- Leaderboard page: `src/pages/LeaderboardPage.tsx`

Các endpoint chính:

- `/users/me`
- `/users/me/password`
- `/users/me/avatar`
- `/users/progress`
- `/users/badges`
- `/users/activity`
- `/users/activity/stats`
- `/users/streak`
- `/users/learning-progress`
- `/leaderboard`
- `/leaderboard/:userId/rank`

## Backend API App Đang Phụ Thuộc

Tất cả endpoint bên dưới nằm dưới `VITE_API_URL`, mặc định là `http://localhost:3000/api/v1`.

- Auth: `/auth/register`, `/auth/login`, `/auth/google`, `/auth/refresh-token`, `/auth/logout`, `/auth/logout-all`, `/auth/forgot-password`, `/auth/reset-password`.
- User/profile: `/users/me`, `/users/me/password`, `/users/me/avatar`, `/users/progress`, `/users/badges`, `/users/activity`, `/users/activity/stats`, `/users/streak`, `/users/learning-progress`.
- Entrance test: `/entrance-test/questions`, `/entrance-test/submit`.
- Learning path: `/roadmaps/:skillId`, `/stages/:stageId/theory`, `/stages/:stageId/complete`, `/stages/:stageId/unlock-practice`, `/stages/:stageId/practices`, `/learning-content/skills`, `/learning-content/progress/summary`.
- Exercises/workspace: `/exercises/:exerciseId/:userId`, `/exercises/:exerciseId/:userId/submit`, `/lp-exercises/:exerciseId/submit`.
- Challenges: `/challenge/exercises`.
- Leaderboard: `/leaderboard`, `/leaderboard/:userId/rank`.

## Note

- Ưu tiên giữ contract frontend/backend đồng bộ trong `features/editor/types/editor.types.ts` và backend `src/editor/db_schemas/exercise_schema.ts`.
- Nếu thêm field exercise mới, cập nhật cả backend schema, DTO/response, frontend type, service mapper và UI nếu cần.
- Challenge không phải battle. Không thêm lại room/matchmaking/realtime battle nếu không có yêu cầu rõ.
- Workspace có draft persistence trong localStorage; khi đổi `WorkspaceFiles`, nhớ cập nhật draft validation.
- `ToastContext.tsx` chỉ export provider để tuân thủ `react-refresh/only-export-components`; hook nằm ở `useToast.ts`.
- Frontend hiện chưa có test suite. Quality gate chính là `yarn lint` và `yarn build`.
- Bundle chính vẫn tương đối lớn do Monaco/workspace chưa được code-split; nên xử lý nếu tối ưu performance.

## Trạng Thái Kiểm Tra

Lần kiểm tra gần nhất trong workspace ngày 2026-06-21:

- `yarn lint`: pass.
- `yarn build`: pass.

## Việc Nên Làm Tiếp

- Code-split route nặng, ưu tiên workspace/Monaco.
- Bổ sung smoke/e2e cho auth, entrance test, learning path, challenge catalog và workspace submit.
- Chuẩn hóa lại một số text tiếng Việt còn bị mojibake trong UI cũ.
- Rà file trùng phiên bản, ví dụ `src/pages/WorkspacePage.tsx` và `src/pages/workspace/WorkspacePage.tsx`.
