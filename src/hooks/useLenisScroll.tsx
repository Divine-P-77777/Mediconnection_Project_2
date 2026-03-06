"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { isBrowser, safeQuerySelector, safeWindow } from "@/utils/browser";


interface LenisScrollContextType {
  scroll: Lenis | null;
  setScroll: React.Dispatch<React.SetStateAction<Lenis | null>>;
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

interface LenisScrollProviderProps {
  children: ReactNode;
}


const LenisScrollContext = createContext<LenisScrollContextType | undefined>(
  undefined
);


export const useLenisScroll = (): LenisScrollContextType => {
  const context = useContext(LenisScrollContext);
  if (!context) {
    throw new Error(
      "useLenisScroll must be used within a LenisScrollProvider"
    );
  }
  return context;
};

export const LenisScrollProvider = ({
  children,
}: LenisScrollProviderProps) => {
  const [scroll, setScroll] = useState<Lenis | null>(null);
  const [activeSection, setActiveSection] = useState<string>("home");

  const pathname = usePathname();
  const rafRef = useRef<number | null>(null);


  useEffect(() => {
    if (!isBrowser() || pathname !== "/") {
      scroll?.destroy();
      setScroll(null);
      setActiveSection("home");
      return;
    }

    const scrollContainer = safeQuerySelector(
      "[data-scroll-container]"
    ) as HTMLElement | null;

    if (!scrollContainer) return;

    scroll?.destroy();

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),


      orientation: "vertical",              // scroll direction
      gestureOrientation: "vertical",       // gesture input direction

      smoothWheel: true,                    // smooth wheel
      touchMultiplier: 1.3,                 // touch speed multiplier
    });

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);
    setScroll(lenis);

    /* ---------- Hash Navigation ---------- */
    const handleHash = () => {
      const hash = safeWindow?.location?.hash;
      if (!hash) return;

      const section = hash.substring(1);
      setActiveSection(section);
      lenis.scrollTo(hash, { offset: -50 });
    };

    safeWindow?.addEventListener("hashchange", handleHash);
    handleHash();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      safeWindow?.removeEventListener("hashchange", handleHash);
      lenis.destroy();
      setScroll(null);
    };
  }, [pathname]);

  /* ---------- Resize Handling ---------- */
  useEffect(() => {
    if (!isBrowser() || !scroll) return;

    const updateScroll = () => scroll.resize();

    safeWindow?.addEventListener("resize", updateScroll);
    safeWindow?.addEventListener("orientationchange", updateScroll);

    return () => {
      safeWindow?.removeEventListener("resize", updateScroll);
      safeWindow?.removeEventListener("orientationchange", updateScroll);
    };
  }, [scroll]);

  /* ---------- Provider ---------- */
  return (
    <LenisScrollContext.Provider
      value={{ scroll, setScroll, activeSection, setActiveSection }}
    >
      {children}
    </LenisScrollContext.Provider>
  );
};
