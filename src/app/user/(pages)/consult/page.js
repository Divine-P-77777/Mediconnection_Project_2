"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { supabase } from "@/supabase/client";
import { format } from "date-fns";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import BookingModal from "./BookingModal";
import ConsultationsTable from "./ConsultationsTable";
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
            className={`px-4 py-2 rounded-full font-medium transition ${
              activeServiceTab === service
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
  {/* Doctors List */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
  {loading ? (
    <p className="text-center col-span-full">Loading doctors...</p>
  ) : doctors.length === 0 ? (
    <p className="text-center col-span-full">No doctors found for this service.</p>
  ) : (
    doctors.map((doc) => {
      const doctor = doc.doctors ?? doc; // fallback if no relation nesting
      return (
        <Card
          key={doctor.id}
          className={`rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition border ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <CardHeader className="flex flex-col items-center text-center">
   <img
  src={doctor.profile || "https://via.placeholder.com/150?text=Doctor"}
  alt="Doctor profile"
  className="w-20 h-20 rounded-full object-cover border-2 border-cyan-500"
/>

            <CardTitle className="mt-3 text-lg font-semibold">
              Dr. {doctor.name}
            </CardTitle>
            {doctor.specialization && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {doctor.specialization}
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-2 text-center">
            <p>
              <strong>Service:</strong> {doc.service_name}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              {doc.price === 0 ? "Free" : `₹${doc.price}`}
            </p>
            <button
              onClick={() => setBookingDoctor(doc)}
              className="mt-3 w-full px-4 py-2 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition"
            >
              Book Now
            </button>
          </CardContent>
        </Card>
      );
    })
  )}
</div>

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
