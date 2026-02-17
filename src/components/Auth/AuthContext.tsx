/**
 * The above TypeScript code defines an authentication context provider and hook for managing user
 * authentication in a React application.
 * @property {number | string} id - The `id` property in the `AuthUser` type represents the unique
 * identifier of the user. It can be either a number or a string.
 * @property {string} firstName - The `firstName` property in the `AuthUser` type represents the first
 * name of the authenticated user. It is a string type and is used to store the first name of the user.
 * @property {string} lastName - The `lastName` property in the `AuthUser` type represents the last
 * name of the authenticated user. It is a string type and is used to store the last name of the user
 * in the authentication context.
 * @property {string} email - The code you provided is a React context for managing user
 * authentication. It includes functions for logging in, logging out, refreshing tokens, and fetching
 * user profiles. The `useAuth` hook allows components to access the authentication state.
 * @property {string} avatarUrl - The `avatarUrl` property in the `AuthUser` type represents the URL of
 * the user's avatar image. It is a string type that holds the URL where the user's avatar image can be
 * accessed or displayed. This URL typically points to an image file (e.g., a JPEG or PNG
 * @property {string} bio - The `bio` property in the `AuthUser` type represents a short biography or
 * description of the user. It is a string type field where the user can provide information about
 * themselves, such as their interests, background, or any other relevant details they want to share.
 * @property {string} role - The `role` property in the `AuthUser` type represents the role or
 * permission level of the authenticated user. It is typically used to determine what actions or
 * resources a user can access within an application based on their assigned role.
 */
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

/**
 * The function `normalizeUser` takes an unknown payload and extracts relevant user information to
 * return an `AuthUser` object or null.
 * @param {unknown} payload - The `normalizeUser` function takes a `payload` parameter of type
 * `unknown` and attempts to extract user information from it to create an `AuthUser` object. The
 * function first checks if the `payload` is an object and then tries to find user information within
 * it. It handles different possible
 * @returns The `normalizeUser` function returns an `AuthUser` object or `null`. The `AuthUser` object
 * has properties `id`, `firstName`, `lastName`, `email`, `avatarUrl`, `bio`, and `role`, which are
 * extracted from the `payload` object passed to the function. If the `payload` is not in the expected
 * format or if the necessary properties are not
 */
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

/**
 * The `getCookie` function retrieves the value of a specified cookie by parsing the document's
 * cookies.
 * @param {string} name - The `name` parameter in the `getCookie` function is a string that represents
 * the name of the cookie you want to retrieve from the document's cookies.
 * @returns The `getCookie` function returns the value of the cookie with the specified name if it
 * exists in the document's cookies. If the cookie is found, it decodes and returns the value. If the
 * cookie is not found or if the `document` object is not available (for example, in a non-browser
 * environment), it returns `null`.
 */
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(";").shift() ?? "");
  }
  return null;
};

/**
 * The `setCookie` function sets a cookie with the specified name and value in a TypeScript React
 * environment.
 * @param {string} name - The `name` parameter is a string representing the name of the cookie that you
 * want to set.
 * @param {string} value - The `value` parameter in the `setCookie` function represents the value that
 * you want to store in the cookie. This value can be a string containing any data that you want to
 * save and retrieve later when the cookie is accessed.
 * @returns If the `document` object is not defined (i.e., if the code is running in a non-browser
 * environment), the function will return early and not execute the rest of the code.
 */
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

/* The above code is a TypeScript React function using the `useCallback` hook to handle a login
process. Here is a breakdown of what the code is doing: */
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
