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
            className="rounded-2xl shadow-sm"
          />
          <span className="text-xl font-bold tracking-tight">
            Mediconnection
          </span>
        </Link>

        <div
          className={`hidden md:flex items-center gap-1 p-1 rounded-[2rem] shadow-sm ${isDarkMode ? "bg-[#030B17]/80" : "bg-white/60"
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
              <span className={`relative z-10 ${pathname === item.path && !isDarkMode ? 'text-white font-semibold' : ''}`}>{item.name}</span>
              {pathname === item.path && (
                <span className={`absolute inset-0 rounded-full ${isDarkMode ? "bg-cyan-500/20" : "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md"} -z-0`} />
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
              className="flex items-center gap-2 border-2 border-transparent bg-white/10 px-5 py-2 rounded-full text-sm font-semibold text-red-500 hover:bg-red-50 hover:border-red-500 transition-all shadow-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:shadow-cyan-500/30 hover:shadow-lg transition-all"
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
          className={`absolute top-20 right-4 w-72 p-5 rounded-3xl border shadow-2xl backdrop-blur-xl ${isDarkMode
            ? "bg-[#0A192F]/95 text-white border-cyan-900/50"
            : "bg-white/95 text-gray-900 border-cyan-100"
            }`}
        >
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block text-center px-4 py-3 rounded-2xl text-sm font-medium transition-all ${pathname === item.path
                  ? isDarkMode
                    ? "bg-cyan-900/40 text-cyan-400"
                    : "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-600 font-semibold"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
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
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all ${isDarkMode
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 px-4 py-3 rounded-2xl mt-1 font-semibold hover:bg-red-500 hover:text-white transition-all"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-2xl mt-1 font-semibold hover:shadow-lg transition-all"
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
