"use client";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const teamMembers = [
  { name: "Deepak Prasad", role: "Full Stack Developer" }
];

const techStack = [
  ["Next.js (Frontend)", "./next.svg"],
  ["Express.js (Backend)", "./express.svg"],
  ["Supabase (Database & Auth)", "./supabase.svg"],
  ["Tailwind CSS (Styling)", "./tailwind.svg"],
  ["Redux (State Management)", "./redux.svg"],
  ["Razorpay (Payments)", "./razorpay.svg"],
  ["Google Meet API (Live Consultations)", "./google-meet.svg"],
  ["Nodemailer (Email Notifications)", "./nodemailer.svg"],
  ["Framer Motion (Animations)", "./framer-motion.svg"],
];

export default function About() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div className={`mt-10 min-h-screen px-6 py-12  md:px-16 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Page Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-2xl sm:text-4xl font-bold text-center my-8"
      >
        🚀 About <span className="text-cyan-500">MediConnect</span>
      </motion.h1>

      {/* The Journey Section */}
      <motion.section
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-3xl mx-auto text-center"
      >
        <p className="text-lg mb-6">
          MediConnect began as a PHP-based capstone project by students of IIT Patna. As the demand for
          a modern healthcare platform grew, the project transformed into a Next.js-powered web application,
          providing seamless appointment booking, online consultations, and medical record management.
        </p>
      </motion.section>

      {/* Team Members */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center mt-10"
      >
        <h2 className="text-2xl font-semibold mb-4">👨‍💻 Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-lg shadow-lg  ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
            >
              <h3 className="text-lg font-bold">{member.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tech Stack Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-14"
      >
        <h2 className="text-2xl font-semibold text-center">⚙️ Tech Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-lg shadow-md  ${isDarkMode ? "bg-gray-800" : "bg-gray-100"} text-center flex items-center justify-center gap-4`}
            >
              <img src={tech[1]} alt={tech[0]} className="w-10 h-10 rounded-full" />
              <span>{tech[0]}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Approval Process */}
      <motion.section className="mt-14">
        <h2 className="text-2xl font-semibold text-center">🏥 Health Center Approval</h2>
        <p className="text-center text-lg mt-2">
          Before listing, our Super Admin (Developer) verifies:
        </p>
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          {["HCRN & HFC Verification", "License & Document Review", "Admin Panel Access"].map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
            >
              {step}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Booking Process */}
      <motion.section className="mt-14">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">📍 Easy Slot Booking</h2>
        <p className="text-center text-lg mt-2">
          Enter your pincode, choose a date, and book an appointment within seconds!
        </p>
      </motion.section>

      {/* Live Consultations */}
      <motion.section className="mt-14">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">🩺 Live Doctor Consultations</h2>
        <p className="text-center text-lg mt-2">
          Get an instant Google Meet link and consult specialists online!
        </p>
      </motion.section>

      {/* 4-Portals Section */}
      <motion.section className="mt-14">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">🌍 The MediConnect Ecosystem</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6 text-center">
          {[
            { title: "User Site", color: "bg-blue-500" },
            { title: "Health Center Admin", color: "bg-green-500" },
            { title: "Doctor Portal", color: "bg-yellow-500" },
            { title: "Super Admin", color: "bg-red-500" },
          ].map((portal, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-lg shadow-lg text-white ${portal.color}`}
            >
              {portal.title}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Future Vision */}
      <motion.section className="mt-14">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">🚀 The Future of MediConnect</h2>
        <p className="text-center text-lg mt-2">
          AI-powered health recommendations, wearable device integration, and more!
        </p>
      </motion.section>

      {/* Footer */}
      <motion.footer className="mt-16 text-center text-gray-500">
        Made with ❤️ by IIT Patna Students
      </motion.footer>
    </div>
  );
}
