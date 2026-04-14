import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// CSRF cookie helper
export async function getCsrfCookie() {
  await axios.get(
    (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace('/api', '') + '/sanctum/csrf-cookie',
    { withCredentials: true }
  );
}

export default api;
