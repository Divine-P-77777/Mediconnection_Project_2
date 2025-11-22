"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import BookingModal from "./BookingModal";
import ConsultationsTable from "./ConsultationsTable";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DoctorList from "./DoctorList";

const preselectedServices = [
  "General Medicine",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Neurology",
];

export default function ExploreConsult() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [search, setSearch] = useState("");
  const [activeServiceTab, setActiveServiceTab] = useState(preselectedServices[0]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const router = useRouter();
  const { user } = useAuth();




  //  redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user, router]);


  // Fetch doctors offering selected service
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/doctor", window.location.origin);
      if (search) url.searchParams.set("search", search);
      else url.searchParams.set("service", activeServiceTab);

      const res = await fetch(url);
      const data = await res.json();

      if (!data.success) throw new Error(data.error);
      setDoctors(data.doctors);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [search, activeServiceTab]);

  return (
    <div className={`min-h-screen pt-24 px-4 transition-colors ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <h1 className={`text-3xl font-bold mb-6 text-center ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}>
        Explore Doctors & Services
      </h1>

      {/* Global Search */}
      <div className="max-w-3xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search services or doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full p-3 rounded-xl border transition focus:ring-2 focus:ring-cyan-500 ${isDarkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400" : "bg-white border-gray-300 text-black placeholder-gray-500"}`}
        />
      </div>

      {/* Service Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {preselectedServices.map((service) => (
          <button
            key={service}
            onClick={() => setActiveServiceTab(service)}
            className={`px-4 py-2 rounded-full font-medium transition ${activeServiceTab === service
                ? "bg-cyan-500 text-white"
                : isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {service}
          </button>
        ))}
      </div>

      {/* Doctors List */}
      <DoctorList
        doctors={doctors}
        loading={loading}
        isDarkMode={isDarkMode}
        setBookingDoctor={setBookingDoctor}
      />

      {/* Booking Modal */}
      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
        />
      )}
      <ConsultationsTable />


    </div>
  );
}
