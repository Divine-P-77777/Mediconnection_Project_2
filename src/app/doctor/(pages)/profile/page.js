"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Stethoscope, Phone, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import CloudinaryUpload from "@/app/components/Cloudinary";
import Loader from  "@/app/components/Loader";


export default function DoctorProfile() {
  const { user } = useAuth();
  const { Success, errorToast } = useToast();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [visibleAC, setVisibleAC] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    contact: "",
    profile: "",
    account_number: "",
  });

  const toggleVisible = () => setVisibleAC(!visibleAC);

  // Fetch doctor profile via API
  const fetchDoctorData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/doctor/me?userId=${user.id}`);
      const { data, error } = await res.json();

      if (error) throw new Error(error);

      if (data) {
        setDoctor(data);
        setForm({
          name: data.name || "",
          specialization: data.specialization || "",
          contact: data.contact || "",
          profile: data.profile || "",
          account_number: data.account_number || "",
        });
      }
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update doctor profile via API
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/doctor/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: form.name,
          specialization: form.specialization,
          contact: form.contact,
          profile: form.profile,
          account_number: form.account_number,
        }),
      });

      const { data, error } = await res.json();
      if (error) throw new Error(error);

      Success("Profile updated successfully!");
      setDoctor(data);
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [user]);

  

  if (loading && !doctor) {
    return (
        <Loader/> )
  }

  return (
    <div
      className={`pt-30 min-h-screen p-6 transition-colors ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col items-center mb-6 gap-3">
        <CloudinaryUpload
          currentImage={form.profile}
          onUpload={(url) => setForm({ ...form, profile: url })}
        />
        <h2 className="text-2xl font-bold">Dr. {doctor?.name || "Profile"}</h2>
        <span className="text-sm text-gray-500">{user?.email}</span>
      </div>

      {/* Update Form */}
      <form
        onSubmit={handleUpdate}
        className={`space-y-3 mt-6 p-4 rounded-xl shadow ${
          isDarkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border"
        }`}
      >
        <h3 className="text-xl font-semibold mb-2">Update Profile</h3>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={`border p-2 rounded w-full ${
            isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-gray-50 text-gray-900 border-gray-300"
          }`}
          required
        />
        <input
          placeholder="Specialization"
          value={form.specialization}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          className={`border p-2 rounded w-full ${
            isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-gray-50 text-gray-900 border-gray-300"
          }`}
          required
        />
        <input
          placeholder="Contact"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className={`border p-2 rounded w-full ${
            isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-gray-50 text-gray-900 border-gray-300"
          }`}
        />

        <button
          type="submit"
          className={`w-full py-2 rounded font-semibold transition-colors ${
            isDarkMode
              ? "bg-cyan-600 hover:bg-cyan-500 text-white"
              : "bg-cyan-500 hover:bg-cyan-400 text-white"
          }`}
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
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-green-100"
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
            <strong>Health Center ID:</strong>{" "}
            {doctor.health_center_id || "Not Set"}
          </p>

          <p className="flex items-center gap-2 mt-2">
            <strong>Account Number:</strong>{" "}
            {visibleAC ? doctor.account_number || "Not Set" : "*************"}
            <button
              onClick={toggleVisible}
              className="ml-2 text-blue-500 text-sm"
            >
              {visibleAC ? "Hide" : <Eye className="h-4 w-4" />}
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
