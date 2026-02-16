"use client";

import { useEffect } from "react";
import { refreshAccessToken, setAccessToken } from "@/lib/api";

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
