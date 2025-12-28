"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Loader from "../../components/Loader";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";

/* ---------------- TYPES ---------------- */

interface HealthCenter {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

/* ---------------- COMPONENT ---------------- */

const HealthCenterHomePage = () => {
  const { user } = useAuth();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { errorToast } = useToast();

  const [data, setData] = useState<HealthCenter | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHealthCenterData = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch("/api/healthcenter/me");
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Failed to load health center data");
      }

      setData(result?.data ?? null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        errorToast(err.message);
      } else {
        errorToast("Something went wrong while loading data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHealthCenterData();
    }
  }, [user]);

  const centerName: string = data?.name ?? "Health Center";

  return (
    <div
      className={`transition-colors ${isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
        }`}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Section 1 - Quick Access */}
          <section className="min-h-screen justify-center px-6 flex flex-col items-center">
            <div className="text-center space-y-4 max-w-2xl">
              <h2 className="text-2xl font-semibold">
                Welcome, {centerName}
              </h2>

              <h1 className="text-3xl md:text-4xl font-bold">
                Health Center Portal
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400">
                Manage your center, doctors, availability, and profile in one place.
              </p>

              {!data && (
                <Link href="/healthcenter/accountdetails">
                  <button className="mt-3 px-5 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 shadow-md transition">
                    Set Up Health Center Account
                  </button>
                </Link>
              )}
            </div>

            {/* Navigation Cards */}
            <div className="grid gap-5 mt-12 sm:grid-cols-2 md:grid-cols-3 w-full max-w-4xl">
              {[
                { label: "Dashboard", path: "/healthcenter/dashboard" },
                { label: "Manage Availability", path: "/healthcenter/manageavailability" },
                { label: "Manage Doctors", path: "/healthcenter/managedoctors" },
                { label: "Manage Profile", path: "/healthcenter/profile" },
              ].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="px-6 py-5 rounded-2xl bg-cyan-500 text-white shadow hover:bg-cyan-600 transition text-center font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          {/* Section 2 - Features */}
          <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
            <div className="text-center max-w-3xl mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Why use the Health Center Portal?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Explore the features that make managing your health center seamless.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 w-full max-w-5xl">
              {[
                {
                  title: "Centralized Dashboard",
                  desc: "Get a complete overview of your health center's operations.",
                  img: "/images/dashboard.svg",
                },
                {
                  title: "Manage Availability",
                  desc: "Control operating hours and manage patient appointments.",
                  img: "/images/calendar.svg",
                },
                {
                  title: "Doctors Management",
                  desc: "Add, edit, and monitor doctors in your center.",
                  img: "/images/doctors.svg",
                },
                {
                  title: "Profile & Reputation",
                  desc: "Maintain an updated profile to build trust with patients.",
                  img: "/images/profile.svg",
                },
                {
                  title: "Patient Records",
                  desc: "Securely manage and access patient records.",
                  img: "/images/patients.svg",
                },
                {
                  title: "Payments & Billing",
                  desc: "Track earnings and manage financials with ease.",
                  img: "/images/payment.svg",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`rounded-2xl ${isDarkMode ? "bg-gray-900" : "bg-white"
                    } border border-cyan-300 shadow-md hover:shadow-lg transition p-6 text-center flex flex-col items-center`}
                >
                  <img src={item.img} alt={item.title} className="h-20 mb-4" />
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

export default HealthCenterHomePage;
