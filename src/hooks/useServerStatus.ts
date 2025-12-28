"use client";

import { useEffect, useState } from "react";

export function useServerStatus(): boolean {
  const [serverDown, setServerDown] = useState<boolean>(false);
  const [failureCount, setFailureCount] = useState<number>(0);

  useEffect(() => {
    const checkServer = async (): Promise<void> => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`;

        const res = await fetch(url, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
          },
        });

        if (!res.ok && res.status !== 404) {
          throw new Error(`HTTP ${res.status}`);
        }

        // ✅ success
        setFailureCount(0);
        setServerDown(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Supabase connection checking...", err.message);
        } else {
          console.error("Supabase connection checking...", err);
        }

        setFailureCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setServerDown(true);
          }
          return newCount;
        });
      }
    };

    checkServer();

    const interval: number = window.setInterval(checkServer, 30_000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return serverDown;
}
