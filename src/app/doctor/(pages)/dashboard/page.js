"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, User, Stethoscope, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {Eye} from "lucide-react";
import { set } from "date-fns/set";

export default function DoctorDashboard() {
  const { user, } = useAuth();
  const { Success, errorToast } = useToast();
  const router = useRouter();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
const[visibleAC, SetVisibleAC]=useState(false);

const togleVisible =()=>{
  SetVisibleAC(!visibleAC)
}

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    contact: "",
  });

  // Fetch doctor data
  const fetchDoctorData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", user.id)
        .maybeSingle(); // ✅ avoid "multiple/no rows" error

      if (error) throw error;
      if (data) {
        setDoctor(data);
        setForm({
          name: data.name || "",
          specialization: data.specialization || "",
          contact: data.contact || "",
        });
      }
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [user]);

  // Update doctor data
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("doctors")
        .update({
          name: form.name,
          specialization: form.specialization,
          contact: form.contact,
        })
        .eq("id", user.id)
        .select()
        .maybeSingle(); // ✅ safer

      if (error) throw error;

      Success("Profile updated successfully!");
      setDoctor(data);
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !doctor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 transition-colors ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Welcome, Dr. {doctor?.name || "Profile"}
        </h2>
        
      </div>

      {/* Email Display */}
      <div
        className={`w-fit my-2 rounded-2xl px-3 py-1 ${
          isDarkMode ? "bg-gray-700" : "bg-amber-300"
        }`}
      >
        My Email: {user?.email}
      </div>

      {/* Update Form */}
      <form
        onSubmit={handleUpdate}
        className={`space-y-3 mt-6 p-4 rounded-xl shadow ${
          isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border"
        }`}
      >
        <h3 className="text-xl font-semibold mb-2">Update Profile</h3>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          placeholder="Specialization"
          value={form.specialization}
          onChange={(e) =>
            setForm({ ...form, specialization: e.target.value })
          }
          className="border p-2 rounded w-full"
          required
        />
        <input
          placeholder="Contact"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
          ) : (
            "Update Profile"
          )}
        </button>
      </form>

      {/* Doctor Details Card */}
      {doctor && (
        <div
          className={`mt-6 p-4 rounded-xl shadow ${
            isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-green-100"
          }`}
        >
          <h3 className="text-lg font-semibold mb-2">Doctor Details</h3>
          <p className="flex items-center gap-2">
            <User className="h-4 w-4" /> <strong>Name:</strong> {doctor.name}
          </p>
          <p>
            <strong>Email:</strong> {doctor.email}
          </p>
          <p className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />{" "}
            <strong>Specialization:</strong> {doctor.specialization}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> <strong>Contact:</strong>{" "}
            {doctor.contact}
          </p>
          <p className="flex items-center gap-2">
            
          </p>

          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> <strong>Health Center ID:</strong>{" "}
            {doctor.health_center_id ? doctor.health_center_id : "Not Set"}
          </p>

          <p className="">
            {visibleAC ? (
              <>
               <strong>My Account Numbaer:</strong>{" "}
            {doctor.account_number ? doctor.account_number : "Not Set"}
              </>
            ) :                 <strong>My Account Number: *************</strong>
}
            <button onClick={togleVisible} className="ml-2 text-blue-500">
              {visibleAC ? "Hide" : <Eye className="h-4 w-4" />}
            </button>
          </p>
          
        </div>
      )}
    </div>
  );
}
