"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import AccountNoSet from "./AccountNoSet";
import { useToast } from "@/hooks/use-toast";

const DoctorHomePage = () => {
  const { user } = useAuth();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { errorToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAccountPopup, setShowAccountPopup] = useState(false);

  const fetchDoctorData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/doctor/me?userId=${user.id}`);
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed to load doctor data");
      setData(result.data || null);
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [user]);

  const username = data?.name || user?.email?.split("@")[0] || "Doctor";

  return (
    <div
      className={`transition-colors ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {loading ? (
          <Loader />
      ) : (
        <>
          {/* Section 1 - Doctor Quick Access */}
          <section className="min-h-screen justify-center px-6 flex flex-col items-center">
            <div className="text-center space-y-4 max-w-2xl">
              <h2 className="text-2xl font-semibold">
                Hello, Dr. {username} 
              </h2>
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome to the Doctor's Portal
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Manage your patients, appointments, services, and profile in one
                place.
              </p>

     
            </div>

            {/* Links Section */}
            <div className="grid gap-5 mt-12 sm:grid-cols-2 md:grid-cols-3 w-full max-w-4xl">
              
              <Link
                href="/doctor/appointments"
                className="px-6 py-5 rounded-2xl bg-cyan-500 text-white shadow hover:bg-cyan-600 transition text-center font-medium"
              >
                Appointments
              </Link>
              <Link
                href="/doctor/availability"
                className="px-6 py-5 rounded-2xl bg-cyan-500 text-white shadow hover:bg-cyan-600 transition text-center font-medium"
              >
                Manage Availability
              </Link>
              <Link
                href="/doctor/profile"
                className="px-6 py-5 rounded-2xl bg-cyan-500 text-white shadow hover:bg-cyan-600 transition text-center font-medium"
              >
                Manage Profile
              </Link>
              <Link
                href="/doctor/manageaccount"
                className="px-6 py-5 rounded-2xl bg-cyan-500 text-white shadow hover:bg-cyan-600 transition text-center font-medium"
              >
                Account Details
              </Link>
              <Link
                href="/doctor/manageservice"
                className="px-6 py-5 rounded-2xl bg-cyan-500 text-white shadow hover:bg-cyan-600 transition text-center font-medium"
              >
                Manage Services
              </Link>
            </div>

            <AccountNoSet
              userId={user?.id}
              isOpen={showAccountPopup}
              onClose={() => setShowAccountPopup(false)}
              onSuccess={(accountNo) =>
                setData((prev) => ({ ...prev, account_number: accountNo }))
              }
            />
          </section>

          {/* Section 2 - Feature Showcase */}
          <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
            <div className="text-center max-w-3xl mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Why use the Doctor Portal?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Explore the features that make managing your practice seamless.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 w-full max-w-5xl">
              {[
                {
                  title: "Seamless Consultations",
                  desc: "Conduct video or in-person consultations with patients easily.",
                  img: "/images/consultation.png",
                },
                {
                  title: "Upload Prescriptions",
                  desc: "Quickly upload and share prescriptions with patients.",
                  img: "/images/prescription.png",
                },
                {
                  title: "Receive Payments",
                  desc: "Get paid seamlessly through integrated payment gateways.",
                  img: "/images/payment.png",
                },
                {
                  title: "Manage Patients",
                  desc: "Track medical history and maintain patient records securely.",
                  img: "/images/patient.png",
                },
                {
                  title: "Manage Services",
                  desc: "List your medical services and control availability.",
                  img: "/images/services.png",
                },
                {
                  title: "Profile & Reputation",
                  desc: "Build trust by keeping your profile updated.",
                  img: "/images/profile.png",
                },
                
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl  ${isDarkMode ? "bg-gray-900" : "bg-white"} border border-cyan-300 shadow-md hover:shadow-lg transition p-6 text-center flex flex-col items-center`}
                >
                  <img src={item.img} alt={item.title} className="h-40 mb-4" />
                  <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default DoctorHomePage;
