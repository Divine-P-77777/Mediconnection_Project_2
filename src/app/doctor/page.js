"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { supabase } from "@/supabase/client";
import { Loader2, LogOut } from "lucide-react";
import AccountNoSet from "./components/AccountNoSet";

const DoctorHomePage = () => {
  const { user, signOut } = useAuth();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAccountPopup, setShowAccountPopup] = useState(false);

  const fetchDoctorData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) setData(data);
      else setData(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [user]);

  const username = data?.name || user?.email?.split("@")[0] || "Doctor";

  return (
    <div className={`min-h-screen pt-20 px-6 flex flex-col items-center transition-colors ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      
      {/* Welcome Section */}
      <div className="text-center space-y-3 max-w-2xl">
        <h2 className="text-2xl font-semibold">Hello, Dr. {username} 👋</h2>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>

        <h1 className="text-3xl md:text-4xl font-bold">Welcome to the Doctor's Portal</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Manage your patients, appointments, services, and profile in one place.
        </p>

        {/* Show popup if account number is missing */}
        {!data?.account_number && (
          <button
            onClick={() => setShowAccountPopup(true)}
            className="mt-3 px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition"
          >
            Set Account Number
          </button>
        )}
      </div>

      {/* Links Section */}
      <div className="grid gap-4 mt-10 sm:grid-cols-2 md:grid-cols-3 w-full max-w-4xl">
        <Link href="/doctor/dashboard" className="px-6 py-4 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition text-center">Dashboard</Link>
        <Link href="/doctor/appointments" className="px-6 py-4 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition text-center">Appointments</Link>
        <Link href="/doctor/patients" className="px-6 py-4 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition text-center">Patients</Link>
        <Link href="/doctor/manageprofile" className="px-6 py-4 bg-yellow-500 text-white rounded-xl shadow hover:bg-yellow-600 transition text-center">Manage Profile</Link>
        <Link href="/doctor/manageservice" className="px-6 py-4 bg-cyan-500 text-white rounded-xl shadow hover:bg-cyan-600 transition text-center">Manage Services</Link>
      </div>

      {/* Info Section */}
      <div className="mt-12 max-w-3xl text-center">
        <h3 className="text-xl font-semibold mb-3">About the Doctor Portal</h3>
        <p className="text-gray-600 dark:text-gray-400">
          The Doctor's Portal helps you streamline your workflow — managing appointments, patient records, services, and professional profile.
          <span className="font-semibold block mt-2">
            If you are signing in for the first time, please update your profile and set your account number to start using paid services.
          </span>
        </p>
      </div>

      {/* Account Number Popup */}
      <AccountNoSet
        userId={user?.id}
        isOpen={showAccountPopup}
        onClose={() => setShowAccountPopup(false)}
        onSuccess={(accountNo) => setData((prev) => ({ ...prev, account_number: accountNo }))}
      />
    </div>
  );
};

export default DoctorHomePage;
