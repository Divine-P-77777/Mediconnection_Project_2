"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleDarkMode } from "@/store/themeSlice";
import {
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  LogIn,
  ShieldCheck,
  FileText,
} from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: "Home", path: "/user" },
    { name: "Book Appointment", path: "/user/book" },
    { name: "Download", path: "/user/download" },
    { name: "Live Consult", path: "/user/consult" },
    { name: "About Us", path: "/user/about" },
    { name: "Contact Us", path: "/user/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 py-3 px-4 ${isDarkMode
          ? "bg-[#0A192F]/95 text-[#F8F8F8] backdrop-blur-lg"
          : "bg-cyan-100/90 text-[#0A192F] backdrop-blur-lg shadow-md"
        }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/user" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Mediconnect"
            width={50}
            height={50}
            className="rounded-xl"
          />
          <span className="text-xl font-bold tracking-tight">
            Mediconnection
          </span>
        </Link>

        <div
          className={`hidden md:flex items-center gap-1 p-1 rounded-full ${isDarkMode ? "bg-[#030B17]" : "bg-white/40"
            }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname === item.path
                  ? isDarkMode
                    ? "bg-cyan-600/20 text-cyan-400"
                    : "bg-white text-[#00A8E8]"
                  : "hover:bg-white/10"
                } hover:scale-105`}
            >
              {item.name}
              {pathname === item.path && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="rounded-full p-2 transition-all hover:scale-110"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {user ? (
            <button
              onClick={signOut}
              className="flex items-center gap-2 border-2 border-red-500 bg-white text-red-500 px-4 py-1 rounded-full text-sm font-medium hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 border-2 border-cyan-400 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium hover:bg-cyan-400 hover:text-white transition-all"
            >
              <LogIn size={16} /> Login
            </Link>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={`md:hidden p-2 rounded-full transition-all duration-300 ${isDarkMode
              ? "hover:bg-cyan-500/20"
              : "hover:bg-cyan-200/60"
            }`}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <div
          className={`absolute top-16 right-4 w-72 p-5 rounded-2xl border shadow-lg backdrop-blur-lg ${isDarkMode
              ? "bg-[#0A192F]/95 text-white border-cyan-700"
              : "bg-white/95 text-gray-900 border-cyan-300"
            }`}
        >
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block text-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === item.path
                    ? isDarkMode
                      ? "bg-cyan-600/20 text-cyan-400"
                      : "bg-cyan-100 text-[#00A8E8]"
                    : "hover:bg-cyan-500/10"
                  }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div
            className={`my-3 border-t ${isDarkMode ? "border-cyan-800" : "border-cyan-300"
              }`}
          />

          <div className="flex flex-col gap-2">
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isDarkMode
                  ? "bg-cyan-800 text-white hover:bg-cyan-700"
                  : "bg-cyan-100 text-[#00A8E8] hover:bg-cyan-200"
                }`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>

            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 border border-red-500 bg-white text-red-500 px-4 py-2 rounded-lg mt-2 font-medium hover:bg-red-500 hover:text-white transition-all"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 border border-cyan-400 bg-white text-gray-800 px-4 py-2 rounded-lg mt-2 font-medium hover:bg-cyan-400 hover:text-white transition-all"
              >
                <LogIn size={18} /> Login
              </Link>
            )}
          </div>

          <div
            className={`mt-4 pt-3 flex justify-center items-center gap-6 text-xs font-medium border-t ${isDarkMode
                ? "border-cyan-800 text-gray-300"
                : "border-cyan-300 text-gray-600"
              }`}
          >
            <Link
              href="/terms"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1 hover:text-cyan-400"
            >
              <ShieldCheck size={14} /> Terms
            </Link>
            <Link
              href="/privacy"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1 hover:text-cyan-400"
            >
              <FileText size={14} /> Privacy
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
