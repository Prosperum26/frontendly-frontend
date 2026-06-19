import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Thay bằng thông tin dự án của bạn trên Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD3zyEgpblwqdekcq5D5JWuYvspeG6g54s",
  authDomain: "frontendly-96047.firebaseapp.com",
  projectId: "frontendly-96047",
  storageBucket: "frontendly-96047.firebasestorage.app",
  messagingSenderId: "501820852279",
  appId: "1:501820852279:web:0fb05766b9cce521cf97b2",
  measurementId: "G-MWP2NQZQPW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);