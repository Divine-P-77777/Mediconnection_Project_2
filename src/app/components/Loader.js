"use client";

import React, { useEffect, useState } from "react";
import { grid } from "ldrs";
import { useSelector } from "react-redux";

const Loader = () => {
  const [message, setMessage] = useState("Loading...");

  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  
  useEffect(() => {
    grid.register(); // Initialize the grid loader

    // Show "We are willing to catch..." after 5 seconds
    const messageTimeout1 = setTimeout(() => {
      setMessage("We are willing to catch...");
    }, 5000);

    // Show "Server problem. Please try again!" after 10 seconds
    const messageTimeout2 = setTimeout(() => {
      setMessage("Server problem. Please try again!");
    }, 10000);

    return () => {
      clearTimeout(messageTimeout1);
      clearTimeout(messageTimeout2);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-70 backdrop-blur-lg">
      {/* Centered Square Container */}
      <div className={`z-30 w-56 h-56 flex flex-col items-center justify-center ${isDarkMode?"bg-black backdrop-blur-lg":"bg-white backdrop-blur-lg"} shadow-md shadow-purple-300 p-6 rounded-3xl`}>
        {/* Spinner */}
        <l-grid
          size="55"
          stroke="4"
          stroke-length="0.15"
          bg-opacity="0.1"
          speed="1.3"
          color="purple"
        ></l-grid>

        {/* Dynamic Message */}
        <p className={`mt-4 text-lg font-semibold text-gray-800 animate-pulse ${isDarkMode?"text-purple-200 backdrop-blur-lg":"text-purple-950"}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default Loader;
