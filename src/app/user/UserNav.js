'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "@/store/themeSlice";
import { usePathname } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";
import { Sun, Moon, Menu, X, LogOut, LogIn } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const dispatch = useDispatch();
  const pathname = usePathname();

  const { user, signOut } = useAuth(); // get user info & logout
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
      className={`fixed top-0 w-full z-50 transition-all duration-300  py-3 px-4 
        ${isDarkMode ? "bg-[#0A192F] text-[#F8F8F8]" : "bg-cyan-200 text-[#0A192F]"}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link href="/user" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Mediconnect" width={52} height={52} />
          <span className="text-xl font-bold">Mediconnection</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={`hidden md:flex items-center gap-2 p-2 rounded-full ${isDarkMode ? "bg-black" : "bg-white/30"}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`relative px-4 py-2 rounded-full transition-all duration-300 
                ${pathname === item.path ? 
                  (isDarkMode ? "bg-cyan-500/20 text-cyan-400" : "bg-white text-[#1ba5e5]") 
                  : "hover:bg-white/10"} hover:scale-105 hover:shadow-md`}
            >
              {item.name}
              {pathname === item.path && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
              )}
            </Link>
          ))}
        </div>

        {/* Right-side buttons (Desktop only) */}
        <div className="hidden md:flex justify-between items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="rounded-full p-2"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-black-500" />
            )}
          </button>

          {/* Auth Button */}
          {user ? (
            <button
              onClick={signOut}
              className="flex items-center gap-2 border-4 border-red-500 bg-white text-red-500 px-4 py-1 rounded-full transition-all duration-300 hover:bg-red-500 hover:text-white"
            >
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 border-4 border-cyan-400 bg-white text-black px-3 py-1 rounded-full transition-all duration-300 hover:bg-cyan-400 hover:text-white"
            >
              <LogIn size={18} /> Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className={`md:hidden p-2 rounded-full transition-all duration-300
            ${isDarkMode ? "hover:bg-cyan-500/20" : "hover:bg-white/30"}`}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          className={`absolute top-16 right-4 w-64 p-4 rounded-2xl shadow-xl transition-all duration-300 
            border backdrop-blur-sm transform origin-top-right
            ${isDarkMode ? 
              "bg-[#0A192F]/90 text-[#F8F8F8] border-cyan-500" : 
              "bg-white/90 text-[#0A192F] border-gray-900"}`}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block text-center px-4 py-3 my-2 rounded-xl transition-all duration-300 
                ${pathname === item.path ?
                  (isDarkMode ? "bg-cyan-500/20 text-cyan-400" : "bg-[#1ba5e5]/10 text-[#1ba5e5]") :
                  "hover:bg-cyan-500/10"} hover:scale-105 hover:shadow-md`}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Dark Mode Toggle */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="w-full flex items-center justify-center gap-2 border border-cyan-400 bg-white text-black px-4 py-2 rounded-lg mt-4 transition-all duration-300 hover:bg-cyan-400 hover:text-white"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Mobile Auth Button */}
          {user ? (
            <button
              onClick={() => { signOut(); setMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 border border-red-500 bg-white text-red-500 px-4 py-2 rounded-lg mt-2 transition-all duration-300 hover:bg-red-500 hover:text-white"
            >
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <Link
              href="/auth"
              className="w-full flex items-center justify-center gap-2 border border-cyan-400 bg-white text-black px-4 py-2 rounded-lg mt-2 transition-all duration-300 hover:bg-cyan-400 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              <LogIn size={18} /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
