"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

const Footer = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <footer
      className={`w-full py-10 px-6 sm:px-20 transition-all duration-300 ${
        isDarkMode
          ? "bg-[#091624] text-[#F8F8F8]"
          : "bg-cyan-200 text-[#0A192F]"
      }`}
    >
      {/* Footer Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

        {/* Logo & About */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col justify-center items-start gap-3">
            <Image
              src="/logo.png"
              width={56}
              height={56}
              className="w-14 h-14 rounded-xl border border-[#00A8E8]"
              alt="Mediconnection Logo"
            />
            <div className="text-xl font-bold">Mediconnection</div>
          </div>
          <p className="text-sm leading-6">
            Connecting patients and doctors seamlessly with trusted healthcare solutions. 
            Your health, our priority.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/user/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/user/contact" className="hover:underline">Contact</Link></li>
            <li><Link href="/careers" className="hover:underline">Careers</Link></li>
            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/user/book" className="hover:underline">Book Appointment</Link></li>
            <li><Link href="/user/consult" className="hover:underline">Live Consult</Link></li>
            <li><Link href="/user/download" className="hover:underline">Download</Link></li>
            <li><Link href="/faq" className="hover:underline">FAQs</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/help" className="hover:underline">Help Center</Link></li>
            <li><Link href="/guides" className="hover:underline">Guides</Link></li>
            <li><Link href="/feedback" className="hover:underline">Feedback</Link></li>
            <li><Link href="/community" className="hover:underline">Community</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/payment" className="hover:underline">Payment Policy</Link></li>
            <li><Link href="/refund" className="hover:underline">Refund Policy</Link></li>
            <li><Link href="/cancellation" className="hover:underline">Cancellation</Link></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Social Icons */}
        <div className="flex gap-3">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg className="h-7 w-7 shadow-md shadow-cyan-400 rounded-lg hover:text-pink-500 p-1" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
              <rect x="4" y="4" width="16" height="16" rx="4" />
              <circle cx="12" cy="12" r="3" />
              <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" />
            </svg>
          </a>

          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <svg className="h-7 w-7 shadow-md shadow-cyan-400 rounded-lg hover:text-sky-400 p-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
            </svg>
          </a>

          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg className="h-7 w-7 shadow-md shadow-cyan-400 rounded-lg hover:text-blue-600 p-1" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
              <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
            </svg>
          </a>

          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg className="h-7 w-7 shadow-md shadow-cyan-400 rounded-lg hover:text-blue-400 p-1" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs sm:text-sm text-center">
          &copy; {new Date().getFullYear()} Mediconnection.vercel.app — All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
