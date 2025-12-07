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
  ArrowRightCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselItem } from "@/components/ui/carousel";


const featureCards = [
  {
    title: "Book a Slot",
    desc: "Search by pincode, pick a date, and book at a nearby health center in seconds.",
    link: "/user/book",
    img: "https://img.freepik.com/premium-vector/book-doctor-appointment-card-template_151150-11155.jpg",
    icon: <CalendarCheck size={28} className="text-[#00A8E8]" />,
  },
  {
    title: "Live Consultation",
    desc: "High-quality video consults with certified doctors from the comfort of your home.",
    link: "/user/consult",
    img: "https://www.shutterstock.com/image-vector/online-doctor-appointment-booking-system-600nw-2655423645.jpg",
    icon: <Video size={28} className="text-[#00A8E8]" />,
  },
  {
    title: "Download Reports",
    desc: "Access prescriptions, lab reports and bills — securely stored and downloadable.",
    link: "/user/download",
    img: "https://static.vecteezy.com/system/resources/previews/005/642/611/non_2x/illustration-graphic-cartoon-character-of-doctor-s-prescription-vector.jpg",
    icon: <FileDown size={28} className="text-[#00A8E8]" />,
  },
];

const testimonials = [
  { name: "Nitesh Bhagat", feedback: "Excellent service, very professional doctors!" },
  { name: "Rashmika Agarwal", feedback: "Quick and easy appointments, highly recommend." },
  { name: "Emily Sharma", feedback: "The live consultation was smooth and very helpful." },
];

const trustedCenters = [
  { name: "City Health Clinic", subtitle: "Multi-speciality", img: "https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg" },
  { name: "Downtown Medical Center", subtitle: "General & Emergency", img: "https://thearchitectsdiary.com/wp-content/uploads/2025/05/hospital-building-design-2-1.jpg" },
  { name: "Green Valley Labs", subtitle: "Diagnostics", img: "https://vdbg.com/wp-content/uploads/2024/10/shutterstock_2142668957.jpg" },
];

const doctors = [
  { name: "Dr. Meera Kapoor", role: "Cardiologist", img: "https://static.vecteezy.com/system/resources/previews/006/837/801/non_2x/female-portrait-medical-doctor-profile-flat-design-free-vector.jpg" },
  { name: "Dr. Raj Singh", role: "Neurologist", img: "https://img.freepik.com/premium-vector/doctor-profile-with-medical-service-icon_617655-48.jpg" },
  { name: "Dr. Amit Verma", role: "Orthopedic", img: "https://img.pikbest.com/png-images/20241019/doctor-logo-vector-icon-illustration_10974092.png!sw800" },
];

export default function UserHome() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { user } = useAuth();

  const pageBg = isDarkMode ? "bg-[#071226] text-white" : "bg-white text-gray-900";
  const cardBg = isDarkMode ? "bg-[#0F2137] border border-gray-700" : "bg-white border border-gray-200";

  return (
    <motion.div className={`w-full min-h-screen transition-colors duration-300 ${pageBg} pt-10`}>
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-[72vh] flex items-center justify-center overflow-hidden"
      >

        <img
          src="/banner.png"
          alt="Healthcare banner"
          className="absolute inset- w-full h-full object-cover opacity-70"
        />
        <div className={`absolute inset-0  ${isDarkMode ? "bg-black/50" : "bg-white/30"}`}></div>

        <div className="relative z-10 max-w-4xl text-center px-6">
          <motion.h1
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold leading-snug"
          >
            Consult. Book. Heal. <br />
            <span className="opacity-90">All in One Place ~</span>{" "}
            <span className={isDarkMode ? "text-[#77d2f6]" : "text-[#097099]"}>
              MediConnection
            </span>
          </motion.h1>

          {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-lg md:text-2xl max-w-2xl mx-auto opacity-90 p-2 font-bold
"
          >
            Book appointments, consult specialists live, and securely download your medical documents ~ all in one place.
          </motion.p> */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-col  sm:flex-row gap-4 justify-end sm:justify-center items-end"
            >
              {/* Book Appointment Button */}
              <Link href="/user/book">
                <Button className="rounded-xl px-6 py-3 bg-[#00A8E8] hover:bg-[#0196d7] text-white flex items-center gap-2">
                  <CalendarCheck size={20} className="text-white" />
                  Book Appointment
                </Button>
              </Link>

              {/* Live Consult Button */}
              <Link href="/user/consult">
                <Button className="rounded-xl px-6 py-3 border border-black bg-white text-[#0077B6] hover:bg-gray-100 flex items-center gap-2">
                  <Video size={20} className="text-[#0077B6]" />
                  Live Consult
                </Button>
              </Link>
            </motion.div>


        </div>
      </motion.section>

      {/* FEATURE CARDS */}
      <section className="container mx-auto px-4 lg:px-16 mt-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featureCards.map((f, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * idx }}>
              <Link href={f.link}>
                <Card className={`overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer ${cardBg}`}>
                  <div className="w-full h-44 overflow-hidden">
                    <img src={f.img} alt={f.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                  </div>
                  <CardHeader className="flex items-center gap-3 pt-4 px-4">
                    <div className="p-2 rounded-md bg-white/10">{f.icon}</div>
                    <CardTitle className="text-lg font-semibold">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-6">
                    <p className="text-sm opacity-90">{f.desc}</p>
                    <div className="mt-4 flex justify-end">
                      <ArrowRightCircle className="text-[#00A8E8]" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* UPCOMING APPOINTMENTS */}
      <section className="container mx-auto px-4 lg:px-16 mt-14">
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <CalendarCheck className="text-[#00A8E8]" /> Upcoming Appointments
        </h3>

        <Card className={`${cardBg} rounded-xl p-6`}>
          <CardContent>
            {/* Example content - replace with real data */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-semibold">No upcoming appointments</p>
                <p className="text-sm opacity-80 mt-1">Book a slot with a specialist near you.</p>
              </div>
              <div>
                <Link href="/user/book">
                  <Button className="bg-[#00A8E8] text-white rounded-lg">Book Now</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* TESTIMONIALS CAROUSEL */}
      <section className="container mx-auto px-4 lg:px-16 mt-14">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <HeartPulse className="text-[#00A8E8]" /> What Our Users Say
        </h3>

        <Carousel>
          {testimonials.map((t, i) => (
            <CarouselItem key={i} className={`p-6 rounded-xl text-center ${isDarkMode ? "bg-[#0F2137]" : "bg-white"} shadow-md`}>
              <p className="italic">"{t.feedback}"</p>
              <p className="mt-3 font-semibold">— {t.name}</p>
            </CarouselItem>
          ))}
        </Carousel>
      </section>

      {/* TRUSTED CENTERS */}
      <section className="container mx-auto px-4 lg:px-16 mt-14">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Hospital className="text-[#00A8E8]" /> Find Health Centers Nearby you
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {trustedCenters.map((c, i) => (
            <Card key={i} className={`rounded-xl overflow-hidden ${cardBg}`}>
              <img src={c.img} alt={c.name} className="w-full h-36 object-cover" />
              <CardContent className="p-4">
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm opacity-80">{c.subtitle}</p>
                <div className="mt-4 flex gap-2">
                  <Button className="text-sm bg-[#00A8E8] text-white rounded-lg">View</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* TRUSTED DOCTORS */}
      <section className="container mx-auto px-4 lg:px-16 mt-14">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <User className="text-[#00A8E8]" /> Trusted Doctors
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {doctors.map((d, i) => (
            <Card key={i} className={`rounded-xl flex items-center gap-4 p-4 ${cardBg}`}>
              <img src={d.img} alt={d.name} className="w-20 h-20 object-cover rounded-full" />
              <div>
                <p className="font-semibold">{d.name}</p>
                <p className="text-sm opacity-80">{d.role}</p>
                <div className="mt-3">
                  <Link href="/user/consult">
                    <Button className="text-sm bg-[#00A8E8] text-white rounded-lg">Consult</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className={`py-16 px-4 lg:px-16 mt-14 ${isDarkMode ? "bg-[#071226]" : "bg-gradient-to-r from-blue-50 to-cyan-50"}`}>
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose MediConnection?</h2>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <Handshake size={28} className="text-[#00A8E8]" />,
              title: "Seamless Connection",
              desc: "Connect with certified doctors and health centers quickly.",
            },
            {
              icon: <CalendarCheck size={28} className="text-[#00A8E8]" />,
              title: "Instant Booking",
              desc: "Real-time slot availability and easy booking flow.",
            },
            {
              icon: <FileText size={28} className="text-[#00A8E8]" />,
              title: "Digital Records",
              desc: "Secure storage and fast access to all medical documents.",
            },
            {
              icon: <ShieldCheck size={28} className="text-[#00A8E8]" />,
              title: "Verified Providers",
              desc: "Health centers and doctors verified by our quality team.",
            },
          ].map((item, idx) => (
            <Card key={idx} className={`p-6 text-center rounded-xl ${cardBg}`}>
              <div className="flex items-center justify-center mb-3">{item.icon}</div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm opacity-80 mt-2">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>


    </motion.div>
  );
}
