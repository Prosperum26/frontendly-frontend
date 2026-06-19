# Frontendly

A gamified frontend learning platform built with React, TypeScript, and Vite.

## Tổng hợp Kiểm tra và Phát triển dự án

Xem chi tiết [tại đây](../PROJECT_ASSESSMENT_AND_PLAN.md) để biết đánh giá toàn diện và lộ trình phát triển tiếp theo.

## Project Structure

This project follows a feature-based architecture for scalability and maintainability:

```
src/
├── main.tsx                 # Entry point
├── App.tsx                  # Router and ThemeProvider setup
├── index.css                # Global styles with Tailwind directives
├── assets/                  # Static assets (images, icons, fonts)
├── components/              # Shared reusable UI components
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Modal/
│   ├── Badge/
│   ├── Avatar/
│   ├── ProgressBar/
│   ├── Toast/
│   └── Loader/
├── layouts/                 # Page layout wrappers
│   ├── MainLayout/
│   ├── AuthLayout/
│   └── WorkspaceLayout/
├── pages/                   # Route-level pages
│   ├── HomePage.tsx
│   ├── LearningPathPage.tsx
│   ├── WorkspacePage.tsx
│   ├── ChallengeLobbyPage.tsx
│   ├── ChallengeBattlePage.tsx
│   ├── ProfilePage.tsx
│   ├── LeaderboardPage.tsx
│   ├── LoginPage.tsx
│   └── NotFoundPage.tsx
├── features/                # Feature modules
│   ├── auth/
│   ├── learning-path/
│   ├── editor/
│   ├── challenge/
│   ├── profile/
│   ├── leaderboard/
│   ├── gamification/
│   └── notifications/
├── services/                # Global API config
│   ├── api.ts               # Axios instance
│   └── socket.ts            # Socket.IO client
├── hooks/                   # Global custom hooks
│   ├── useDebounce.ts
│   ├── useFetch.ts
│   └── useWindowSize.ts
├── store/                   # Global state (Zustand)
│   ├── auth.store.ts
│   ├── notification.store.ts
│   └── index.ts
├── utils/                   # Helper functions
│   ├── format.ts
│   ├── validate.ts
│   └── cn.ts                # Tailwind class merging
├── constants/               # App-wide constants
│   ├── routes.ts
│   ├── xp.ts
│   └── app.ts
├── types/                   # Global TypeScript types
│   ├── api.types.ts
│   └── common.types.ts
└── config/
    ├── env.ts               # Environment variables
    └── theme.ts             # Theme configuration
```

## Features

- **Authentication**: Login, registration, and session management
- **Learning Path**: Structured roadmap with milestones and lessons
- **Code Editor**: Live code editing with real-time preview
- **Challenges**: Real-time coding battles with matchmaking
- **Profile**: User stats, badges, and activity tracking
- **Leaderboard**: Global rankings with tier system
- **Gamification**: XP system, levels, streaks, and achievements
- **Notifications**: Real-time notification system

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query
- **API Client**: Axios
- **Real-time**: Socket.IO
- **Theming**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000
```

## Naming Conventions

- **Components**: PascalCase files ending in `.tsx` (e.g., `LearningCard.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useLearningProgress.ts`)
- **Services/Utils**: camelCase `.ts` files (e.g., `learning.service.ts`, `format.ts`)
- **Constants**: `UPPER_CASE` inside files (e.g., `const MAX_LEVEL = 50`)
- **Folders**: `kebab-case` (e.g., `learning-path/`)
- **Exports**: Each feature exports via `index.ts`

## License

MIT
