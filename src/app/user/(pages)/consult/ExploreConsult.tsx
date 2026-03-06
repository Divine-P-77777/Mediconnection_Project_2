"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import BookingModal from "./BookingModal";
import ConsultationsTable from "./ConsultationsTable";
import DoctorList from "./DoctorList";
import { useAppSelector } from "@/store/hooks"

const preselectedServices = [
  "General Medicine",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Neurology",
] as const;

interface DoctorProfile {
  id: string;
  name: string;
  profile?: string;
  specialization?: string;
}

interface DoctorItem {
  doctors?: DoctorProfile;
  service_name: string;
  price: number;
}

interface DoctorsApiResponse {
  success: boolean;
  doctors: DoctorItem[];
  error?: string;
}

export default function ExploreConsult() {
  const isDarkMode = useAppSelector(
    (state) => state.theme.isDarkMode
  );

  const [search, setSearch] = useState<string>("");
  const [activeServiceTab, setActiveServiceTab] = useState<
    (typeof preselectedServices)[number]
  >(preselectedServices[0]);
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [bookingDoctor, setBookingDoctor] =
    useState<DoctorItem | null>(null);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user, router]);

  const fetchDoctors = async (): Promise<void> => {
    try {
      setLoading(true);

      const url = new URL("/api/doctor", window.location.origin);
      if (search) {
        url.searchParams.set("search", search);
      } else {
        url.searchParams.set("service", activeServiceTab);
      }

      const res = await fetch(url.toString());
      const data: DoctorsApiResponse = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch doctors");
      }

      setDoctors(data.doctors);
    } catch (err: unknown) {
      console.error(err);
      alert(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [search, activeServiceTab]);

  return (
    <div
      className={`min-h-screen pt-24 px-4 transition-colors ${isDarkMode
        ? "bg-gray-900 text-white"
        : "bg-gray-50 text-gray-900"
        }`}
    >
      <h1
        className={`text-3xl font-bold mb-6 text-center ${isDarkMode ? "text-cyan-400" : "text-cyan-600"
          }`}
      >
        Explore Doctors & Services
      </h1>

      <div className="max-w-3xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search services or doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full p-4 pl-6 rounded-full border transition-all focus:ring-2 focus:ring-cyan-500/50 shadow-sm ${isDarkMode
            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            : "bg-white border-gray-200 text-black placeholder-gray-400"
            }`}
        />
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {preselectedServices.map((service) => (
          <button
            key={service}
            onClick={() => setActiveServiceTab(service)}
            className={`px-5 py-2.5 rounded-full font-semibold transition-all shadow-sm ${activeServiceTab === service
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/30 font-bold"
              : isDarkMode
                ? "bg-gray-800/80 text-gray-300 hover:bg-gray-700 border border-gray-700"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-cyan-200 hover:text-cyan-600"
              }`}
          >
            {service}
          </button>
        ))}
      </div>

      <DoctorList
        doctors={doctors}
        loading={loading}
        isDarkMode={isDarkMode}
        setBookingDoctor={setBookingDoctor}
      />

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
