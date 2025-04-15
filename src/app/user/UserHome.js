'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import { Carousel, CarouselItem } from '@/components/ui/carousel';
import { FaCalendarCheck, FaVideo, FaFileDownload } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const features = [
  { icon: <FaCalendarCheck size={30} />, title: 'Book a Slot',link: '/user/book', description: 'Schedule an appointment with top doctors.' },
  { icon: <FaVideo size={30} />, title: 'Live Consultation',link: '/user/consult', description: 'Get instant medical advice via video call.' },
  { icon: <FaFileDownload size={30} />, title: 'Download Reports',link: '/user/download', description: 'Access and download your medical reports anytime.' },
];

const testimonials = [
  { name: 'Nitesh Bhagat', feedback: 'Excellent service, very professional doctors!' },
  { name: 'Rashmika Agarwal', feedback: 'Quick and easy appointments, highly recommend.' },
  { name: 'Emily Sharma', feedback: 'The live consultation was smooth and very helpful.' },
];

export default function UserHome() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const router = useRouter();
  return (
    <motion.div 
      className={`w-full flex-1 flex flex-col transition-all duration-300 ${isDarkMode ? 'bg-[#0A192F] text-white' : 'bg-white text-black'}`}
    >
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12 pt-30 container mx-auto px-4"
      >
        <h1 className="text-4xl font-bold">Welcome to HealthConnect</h1>
        <p className="mt-2 text-lg">Your trusted healthcare partner, anytime, anywhere.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Button className="bg-[#00A8E8] text-white px-6 py-3 hover:bg-[#0077B6] transition-all duration-300">Book Appointment</Button>
          <Button className="bg-[#0077B6] text-white px-6 py-3 hover:bg-[#00A8E8] transition-all duration-300">Live Consult</Button>
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
            <Link href={feature.link} key={feature.link}>
              <Card className={`p-6 h-[200px] text-center shadow-sm ${isDarkMode? "shadow-cyan-400 border-gray-200": "shadow-gray-400 border-gray-500"} hover:shadow-md border border-gray-200  rounded-lg`} >
              
                <CardHeader>
                  <div className="flex justify-center text-[#00A8E8] mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
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
          <Card className="p-4 shadow-lg rounded-lg border border-gray-200">
            <CardContent>
              <p>No upcoming appointments</p>
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
                className={`text-center p-2 my-2  shadow-sm shadow-cyan-300 rounded-xl  hover:shadow-md transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
              >
                <p className="italic">"{testimonial.feedback}"</p>
                <p className="mt-2 font-semibold">- {testimonial.name}</p>
              </CarouselItem>
            ))}
          </Carousel>
        </div>
      </div>

      {/* Footer */}
      
    </motion.div>
  );
}










// "use client";

// import { useState } from "react";
// import dynamic from "next/dynamic";
// // import { useUser } from "@auth0/nextjs-auth0";

// import UserNav from "./user/UserNav"
// import UserHome from "./user/UserHome";
// import BookAppointment from "./user/book/page"; 
// import Download from "./user/download/page";
// import BooKLiveConsult from "./user/consult/page";
// import AboutUs from "./user/about/page";
// import Contact from "./user/contact/page";
// import UserFoot from "./user/UserFoot";

// // Dynamically import Loader to prevent SSR issues
// // const Loader = dynamic(() => import("./components/Loader"), { ssr: false });

// const Page = () => {
//   // const { user, isLoading } = useUser();
//   const [activePage, setActivePage] = useState("home");

//   // if (isLoading) {
//   //   return (
//   //     <div className="flex justify-center items-center min-h-screen">
//   //       <Loader />
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="">
//       {/* Pass `setActivePage` to Navbar */}
//       {/* <UserNav setActivePage={setActivePage} /> */}
      
//       {/* <div className="w-full h-[1px] shadow-md shadow-purple-200 bg-purple-200"></div> */}
      
//       {/* Conditional Rendering Based on Active Page */}
//       {activePage === "home" && <UserHome />}
//       {activePage === "book" && <BookAppointment />}
//       {activePage === "download" && <Download />}
//       {activePage === "consult" && <BooKLiveConsult />}
//       {activePage === "about" && <AboutUs />}
//       {activePage === "contact" && <Contact />}

//       {/* Keep Admin Components (if needed) */}
//       {/* <AdminLogin />
//       <AdminRegister />
//       <AdminForgot /> */}

//       {/* <UserFoot /> */}
//     </div>
//   );
// };

// export default Page;
