'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import { Carousel, CarouselItem } from '@/components/ui/carousel';
import { FaCalendarCheck, FaVideo, FaFileDownload, FaHospital, FaUserMd, FaHandshake } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const features = [
  { icon: <FaCalendarCheck size={30} />, title: 'Book a Slot', link: '/user/book', description: 'Schedule an appointment with top doctors.' },
  { icon: <FaVideo size={30} />, title: 'Live Consultation', link: '/user/consult', description: 'Get instant medical advice via video call.' },
  { icon: <FaFileDownload size={30} />, title: 'Download Reports', link: '/user/download', description: 'Access and download your medical reports anytime.' },
];

const testimonials = [
  { name: 'Nitesh Bhagat', feedback: 'Excellent service, very professional doctors!' },
  { name: 'Rashmika Agarwal', feedback: 'Quick and easy appointments, highly recommend.' },
  { name: 'Emily Sharma', feedback: 'The live consultation was smooth and very helpful.' },
];

export default function UserHome() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { user } = useAuth();

  return (
    <motion.div
      className={`w-full flex-1 flex flex-col transition-all duration-300 pt-20 ${
        isDarkMode ? 'bg-[#0A192F] text-white' : 'bg-white text-black'
      }`}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`text-center py-16 px-4 bg-gradient-to-r ${
          isDarkMode ? 'from-[#091624] to-[#0A192F]' : 'from-blue-50 to-white'
        }`}
      >
        <h1 className="text-4xl font-bold">
          Welcome {user?.email || 'Guest'} to <span className="text-[#00A8E8]">MediConnection</span>
        </h1>
        <p className="mt-2 text-lg">Your trusted healthcare partner, anytime, anywhere.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/user/book">
            <Button className="bg-[#00A8E8] text-white px-6 py-3 hover:bg-[#0077B6] transition-all duration-300">
              Book Appointment
            </Button>
          </Link>
          <Link href="/user/consult">
            <Button className="bg-[#0077B6] text-white px-6 py-3 hover:bg-[#00A8E8] transition-all duration-300">
              Live Consult
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Feature Highlights */}
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6 my-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link href={feature.link}>
                <Card
                  className={`p-6 h-[220px] text-center shadow-md hover:shadow-lg transition-all duration-300 ${
                    isDarkMode
                      ? 'shadow-cyan-400 bg-[#0F2137]'
                      : 'shadow-gray-300 bg-gray-50'
                  } rounded-xl`}
                >
                  <CardHeader>
                    <div className="flex justify-center text-[#00A8E8] mb-4">{feature.icon}</div>
                    <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="container mx-auto px-4">
        <div className="my-12">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
          <Card className="p-6 shadow-lg rounded-xl border border-gray-200">
            <CardContent className="flex flex-col items-center justify-center">
              <p>No upcoming appointments</p>
              <Link href="/user/book">
                <Button className="mt-4 bg-[#00A8E8] text-white hover:bg-[#0077B6]">
                  Book Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4">
        <div className="my-12">
          <h2 className="text-2xl font-semibold mb-4">What Our Users Say</h2>
          <Carousel>
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className={`text-center p-6 my-2 rounded-xl transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
                }`}
              >
                <p className="italic text-lg">"{testimonial.feedback}"</p>
                <p className="mt-2 font-semibold">- {testimonial.name}</p>
              </CarouselItem>
            ))}
          </Carousel>
        </div>
      </div>

      {/* Trusted Health Centers */}
      <div className="container mx-auto px-4 my-16">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FaHospital className="text-[#00A8E8]" /> Trusted Health Centers
        </h2>
        <p className="mb-6 text-sm">
          All our listed health centers are carefully approved by the MediConnection technical team for authenticity and reliability.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 shadow-md rounded-xl"><p>📍 Apollo Hospitals</p></Card>
          <Card className="p-6 shadow-md rounded-xl"><p>📍 Fortis Healthcare</p></Card>
          <Card className="p-6 shadow-md rounded-xl"><p>📍 AIIMS Delhi</p></Card>
        </div>
      </div>

      {/* Trusted Doctors */}
      <div className="container mx-auto px-4 my-16">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FaUserMd className="text-[#00A8E8]" /> Trusted Doctors
        </h2>
        <p className="mb-6 text-sm">
          Consult with highly qualified doctors approved and verified by their associated health centers.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 shadow-md rounded-xl"><p>Dr. Meera Kapoor — Cardiologist</p></Card>
          <Card className="p-6 shadow-md rounded-xl"><p> Dr. Raj Singh — Neurologist</p></Card>
          <Card className="p-6 shadow-md rounded-xl"><p> Dr. Amit Verma — Orthopedic</p></Card>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className={`py-16 px-6 text-center ${isDarkMode ? 'bg-[#0F2137]' : 'bg-blue-50'}`}>
        <h2 className="text-3xl font-bold mb-6">Why Choose <span className="text-[#00A8E8]">MediConnection?</span></h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 shadow-md rounded-xl flex flex-col items-center">
            <FaHandshake className="text-[#00A8E8] text-3xl mb-3" />
            <p className="font-semibold">Seamless Connection</p>
            <p className="text-sm mt-2">Easily connect with doctors and health centers in just a few clicks.</p>
          </Card>
          <Card className="p-6 shadow-md rounded-xl flex flex-col items-center">
            <FaCalendarCheck className="text-[#00A8E8] text-3xl mb-3" />
            <p className="font-semibold">Instant Booking</p>
            <p className="text-sm mt-2">Book appointments anytime with real-time availability.</p>
          </Card>
          <Card className="p-6 shadow-md rounded-xl flex flex-col items-center">
            <FaFileDownload className="text-[#00A8E8] text-3xl mb-3" />
            <p className="font-semibold">Digital Reports</p>
            <p className="text-sm mt-2">Download your bills, prescriptions, and reports on the go.</p>
          </Card>
          <Card className="p-6 shadow-md rounded-xl flex flex-col items-center">
            <FaUserMd className="text-[#00A8E8] text-3xl mb-3" />
            <p className="font-semibold">Verified Doctors</p>
            <p className="text-sm mt-2">Only approved and trusted doctors are listed on MediConnection.</p>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
