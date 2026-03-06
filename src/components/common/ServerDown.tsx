"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";

const ServerDownPage = () => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center text-center transition-colors duration-500 ${isDarkMode ? "bg-blue-950 text-white" : "bg-cyan-50 text-gray-900"
        }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="p-8 rounded-2xl shadow-lg max-w-lg w-full"
        style={{
          backgroundColor: isDarkMode ? "#0f172a" : "#e0f7fa",
        }}
      >
        <div className="w-full flex justify-center mb-6">
          <Image
            src="/server-down.gif"
            alt="Server Down"
            width={250}
            height={250}
            className="rounded-xl"
          />
        </div>

        <h1
          className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-yellow-300" : "text-blue-700"
            }`}
        >
          Server Temporarily Down 😔
        </h1>

        <p
          className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"
            } text-lg`}
        >
          Our server seems to be taking a nap.
          Please check back later or contact us below.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="mailto:support@deepakprasad.xyz"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isDarkMode
                ? "bg-green-600 hover:bg-green-500 text-white"
                : "bg-green-500 hover:bg-green-400 text-white"
              }`}
          >
            <Mail size={18} />
            Email Support
          </a>

          <a
            href="https://linkedin.com/in/dynamicphillic"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isDarkMode
                ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                : "bg-yellow-400 hover:bg-yellow-300 text-black"
              }`}
          >
            <Linkedin size={18} />
            LinkedIn
          </a>
        </div>
      </motion.div>

      <p
        className={`mt-8 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
      >
        © {new Date().getFullYear()} Deepak Prasad. All rights reserved.
      </p>
    </div>
  );
};

export default ServerDownPage;
