"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "./store/themeSlice";
import Image from "next/image";

const Page = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div className={`w-screen min-h-screen flex flex-col transition-all duration-300 relative
      ${isDarkMode ? "bg-[#0A192F] text-white" : "bg-gray-100 text-black"}`}>

      {/* 🌟 Navbar */}
      <nav className={`w-full py-4 px-6 fixed top-0 flex justify-between items-center shadow-md z-50 
        ${isDarkMode ? "bg-[#091624] text-white" : "bg-[#1ba5e5] text-black"}`}>
        <h1 className="text-2xl font-bold">Mediconnect</h1>
        <div className="flex items-center gap-6">
          <Link href="/about" className="text-lg font-semibold hover:underline">About Us</Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="rounded-full transition-all duration-300 focus:outline-none"
          >
            <Image
              src={isDarkMode ? "/sun.png" : "/moon.png"}
              alt="Theme Toggle"
              width={32}
              height={32}
              className="rounded-full border border-gray-300"
            />
          </button>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="w-full flex flex-col items-center pt-24 px-4">

        {/* 🏠 Welcome Section */}
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Mediconnect</h1>
          <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
            Seamlessly manage appointments, consultations, and administration across multiple platforms.
          </p>
        </div>

        {/* 🌟 Four Boxes for Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10  w-full py-10 mb-20 ">
          {[
            { name: "User Dashboard", path: "/user", img: "/user.png" },
            { name: "Admin Dashboard", path: "/admin", img: "/admin.png" },
            { name: "Doctor Dashboard", path: "/doctor", img: "/doctor.png" },
            { name: "Developer Dashboard", path: "/developer", img: "/developer.png" },
          ].map((item) => (
            <Link key={item.path} href={item.path} className={`group flex flex-col items-center justify-center 
              p-6 rounded-xl transition-transform duration-300 hover:scale-105 
              ${isDarkMode ? "bg-[#0A192F] shadow-cyan-400 shadow-sm hover:shadow-lg" : "bg-white shadow-lg"}`}>
              <Image src={item.img} alt={item.name} width={60} height={60} className="mb-3" />
              <h2 className="text-lg font-semibold group-hover:text-[#1ba5e5]">{item.name}</h2>
            </Link>
          ))}
        </div>
      </div>

      {/* 🌟 Footer */}
      <footer className={`w-full py-4  absolute bottom-0 mt-10 text-center shadow-md 
        ${isDarkMode ? "bg-[#091624] text-white" : "bg-[#1ba5e5] text-black"}`}>
        <p className="text-sm">&copy; {new Date().getFullYear()} Mediconnect. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Page;
