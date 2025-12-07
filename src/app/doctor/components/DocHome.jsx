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
      className={`transition-colors pt-20 min-h-screen ${
        isDarkMode
          ? "bg-gray-950 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Section 1 - Doctor Quick Access */}
          <section className="min-h-screen px-6 flex flex-col items-center justify-center">
            <div className="text-center space-y-4 max-w-2xl">
              <h2
                className="text-3xl font-semibold pt-20 tracking-wide 
                text-cyan-500 dark:text-cyan-400"
              >
                {user ? `Hello, Dr. ${username}!` : "Hello, Doctor!"}
              </h2>

              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Welcome to Your Doctor Dashboard
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                Manage patients, appointments, services, availability, and your profile
                — all from one professional dashboard.
              </p>
            </div>

            {/* Links Section */}
            <div className="grid gap-6 mt-14 sm:grid-cols-2 md:grid-cols-3 w-full max-w-4xl">
              {[
                { label: "Appointments", href: "/doctor/appointments" },
                { label: "Manage Availability", href: "/doctor/availability" },
                { label: "Manage Profile", href: "/doctor/profile" },
                { label: "Account Details", href: "/doctor/manageaccount" },
                { label: "Manage Services", href: "/doctor/manageservice" },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className={`px-6 py-5 rounded-2xl shadow-md transition text-center font-semibold
                    ${
                      isDarkMode
                        ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                        : "bg-cyan-500 hover:bg-cyan-600 text-white"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
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
            <div className="text-center max-w-3xl mb-14">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Why Use the Doctor Portal?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Explore powerful features designed to simplify your workflow.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 w-full max-w-6xl">
              {[
                {
                  title: "Seamless Consultations",
                  desc: "Conduct secure virtual or in-person consultations.",
                  img: "/images/consultation.png",
                },
                {
                  title: "Upload Prescriptions",
                  desc: "Share prescriptions quickly and securely.",
                  img: "/images/prescription.png",
                },
                {
                  title: "Receive Payments",
                  desc: "Smooth integrated payment experience.",
                  img: "/images/payment.png",
                },
                {
                  title: "Manage Patients",
                  desc: "Review patient history and maintain accurate records.",
                  img: "/images/patient.png",
                },
                {
                  title: "Manage Services",
                  desc: "List services and manage availability effortlessly.",
                  img: "/images/services.png",
                },
                {
                  title: "Profile & Reputation",
                  desc: "Maintain your professional presence and trust.",
                  img: "/images/profile.png",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-6 shadow-lg border transition hover:shadow-xl flex flex-col items-center text-center
                    ${
                      isDarkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                >
                  <img src={item.img} alt={item.title} className="h-36 mb-4" />
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
