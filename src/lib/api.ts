import axios, { AxiosError, AxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshAccessToken = async (): Promise<string | null> => {
  const res = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
    withCredentials: true,
  });

  return res.data?.access_token ?? null;
};

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken();
        }

        const newToken = await refreshPromise;
        refreshPromise = null;

        if (newToken) {
          setAccessToken(newToken);
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  },
);

export { api, refreshAccessToken };
