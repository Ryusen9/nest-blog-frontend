"use client";

import { useEffect } from "react";
import { refreshAccessToken, setAccessToken } from "@/lib/api";

/**
 * The `AuthBootstrap` function in TypeScript React is responsible for refreshing the access token on
 * mount and handling any errors without affecting user authentication status.
 * @returns null
 */
export default function AuthBootstrap() {
  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const token = await refreshAccessToken();
        if (isMounted && token) {
          setAccessToken(token);
        }
      } catch {
        // Ignore refresh errors on boot; user stays unauthenticated.
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
