export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "http://localhost:3000",
  NODE_ENV: import.meta.env.MODE || "development",
} as const;
