"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleDarkMode } from "@/store/themeSlice";
import { getRoleDashboardUrl } from "@/lib/role-redirect";
import {
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  LogIn,
  ShieldCheck,
  FileText,
  ChevronDown,
  Stethoscope,
  Building2,
  ShieldAlert,
  User as UserIcon,
  LayoutDashboard,
} from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { user, role, signOut } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setPortalDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Home", path: "/user" },
    { name: "Book Appointment", path: "/user/book" },
    { name: "Download", path: "/user/download" },
    { name: "Live Consult", path: "/user/consult" },
    { name: "About Us", path: "/user/about" },
    { name: "Contact Us", path: "/user/contact" },
  ];

  const portals = [
    { name: "Patient Portal", href: "/auth", icon: UserIcon, desc: "Book & consult doctors" },
    { name: "Doctor Portal", href: "/auth/doctor", icon: Stethoscope, desc: "Doctor workspace & consults" },
    { name: "Health Center Portal", href: "/auth/healthcenter", icon: Building2, desc: "Manage clinic OPD & slots" },
    { name: "Admin Portal", href: "/auth/admin", icon: ShieldAlert, desc: "System administration" },
  ];

  const getRoleLabel = () => {
    switch (role) {
      case "doctor":
        return "Doctor";
      case "health_center":
        return "Health Center";
      case "super_admin":
        return "Admin";
      default:
        return "Patient";
    }
  };

  const dashboardUrl = getRoleDashboardUrl(role);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 py-3 px-4 ${
        isDarkMode
          ? "bg-[#0A192F]/95 text-[#F8F8F8] backdrop-blur-lg border-b border-cyan-900/40"
          : "bg-cyan-100/90 text-[#0A192F] backdrop-blur-lg shadow-md border-b border-cyan-200"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link href="/user" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="MediConnection"
            width={44}
            height={44}
            className="rounded-2xl shadow-sm hover:scale-105 transition-transform"
          />
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            MediConnection
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div
          className={`hidden md:flex items-center gap-1 p-1 rounded-[2rem] shadow-sm ${
            isDarkMode ? "bg-[#030B17]/80 border border-slate-800" : "bg-white/70 border border-cyan-200/60"
          }`}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? isDarkMode
                      ? "text-cyan-400 font-semibold"
                      : "text-white font-semibold"
                    : isDarkMode
                    ? "text-slate-300 hover:text-white hover:bg-white/5"
                    : "text-slate-700 hover:text-cyan-700 hover:bg-cyan-50/50"
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {isActive && (
                  <span
                    className={`absolute inset-0 rounded-full ${
                      isDarkMode
                        ? "bg-cyan-500/20 border border-cyan-500/30"
                        : "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md"
                    } -z-0`}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Switcher */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            aria-label="Toggle Dark Mode"
            className={`rounded-full p-2.5 transition-all hover:scale-110 ${
              isDarkMode ? "hover:bg-cyan-950/40" : "hover:bg-cyan-200/50"
            }`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Role Dashboard Shortcut */}
              <Link
                href={dashboardUrl}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:scale-105 transition-all shadow-sm"
              >
                <LayoutDashboard size={15} />
                <span>{getRoleLabel()} Dashboard</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 border border-red-500/20 bg-red-500/10 px-4 py-2 rounded-full text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setPortalDropdownOpen((v) => !v)}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-cyan-500/30 hover:shadow-lg transition-all hover:scale-105"
              >
                <LogIn size={16} />
                <span>Sign In / Portals</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${portalDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {portalDropdownOpen && (
                <div
                  className={`absolute right-0 mt-3 w-72 rounded-2xl p-2.5 shadow-2xl border backdrop-blur-xl z-50 ${
                    isDarkMode
                      ? "bg-[#0A192F]/95 border-cyan-900/60 text-white shadow-black/60"
                      : "bg-white/95 border-cyan-200 text-gray-900 shadow-cyan-900/15"
                  }`}
                >
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-500">
                    Select Your Portal
                  </div>
                  <div className="flex flex-col gap-1">
                    {portals.map((p) => {
                      const Icon = p.icon;
                      return (
                        <Link
                          key={p.href}
                          href={p.href}
                          onClick={() => setPortalDropdownOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                            isDarkMode
                              ? "hover:bg-cyan-950/40 text-slate-200 hover:text-white"
                              : "hover:bg-cyan-50 text-slate-800 hover:text-cyan-700"
                          }`}
                        >
                          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/15 to-blue-500/15 text-cyan-500">
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{p.name}</p>
                            <p className="text-xs opacity-70">{p.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Open Navigation Menu"
          className={`md:hidden p-2 rounded-full transition-all duration-300 ${
            isDarkMode ? "hover:bg-cyan-500/20" : "hover:bg-cyan-200/60"
          }`}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div
          className={`absolute top-20 right-4 left-4 p-5 rounded-3xl border shadow-2xl backdrop-blur-xl md:hidden ${
            isDarkMode
              ? "bg-[#0A192F]/95 text-white border-cyan-900/50 shadow-black/80"
              : "bg-white/95 text-gray-900 border-cyan-200 shadow-xl"
          }`}
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block text-center px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  pathname === item.path
                    ? isDarkMode
                      ? "bg-cyan-900/40 text-cyan-400 font-semibold"
                      : "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-600 font-semibold"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className={`my-3 border-t ${isDarkMode ? "border-cyan-800/40" : "border-cyan-200"}`} />

          {/* Portals in Mobile */}
          {!user && (
            <div className="mb-3">
              <p className="text-xs uppercase font-semibold text-cyan-500 mb-2 text-center">Portals & Sign In</p>
              <div className="grid grid-cols-2 gap-2">
                {portals.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isDarkMode ? "bg-slate-800/80 text-slate-200 hover:bg-slate-800" : "bg-cyan-50 text-cyan-800 hover:bg-cyan-100"
                    }`}
                  >
                    <p.icon size={15} className="text-cyan-500" />
                    <span>{p.name.replace(" Portal", "")}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-medium transition-all text-sm ${
                isDarkMode
                  ? "bg-slate-800 text-white hover:bg-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
              <span>{isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
            </button>

            {user ? (
              <>
                <Link
                  href={dashboardUrl}
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-md"
                >
                  <LayoutDashboard size={16} />
                  <span>Go to {getRoleLabel()} Dashboard</span>
                </Link>

                <button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 px-4 py-2.5 rounded-2xl text-sm font-semibold hover:bg-red-500 hover:text-white transition-all"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : null}
          </div>

          <div
            className={`mt-4 pt-3 flex justify-center items-center gap-6 text-xs font-medium border-t ${
              isDarkMode ? "border-cyan-800/40 text-gray-400" : "border-cyan-200 text-gray-600"
            }`}
          >
            <Link href="/terms" onClick={() => setMenuOpen(false)} className="flex items-center gap-1 hover:text-cyan-400">
              <ShieldCheck size={14} /> Terms
            </Link>
            <Link href="/privacy" onClick={() => setMenuOpen(false)} className="flex items-center gap-1 hover:text-cyan-400">
              <FileText size={14} /> Privacy
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
