import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";

export function useServerStatus() {
  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        // Just test a trivial RPC call instead of querying a table
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
        });

        if (!res.ok && res.status !== 404) throw new Error(`HTTP ${res.status}`);
        setServerDown(false);
      } catch (err) {
        console.error("Supabase connection failed:", err.message);
        setServerDown(true);
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  return serverDown;
}
