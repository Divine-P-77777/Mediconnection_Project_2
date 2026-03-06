"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";


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

interface DoctorListProps {
  doctors: DoctorItem[];
  loading: boolean;
  isDarkMode: boolean;
  setBookingDoctor: (doctor: DoctorItem) => void;
}

export default function DoctorList({
  doctors,
  loading,
  isDarkMode,
  setBookingDoctor,
}: DoctorListProps) {
  return (
    <div className="w-full flex justify-center mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl w-full px-4">
        {loading ? (
          <p className="text-center col-span-full text-lg font-medium animate-pulse">
            Loading doctors...
          </p>
        ) : doctors.length === 0 ? (
          <p className="text-center col-span-full text-lg font-medium">
            No doctors found for this service.
          </p>
        ) : (
          doctors.map((doc) => {
            const doctor: DoctorProfile =
              doc.doctors ?? {
                id: "unknown",
                name: "Unknown Doctor",
              };

            return (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-transparent ${isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                    }`}
                >
                  <CardHeader className="flex flex-col items-center text-center p-6">
                    <div className="relative w-24 h-24">
                      <img
                        src={
                          doctor.profile ??
                          "https://via.placeholder.com/150?text=Doctor"
                        }
                        alt="Doctor profile"
                        className="w-full h-full rounded-full object-cover border-4 border-cyan-500 shadow-sm"
                      />
                    </div>

                    <CardTitle className="mt-4 text-xl font-semibold">
                      Dr. {doctor.name}
                    </CardTitle>

                    {doctor.specialization && (
                      <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                        {doctor.specialization}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-3 text-center pb-6">
                    <p className="text-base">
                      <strong>Service:</strong> {doc.service_name}
                    </p>
                    <p className="text-base">
                      <strong>Price:</strong>{" "}
                      {doc.price === 0 ? "Free" : `₹${doc.price}`}
                    </p>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setBookingDoctor(doc)}
                      className="mt-4 w-full py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:shadow-cyan-500/30 hover:shadow-lg transition-all"
                    >
                      Book Now
                    </motion.button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
