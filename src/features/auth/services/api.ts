import axios from 'axios';

export const api = axios.create({
  // URL từ file .env
  baseURL: import.meta.env.VITE_API_URL, 
});

// Tự động gắn token vào header mỗi khi gọi API
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});