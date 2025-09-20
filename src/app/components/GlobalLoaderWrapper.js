// /app/components/GlobalLoaderWrapper.jsx
"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "./Loader";

export default function GlobalLoaderWrapper({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 600); 

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {loading && (
          <Loader />
      )}
      {children}
    </>
  );
}
