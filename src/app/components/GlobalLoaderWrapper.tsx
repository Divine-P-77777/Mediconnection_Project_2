"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "./Loader";

/* ================= TYPES ================= */

interface GlobalLoaderWrapperProps {
  children: ReactNode;
}

/* ================= COMPONENT ================= */

const GlobalLoaderWrapper: FC<GlobalLoaderWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect((): (() => void) => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  );
};

export default GlobalLoaderWrapper;
