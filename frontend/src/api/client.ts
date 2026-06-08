import axios from 'axios';

// Ensure we point to port 8050 for the backend API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8050/api';

const client = axios.create({
  baseURL: API_URL,
});

// Interceptor to add auth token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
