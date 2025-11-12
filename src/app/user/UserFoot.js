"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  CalendarCheck,
  Video,
  FileDown,
} from "lucide-react";

const Footer = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: <Home size={22} />, link: "/user" },
    { name: "Book", icon: <CalendarCheck size={22} />, link: "/user/book" },
    { name: "Consult", icon: <Video size={22} />, link: "/user/consult" },
    { name: "Download", icon: <FileDown size={22} />, link: "/user/download" },
  ];

  return (
    <>
      {/* 🌐 Desktop Footer */}
      <footer
        className={`hidden md:block w-full py-10 px-6 sm:px-20 transition-all duration-300 ${
          isDarkMode
            ? "bg-[#091624] text-[#F8F8F8]"
            : "bg-cyan-200 text-[#0A192F]"
        }`}
      >
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
              Connecting patients and doctors seamlessly with trusted healthcare
              solutions. Your health, our priority.
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
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500 transition-all">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-sky-400 transition-all">
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600 transition-all">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-400 transition-all">
              <i className="fab fa-linkedin text-xl"></i>
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs sm:text-sm text-center">
            &copy; {new Date().getFullYear()} Mediconnection.vercel.app — All rights reserved.
          </p>
        </div>
      </footer>

      {/* 📱 Mobile Bottom Nav */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center border-t transition-all duration-300 ${
          isDarkMode
            ? "bg-[#091624] text-white border-cyan-900"
            : "bg-cyan-100 text-[#0A192F] border-cyan-300"
        } py-2`}
      >
        {navItems.map((item) => {
          const active = pathname === item.link;
          return (
            <Link
              href={item.link}
              key={item.name}
              className="flex flex-col items-center relative group"
            >
              <div
                className={`transition-all duration-300 ${
                  active ? "text-[#00A8E8]" : "opacity-80"
                }`}
              >
                {item.icon}
              </div>
              <span className="text-xs mt-1">{item.name}</span>
              {active && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#00A8E8] rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Footer;
