import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8080', // URL do backend
  timeout: 10000,
});

// Interceptor para injetar o token em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@sge:token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
