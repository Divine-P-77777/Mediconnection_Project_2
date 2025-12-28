"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";

const AdminFoot = () => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <footer
      className={`w-full py-6 px-4 sm:px-20 transition-all duration-300 ${isDarkMode ? "bg-[#091624] text-[#F8F8F8]" : "bg-[#F5F9FF] text-[#0A192F]"
        }`}
    >
      {/* Footer Content */}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        {/* Logo & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
          {/* Logo */}
          <Image
            src="/logo.png"
            width={64}
            height={64}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl border border-[#00A8E8]"
            alt="Mediconnect Logo"
          />

          {/* Name & Copyright */}
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold">Mediconnect</p>
            <p className="text-xs sm:text-sm">
              &copy; {new Date().getFullYear()} Mediconnect.vercel.app
            </p>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="footer-icons flex gap-3 mt-4 sm:mt-0">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg className="h-6 w-6 sm:h-8 sm:w-8  shadow-md shadow-cyan-400 rounded-xl hover:text-pink-500 p-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" />
              <rect x="4" y="4" width="16" height="16" rx="4" />
              <circle cx="12" cy="12" r="3" />
              <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" />
            </svg>
          </a>

          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <svg className="h-6 w-6 sm:h-8 sm:w-8  shadow-md shadow-cyan-400 rounded-xl hover:text-sky-400 p-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
          </a>

          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg className="h-6 w-6 sm:h-8 sm:w-8  hover:text-blue-600 shadow-md shadow-cyan-400 p-1 rounded-xl" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
            </svg>
          </a>

          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg className="h-6 w-6 sm:h-8 sm:w-8  shadow-md shadow-cyan-400 rounded-lg sm:rounded-xl hover:text-blue-400 p-[3px] sm:p-[6px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>
      </div>

      {/* Footer Links */}
      <div className="text-center text-xs sm:text-sm mt-4">
        <Link href="/terms" className="hover:underline mx-2">
          Terms of Service
        </Link>
        <span>|</span>
        <Link href="/privacy" className="hover:underline mx-2">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default AdminFoot;
