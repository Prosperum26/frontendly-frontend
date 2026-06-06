export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  NODE_ENV: import.meta.env.MODE || 'development',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
} as const;

// Log environment configuration for debugging
if (ENV.NODE_ENV === 'production') {
  console.log('Production Environment:');
  console.log('API_URL:', ENV.API_URL);
  console.log('SOCKET_URL:', ENV.SOCKET_URL);
}
