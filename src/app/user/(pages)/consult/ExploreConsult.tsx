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
          className={`w-full p-3 rounded-xl border transition focus:ring-2 focus:ring-cyan-500 ${isDarkMode
            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            : "bg-white border-gray-300 text-black placeholder-gray-500"
            }`}
        />
      </div>

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
