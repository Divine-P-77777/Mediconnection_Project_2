"use client";

import { useState, useEffect, JSX } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { Sun, Moon } from "lucide-react";
import { toggleDarkMode } from "@/store/themeSlice";
import { useAuth } from "@/hooks/useAuth";

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */
interface RootState {
  theme: {
    isDarkMode: boolean;
  };
}

type NavItem =
  | { name: string; path: string }
  | { name: string; onClick: () => void };

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */
const AdminNav = (): JSX.Element => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const isDarkMode = useSelector(
    (state: RootState) => state.theme.isDarkMode
  );
  const dispatch = useDispatch();
  const pathname = usePathname();

  const { session, signOut, isSuperAdmin } = useAuth();
  const isLoggedIn = Boolean(session);

  /* ---------- Close menu on route change ---------- */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* ---------- Logout ---------- */
  const handleLogout = async (): Promise<void> => {
    await signOut();
  };

  /* ---------- Nav Items ---------- */
  const navItems: NavItem[] = [
    { name: "Home", path: "/admin" },
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Privacy & Terms", path: "/admin/privacy" },
    { name: "Manage Reports", path: "/admin/reports" },
    ...(isSuperAdmin
      ? [{ name: "Careers", path: "/admin/careers" }]
      : []),
    ...(isLoggedIn
      ? [{ name: "Logout", onClick: handleLogout }]
      : [{ name: "Login", path: "/auth/admin" }]),
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 py-3 px-4 transition-colors ${isDarkMode
          ? "bg-[#0A192F] text-[#F8F8F8]"
          : "bg-cyan-200 text-[#0A192F]"
        }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/admin"
          className="flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Image
            src="/logo.png"
            alt="Mediconnection Logo"
            width={60}
            height={60}
            className="rounded-xl border hover:shadow-lg hover:border-cyan-400 transition-all"
          />
          <span className="text-xl font-bold hover:text-cyan-400 transition-colors">
            Mediconnect
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          className={`hidden md:flex items-center gap-2 p-2 rounded-full ${isDarkMode ? "bg-black" : "bg-white/30"
            }`}
        >
          {navItems.map((item, idx) =>
            "onClick" in item ? (
              <button
                key={`logout-${idx}`}
                onClick={item.onClick}
                className={`px-4 py-2 rounded-full transition-all ${isDarkMode
                    ? "hover:bg-red-500/20 text-red-400"
                    : "hover:bg-red-100 text-red-500"
                  }`}
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-4 py-2 rounded-full transition-all ${pathname === item.path
                    ? isDarkMode
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-white text-[#1ba5e5]"
                    : "hover:bg-white/10"
                  }`}
              >
                {item.name}
                {pathname === item.path && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
                )}
              </Link>
            )
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button onClick={() => dispatch(toggleDarkMode())}>
            {isDarkMode ? (
              <Sun size={28} className="text-cyan-100" />
            ) : (
              <Moon size={28} className="text-gray-900" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className={`md:hidden p-2 rounded-full ${isDarkMode
                ? "hover:bg-cyan-500/20"
                : "hover:bg-white/30"
              }`}
          >
            <Image
              src={menuOpen ? "/close.svg" : "/menu.svg"}
              alt="Menu"
              width={32}
              height={32}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={`absolute top-16 right-4 w-64 p-4 rounded-2xl shadow-xl border backdrop-blur-sm ${isDarkMode
              ? "bg-[#0A192F]/90 text-white border-cyan-500"
              : "bg-white/90 text-black border-gray-900"
            }`}
        >
          {navItems.map((item, idx) =>
            "onClick" in item ? (
              <button
                key={`mobile-logout-${idx}`}
                onClick={() => item.onClick()}
                className={`block w-full px-4 py-3 my-2 rounded-xl ${isDarkMode
                    ? "hover:bg-red-500/20 text-red-400"
                    : "hover:bg-red-100 text-red-500"
                  }`}
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-3 my-2 rounded-xl ${pathname === item.path
                    ? isDarkMode
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-[#1ba5e5]/10 text-[#1ba5e5]"
                    : "hover:bg-cyan-500/10"
                  }`}
              >
                {item.name}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default AdminNav;
