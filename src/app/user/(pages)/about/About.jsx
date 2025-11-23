"use client";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ShieldCheck, FileCheck2, UserCheck } from "lucide-react";

const technologies = [
  ["Next.js", "https://cdn.worldvectorlogo.com/logos/next-js.svg"],
  ["Supabase", "https://logowik.com/content/uploads/images/supabase-icon1721342077.logowik.com.webp"],
  ["Tailwind CSS", "https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg"],
  ["Redux", "https://cdn.worldvectorlogo.com/logos/redux.svg"],
  ["Cashfree", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlmGx-0creMf02iS6YAko6ZhDcEQVk6WvCUQ&s"],
  ["ZegoCloud", "https://cdn-b.saashub.com/images/app/service_logos/214/abfx1r2e4jwb/large.png?1668494327"],
  ["Framer Motion", "https://cdn.worldvectorlogo.com/logos/framer-motion.svg"],
];

export default function About() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const bg = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black";
  const cardBg = isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-100 border border-gray-200";

  return (
    <div className={`w-full ${bg}`}>

      {/* HERO SECTION */}
      <section
        className={`min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-16 
        bg-cover bg-center relative`}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1581091870634-3e09a4c7e7bb?auto=format&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-4xl md:text-6xl font-bold mb-6 text-cyan-400"
        >
          Your Digital Healthcare Companion
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative max-w-3xl text-lg md:text-xl bg-black/40 p-6 rounded-xl"
        >
          MediConnection brings healthcare to your fingertips — Book appointments, consult specialists live, and access your medical documents instantly.
        </motion.p>
      </section>

      {/* EASY BOOKING */}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 px-6 md:px-16">
        <img
          src="https://images.pexels.com/photos/5998475/pexels-photo-5998475.jpeg"
          className="rounded-xl shadow-xl w-full md:w-1/2"
        />
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-4 text-cyan-500">Easy Slot Booking</h2>
          <p className="text-lg">
            Enter your pincode, find the nearest verified health center, and book a slot within seconds — seamless, fast, and reliable.
          </p>
        </div>
      </section>



      {/* LIVE CONSULTATION */}
      <section className="min-h-screen flex flex-col md:flex-row-reverse items-center justify-center gap-12 px-6 md:px-16">
        <img
          src="https://images.pexels.com/photos/7195310/pexels-photo-7195310.jpeg"
          className="rounded-xl shadow-xl w-full md:w-1/2"
        />
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-4 text-cyan-500">Live Doctor Consultations</h2>
          <p className="text-lg">
            Powered by <strong>ZegoCloud</strong> — experience smooth, high-quality video calls with certified doctors.
          </p>
        </div>
      </section>

      {/* DOWNLOAD SECTION */}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 px-6 md:px-16">
        <img
          src="https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg"
          className="rounded-xl shadow-xl w-full md:w-1/2"
        />

        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-4 text-cyan-500">Access & Download Documents</h2>

          <p className="text-lg mb-4">
            Your medical history stays safe and organized — download all your files instantly.
          </p>

          <ul className="text-lg space-y-2">
            <li>✔️ Prescriptions & Digital Notes</li>
            <li>✔️ Lab Reports & Health Records</li>
            <li>✔️ Bills & Certificates</li>
          </ul>

          <p className="text-lg mt-4">
            All stored securely using <strong>Cloudinary</strong> with lightning-fast delivery.
          </p>
        </div>
      </section>
      
      {/* VERIFIED HEALTH CENTER WITH NODES */}
      <section className="min-h-screen flex flex-col items-center text-center px-6 md:px-16 relative">

        <h2 className="text-3xl font-bold mb-6 text-cyan-500">Verified Health Centers</h2>
        <p className="max-w-2xl text-lg mb-12">
          Every health center goes through a complete verification pipeline before being listed.
        </p>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl">

          {/* Connecting lines */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 border-t-2 border-cyan-500"></div>

          {/* CARD 1 */}
          <motion.div whileHover={{ scale: 1.05 }} className={`p-6 rounded-xl shadow-xl ${cardBg} relative`}>
            <ShieldCheck className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">HCRN & HFC Verification</h3>
          </motion.div>

          {/* CARD 2 */}
          <motion.div whileHover={{ scale: 1.05 }} className={`p-6 rounded-xl shadow-xl ${cardBg} relative`}>
            <FileCheck2 className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">License & Document Review</h3>
          </motion.div>

          {/* CARD 3 */}
          <motion.div whileHover={{ scale: 1.05 }} className={`p-6 rounded-xl shadow-xl ${cardBg} relative`}>
            <UserCheck className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">Admin Panel Access</h3>
          </motion.div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section className="min-h-screen flex flex-col items-center px-6 md:px-16">
        <h2 className="text-3xl font-bold mb-6 text-cyan-500">⚙️ Technologies We Use</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {technologies.map((tech, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-xl shadow-lg flex flex-col items-center gap-3 ${cardBg}`}
            >
              <img src={tech[1]} className="w-12 h-12" />
              <span>{tech[0]}</span>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-gray-400 text-center">
          Developed by{" "}
          <a href="https://github.com/Divine-77777" className="text-cyan-500 hover:underline">
            Deepak Prasad
          </a>
        </p>
      </section>
    </div>
  );
}
