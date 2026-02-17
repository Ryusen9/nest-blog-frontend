"use client";

import { api, refreshAccessToken, setAccessToken } from "@/lib/api";
import type { AxiosError } from "axios";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthUser = {
  id?: number | string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  role?: string;
};

type LoginPayload = {
  email: string;
  password: string;
  remember?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

const ACCESS_TOKEN_COOKIE = "access_token";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const normalizeUser = (payload: unknown): AuthUser | null => {
  if (!payload || typeof payload !== "object") return null;

  const data = payload as Record<string, unknown>;
  let candidate: Record<string, unknown> | undefined =
    (data.user as Record<string, unknown> | undefined) ??
    ((data.data as Record<string, unknown> | undefined)?.user as
      | Record<string, unknown>
      | undefined) ??
    (data.profile as Record<string, unknown> | undefined) ??
    undefined;

  if (!candidate) {
    candidate = payload as Record<string, unknown>;
  }

  if (!candidate || typeof candidate !== "object") return null;

  return {
    id: ((candidate as Record<string, unknown>).id ??
      (candidate as Record<string, unknown>)._id) as
      | string
      | number
      | undefined,
    firstName: ((candidate as Record<string, unknown>).firstName ??
      (candidate as Record<string, unknown>).first_name) as string | undefined,
    lastName: ((candidate as Record<string, unknown>).lastName ??
      (candidate as Record<string, unknown>).last_name) as string | undefined,
    email: (candidate as Record<string, unknown>).email as string | undefined,
    avatarUrl: ((candidate as Record<string, unknown>).avatarUrl ??
      (candidate as Record<string, unknown>).avatar_url) as string | undefined,
    bio: (candidate as Record<string, unknown>).bio as string | undefined,
    role: (candidate as Record<string, unknown>).role as string | undefined,
  };
};

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(";").shift() ?? "");
  }
  return null;
};

const setCookie = (name: string, value: string) => {
  if (typeof document === "undefined") return;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; secure"
      : "";
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; path=/; samesite=lax${secure}`;
};

const clearCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
};

const fetchProfile = async (): Promise<AuthUser | null> => {
  try {
    const res = await api.get("/auth/me");
    return normalizeUser(res.data);
  } catch (error) {
    console.error(
      "Failed to fetch profile:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        setAccessToken(refreshed);
        setToken(refreshed);
        setCookie(ACCESS_TOKEN_COOKIE, refreshed);
        const profile = await fetchProfile();
        setUser(profile);
      }
    } catch (error) {
      console.error(
        "Token refresh failed:",
        error instanceof Error ? error.message : error,
      );
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", payload);
      const accessToken =
        res.data?.access_token ?? res.data?.accessToken ?? res.data?.token;

      if (!accessToken) {
        return { ok: false, message: "Missing access token from server." };
      }

      setAccessToken(accessToken);
      setToken(accessToken);
      setCookie(ACCESS_TOKEN_COOKIE, accessToken);

      const profile = await fetchProfile();
      setUser(profile);

      return { ok: true };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return {
        ok: false,
        message:
          axiosError.response?.data?.message ||
          "Unable to sign in. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/logout");
    } catch {
      // Logout endpoint is optional; fall back to local cleanup.
    } finally {
      setAccessToken(null);
      setToken(null);
      setUser(null);
      clearCookie(ACCESS_TOKEN_COOKIE);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      setIsLoading(true);
      const cookieToken = getCookie(ACCESS_TOKEN_COOKIE);
      let activeToken = cookieToken;

      if (cookieToken) {
        setAccessToken(cookieToken);
        setToken(cookieToken);
      }

      try {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          activeToken = refreshed;
          setAccessToken(refreshed);
          setToken(refreshed);
          setCookie(ACCESS_TOKEN_COOKIE, refreshed);
        }
      } catch (error) {
        // Keep existing token if refresh fails.
      }

      if (activeToken) {
        const profile = await fetchProfile();
        if (isMounted) setUser(profile);
      } else if (isMounted) {
        setUser(null);
      }

      if (isMounted) setIsLoading(false);
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token),
      login,
      logout,
      refresh,
      setUser,
    }),
    [user, token, isLoading, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
