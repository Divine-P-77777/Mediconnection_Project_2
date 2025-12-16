import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";

export function useServerStatus() {
  const [serverDown, setServerDown] = useState(false);
  const [failureCount, setFailureCount] = useState(0);

  useEffect(() => {
    const checkServer = async () => {
      try {
        // Just test a trivial RPC call instead of querying a table
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
        });

        if (!res.ok && res.status !== 404) throw new Error(`HTTP ${res.status}`);

        // Success: Reset failures and ensure server is marked up
        setFailureCount(0);
        setServerDown(false);
      } catch (err) {
        console.error("Supabase connection checking...", err.message);
        setFailureCount((prev) => {
          const newCount = prev + 1;
          // Only mark server down after 3 consecutive failures
          if (newCount >= 3) {
            setServerDown(true);
          }
          return newCount;
        });
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  return serverDown;
}
