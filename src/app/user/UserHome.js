"use client";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  CalendarCheck,
  Video,
  FileDown,
  Hospital,
  Stethoscope,
  Handshake,
  User,
  HeartPulse,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselItem } from "@/components/ui/carousel";

const features = [
  {
    icon: <CalendarCheck size={30} />,
    title: "Book a Slot",
    link: "/user/book",
    description: "Schedule an appointment with top doctors near you.",
  },
  {
    icon: <Video size={30} />,
    title: "Live Consultation",
    link: "/user/consult",
    description: "Get instant video advice from trusted specialists.",
  },
  {
    icon: <FileDown size={30} />,
    title: "Download Reports",
    link: "/user/download",
    description: "Access and download your health records anytime.",
  },
];

const testimonials = [
  { name: "Nitesh Bhagat", feedback: "Excellent service, very professional doctors!" },
  { name: "Rashmika Agarwal", feedback: "Quick and easy appointments, highly recommend." },
  { name: "Emily Sharma", feedback: "The live consultation was smooth and very helpful." },
];

export default function UserHome() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { user } = useAuth();

  return (
    <motion.div
      className={`w-full flex-1 flex flex-col transition-all duration-300 pt-20 ${
        isDarkMode ? "bg-[#0A192F] text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* 🌿 Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`text-center py-16 px-4 bg-gradient-to-r ${
          isDarkMode ? "from-[#091624] to-[#0A192F]" : "from-blue-50 to-cyan-50"
        }`}
      >
        <h1 className="text-4xl font-bold">
          Welcome {user?.username || ""} to{" "}
          <span className="text-[#00A8E8]">MediConnection</span>
        </h1>
        <p className="mt-2 text-lg opacity-90">
          Your trusted healthcare partner, anywhere, anytime.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/user/book">
            <Button className="bg-[#00A8E8] text-white px-6 py-3 hover:bg-[#0077B6] transition-all duration-300 rounded-xl">
              Book Appointment
            </Button>
          </Link>
          <Link href="/user/consult">
            <Button className="bg-[#0077B6] text-white px-6 py-3 hover:bg-[#00A8E8] transition-all duration-300 rounded-xl">
              Live Consult
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* 💊 Features */}
      <section className="container mx-auto px-4 my-12">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link href={feature.link}>
                <Card
                  className={`p-6 h-[220px] text-center shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl ${
                    isDarkMode ? "bg-[#0F2137] border-cyan-700" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-center text-[#00A8E8] mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm opacity-80">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🩺 Upcoming Appointments */}
      <section className="container mx-auto px-4">
        <div className="my-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CalendarCheck className="text-[#00A8E8]" /> Upcoming Appointments
          </h2>
          <Card
            className={`p-6 rounded-xl ${
              isDarkMode ? "bg-[#0F2137] border-cyan-700" : "bg-white border-gray-200"
            }`}
          >
            <CardContent className="flex flex-col items-center justify-center">
              <p className="opacity-80">No upcoming appointments.</p>
              <Link href="/user/book">
                <Button className="mt-4 bg-[#00A8E8] text-white hover:bg-[#0077B6]">
                  Book Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 💬 Testimonials */}
      <section className="container mx-auto px-4 my-12">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <HeartPulse className="text-[#00A8E8]" /> What Our Users Say
        </h2>
        <Carousel>
          {testimonials.map((t, i) => (
            <CarouselItem
              key={i}
              className={`text-center p-6 my-2 rounded-xl transition-all duration-300 shadow-md ${
                isDarkMode ? "bg-[#0F2137] text-white" : "bg-gray-100 text-black"
              }`}
            >
              <p className="italic text-lg opacity-90">"{t.feedback}"</p>
              <p className="mt-2 font-semibold">— {t.name}</p>
            </CarouselItem>
          ))}
        </Carousel>
      </section>

      {/* 🏥 Trusted Health Centers */}
      <section className="container mx-auto px-4 my-16">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Hospital className="text-[#00A8E8]" /> Trusted Health Centers
        </h2>
        <p className="mb-6 text-sm opacity-80">
          All our listed health centers are verified by the MediConnection quality team.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {["Apollo Hospitals", "Fortis Healthcare", "AIIMS Delhi"].map((center, i) => (
            <Card
              key={i}
              className={`p-6 shadow-md rounded-xl ${
                isDarkMode ? "bg-[#0F2137]" : "bg-gray-50"
              }`}
            >
              <p className="flex items-center gap-2">
                <ShieldCheck className="text-[#00A8E8]" /> {center}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 👨‍⚕️ Trusted Doctors */}
      <section className="container mx-auto px-4 my-16">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <User className="text-[#00A8E8]" /> Trusted Doctors
        </h2>
        <p className="mb-6 text-sm opacity-80">
          Consult with qualified and verified doctors from our partner hospitals.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Dr. Meera Kapoor — Cardiologist",
            "Dr. Raj Singh — Neurologist",
            "Dr. Amit Verma — Orthopedic",
          ].map((doctor, i) => (
            <Card
              key={i}
              className={`p-6 shadow-md rounded-xl ${
                isDarkMode ? "bg-[#0F2137]" : "bg-gray-50"
              }`}
            >
              <p className="flex items-center gap-2">
                <Stethoscope className="text-[#00A8E8]" /> {doctor}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 💙 Why Choose Us */}
      <section className={`py-16 px-6 text-center ${isDarkMode ? "bg-[#0F2137]" : "bg-blue-50"}`}>
        <h2 className="text-3xl font-bold mb-10">
          Why Choose <span className="text-[#00A8E8]">MediConnection</span>?
        </h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <Handshake className="text-[#00A8E8]" size={32} />,
              title: "Seamless Connection",
              desc: "Connect with doctors and health centers in seconds.",
            },
            {
              icon: <CalendarCheck className="text-[#00A8E8]" size={32} />,
              title: "Instant Booking",
              desc: "Book appointments with real-time availability.",
            },
            {
              icon: <FileText className="text-[#00A8E8]" size={32} />,
              title: "Digital Reports",
              desc: "Download prescriptions and medical records easily.",
            },
            {
              icon: <User className="text-[#00A8E8]" size={32} />,
              title: "Verified Doctors",
              desc: "Only trusted, qualified doctors are listed.",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className={`p-6 shadow-md rounded-xl flex flex-col items-center ${
                isDarkMode ? "bg-[#0F2137]" : "bg-white"
              }`}
            >
              {item.icon}
              <p className="font-semibold mt-3">{item.title}</p>
              <p className="text-sm mt-2 opacity-80">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
