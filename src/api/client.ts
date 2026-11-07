import axios, { AxiosError } from 'axios';
import { adaptBody, snakeQuery, toSnake } from './adapter';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const API_BASE = `${API_URL}/api/platform`;

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sa_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.url) config.url = snakeQuery(config.url);
  if (config.params) config.params = toSnake(config.params);
  if (config.data && typeof config.data === 'object') config.data = toSnake(config.data);
  return config;
});

api.interceptors.response.use(
  (res) => {
    if (res.data && typeof res.data === 'object') res.data = adaptBody(res.data);
    return res;
  },
  (err: AxiosError) => {
    if (err.response?.data && typeof err.response.data === 'object') {
      err.response.data = adaptBody(err.response.data);
    }
    if (err.response?.status === 401) {
      localStorage.removeItem('sa_access_token');
      localStorage.removeItem('sa_admin');
      if (!location.pathname.endsWith('/login')) location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export function apiErrorMessage(err: unknown): string {
  const e = err as AxiosError<{ message?: string; errors?: { path?: string; message: string }[] }>;
  const data = e?.response?.data;
  const base = data?.message || e?.message || 'Something went wrong';
  if (data?.errors?.length) {
    const detail = data.errors.map((x) => (x.path ? `${x.path}: ${x.message}` : x.message)).join('; ');
    return `${base} — ${detail}`;
  }
  return base;
}
