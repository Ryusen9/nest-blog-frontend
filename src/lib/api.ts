import axios, { AxiosError, AxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

/**
 * The function `refreshAccessToken` asynchronously sends a POST request to refresh the access token
 * and returns the new access token if successful, otherwise null.
 * @returns The function `refreshAccessToken` is returning a Promise that resolves to a string value
 * representing the access token retrieved from the API response. If the access token is not found in
 * the response data, it will return `null`.
 */
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

/* The `api.interceptors.response.use()` function in the provided TypeScript code snippet is setting up
a response interceptor for the Axios instance named `api`. This interceptor is responsible for
handling responses from API requests. */
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
