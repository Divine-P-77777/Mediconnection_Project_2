"use client";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const technologies = [
  ["Next.js", "./next.svg"],
  ["Supabase", "./supabase.svg"],
  ["Tailwind CSS", "./tailwind.svg"],
  ["Redux", "./redux.svg"],
  ["Cashfree", "./cashfree.svg"],
  ["ZegoCloud", "./zegocloud.svg"],
  ["Framer Motion", "./framer-motion.svg"],
];

export default function About() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const bg = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black";
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-100";

  return (
    <div className={`w-full ${bg}`}>
      {/* Hero Section */}
      <section className={`min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-16 bg-[url('/healthcare-hero.jpg')] bg-cover bg-center`}>
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6 backdrop-blur-sm p-4 rounded-lg"
        >
          Welcome to <span className={`${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}>MediConnection</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl text-lg md:text-xl backdrop-blur-sm bg-black/30 p-4 rounded-lg"
        >
          A seamless way to book health appointments, consult doctors live, and manage your medical records—all in one place.
        </motion.p>
      </section>

      {/* Easy Booking Section */}
      <section className={`min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 px-6 md:px-16`}>
        <img src="https://images.pexels.com/photos/5998475/pexels-photo-5998475.jpeg" alt="Easy Booking" className="rounded-lg shadow-lg w-full md:w-1/2 object-cover" />
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4 text-cyan-500"> Easy Slot Booking</h2>
          <p className="text-lg">
            Enter your pincode, choose your preferred date, and book an appointment within seconds. 
            We notify the health center instantly and confirm your slot.
          </p>
        </div>
      </section>

      {/* Live Consultations Section */}
      <section className={`min-h-screen flex flex-col md:flex-row-reverse items-center justify-center gap-8 px-6 md:px-16`}>
        <img src="https://images.pexels.com/photos/7195310/pexels-photo-7195310.jpeg" alt="Live Consultation" className="rounded-lg shadow-lg w-full md:w-1/2 object-cover" />
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4 text-cyan-500"> Live Doctor Consultations</h2>
          <p className="text-lg">
            Powered by <strong>ZegoCloud</strong>, experience crystal-clear video and audio for real-time doctor consultations from your home.
          </p>
        </div>
      </section>

      {/* Health Center Approval Section */}
      <section className={`min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-16`}>
        <h2 className="text-3xl font-bold mb-6 text-cyan-500"> Verified Health Centers</h2>
        <p className="text-lg max-w-2xl mb-8">
          Every health center listed on MediConnection goes through a thorough verification process to ensure your safety and trust.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          {["HCRN & HFC Verification", "License & Document Review", "Admin Panel Access"].map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-lg shadow-lg ${cardBg}`}
            >
              {step}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technologies Section */}
      <section className={`min-h-screen flex flex-col items-center justify-center px-6 md:px-16`}>
        <h2 className="text-3xl font-bold mb-6 text-cyan-500">⚙️ Technologies We Use</h2>
        <p className="max-w-2xl text-center text-lg mb-8">
          MediConnection is built with cutting-edge technologies to provide a secure, fast, and reliable healthcare experience.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {technologies.map((tech, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-lg shadow-md flex flex-col items-center gap-3 ${cardBg}`}
            >
              <img src={tech[1]} alt={tech[0]} className="w-12 h-12" />
              <span>{tech[0]}</span>
            </motion.div>
          ))}
        </div>
        <p className="mt-10 text-gray-500 text-center">
          Developed by{" "}
          <a
            href="https://github.com/Divine-77777"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-500 hover:underline"
          >
            Deepak Prasad
          </a>
        </p>
      </section>
    </div>
  );
}
