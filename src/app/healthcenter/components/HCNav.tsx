"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { toggleDarkMode } from "@/store/themeSlice";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";
import { useAppDispatch } from "@/store/hooks";

type NavItem =
  | { name: string; path: string }
  | { name: string; onClick: () => Promise<void> | void };

const HCNav = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const { session, signOut } = useAuth();
  const isLoggedIn = Boolean(session);

  const handleLogout = async (): Promise<void> => {
    await signOut();
  };

  const navItems: NavItem[] = [
    { name: "Home", path: "/healthcenter" },
    { name: "Appointment Requests", path: "/healthcenter/manageappointments" },
    { name: "Manage Center", path: "/healthcenter/managecenter" },
    { name: "Doctors", path: "/healthcenter/managedoctors" },
    { name: "Profile", path: "/healthcenter/profile" },
    ...(isLoggedIn
      ? [{ name: "Logout", onClick: handleLogout }]
      : [{ name: "Login", path: "/auth/healthcenter" }]),
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 py-3 px-4
        ${isDarkMode
          ? "bg-[#0A192F] text-white"
          : "bg-gradient-to-r from-cyan-100 via-cyan-200 to-cyan-300 text-gray-900"
        }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/healthcenter"
          className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-lg border hover:border-cyan-400 transition-all duration-300"
          />
          <span className="text-lg md:text-xl font-extrabold tracking-wide hover:text-cyan-500">
            Mediconnection
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div
          className={`hidden md:flex items-center gap-2 p-2 rounded-full
            ${isDarkMode ? "bg-black/30" : "bg-white/40 backdrop-blur-sm"}`}
        >
          {navItems.map((item) =>
            "onClick" in item ? (
              <button
                key={item.name}
                onClick={item.onClick}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300
                  ${isDarkMode
                    ? "hover:bg-red-500/20 text-red-400"
                    : "hover:bg-red-100 text-red-600"
                  } hover:scale-105`}
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-4 py-2 rounded-full font-medium transition-all duration-300
                  ${pathname === item.path
                    ? isDarkMode
                      ? "bg-cyan-600/20 text-cyan-400"
                      : "bg-white text-cyan-600 shadow-md"
                    : "hover:bg-cyan-100/40"
                  }
                  hover:scale-105`}
              >
                {item.name}
                {pathname === item.path && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-500" />
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
              <Sun size={26} className="text-cyan-100 hover:text-cyan-200" />
            ) : (
              <Moon size={26} className="text-gray-800 hover:text-gray-900" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`md:hidden p-2 rounded-full transition-all duration-300
              ${isDarkMode ? "hover:bg-cyan-500/20" : "hover:bg-cyan-100/50"}`}
          >
            <Image
              src={menuOpen ? "/close.svg" : "/menu.svg"}
              alt="Menu"
              width={28}
              height={28}
              className="hover:scale-110 transition-transform duration-300"
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          className={`absolute top-16 right-4 w-64 p-4 rounded-2xl shadow-lg transition-all duration-300
            border backdrop-blur-md
            ${isDarkMode
              ? "bg-[#0A192F]/95 text-white border-cyan-500"
              : "bg-white/95 text-gray-900 border-cyan-400"
            }`}
        >
          {navItems.map((item) =>
            "onClick" in item ? (
              <button
                key={item.name}
                onClick={() => {
                  item.onClick();
                  setMenuOpen(false);
                }}
                className={`block w-full text-center px-4 py-3 my-2 rounded-xl font-medium transition-all duration-300
                  ${isDarkMode
                    ? "hover:bg-red-500/20 text-red-400"
                    : "hover:bg-red-100 text-red-600"
                  }`}
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMenuOpen(false)}
                className={`block text-center px-4 py-3 my-2 rounded-xl font-medium transition-all duration-300
                  ${pathname === item.path
                    ? isDarkMode
                      ? "bg-cyan-600/20 text-cyan-400"
                      : "bg-cyan-100 text-cyan-700"
                    : "hover:bg-cyan-100/50"
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

export default HCNav;
