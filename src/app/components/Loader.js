"use client";
import Image from "next/image";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function Loader() {
  // Dark mode from Redux
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen gap-6 transition-colors duration-300
        ${isDarkMode ? "bg-[#0A192F] text-white" : "bg-gray-50 text-gray-900"}
      `}
    >
      {/* Logo (static) */}
      <Image
        src="/logo.png" // replace with your logo path
        alt="Mediconnect Logo"
        width={100}
        height={100}
        className="rounded-xl"
      />

      {/* Title (static) */}
      <h1 className="text-2xl font-bold tracking-wide">
        Mediconnection
      </h1>

      {/* Animated Line Loader */}
      <div
        className={`relative w-[200px] h-1 rounded-full overflow-hidden ${
          isDarkMode ? "bg-gray-700" : "bg-gray-300"
        }`}
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 1.2,
            ease: "linear",
          }}
          className={`absolute top-0 left-0 h-full w-1/2 rounded-full ${
            isDarkMode ? "bg-cyan-400" : "bg-blue-500"
          }`}
        />
      </div>
    </div>
  );
}
