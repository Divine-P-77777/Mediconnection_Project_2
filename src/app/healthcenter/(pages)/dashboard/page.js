"use client";

import { useEffect, useState } from "react";
import { Loader2, LogOut, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, redirect } from "next/navigation";
import { useSelector } from "react-redux";

const HealthCenterDashboard = () => {
  const { Success, errorToast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [healthCenter, setHealthCenter] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    contact: "",
  });

  // Fetch health center for current user
  useEffect(() => {
    const fetchHealthCenter = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session?.user) redirect("/auth/healthcenter");

        const { data, error } = await supabase
          .from("health_centers")
          .select("id, name")
          .eq("user_id", session.user.id) // ✅ fix here
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error("No linked health center found");

        setHealthCenter(data);
      } catch (err) {
        errorToast(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthCenter();
  }, []);

  // Fetch doctors linked to health center
  const fetchDoctors = async () => {
    if (!healthCenter?.id) return;
    try {
      setLoading(true);
      const res = await fetch(
        `/api/healthcenter/doctor?health_center_id=${healthCenter.id}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch doctors");
      setDoctors(data.data);
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (healthCenter?.id) fetchDoctors();
  }, [healthCenter]);

  // Add doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!healthCenter?.id) return errorToast("Health center not loaded yet");

    try {
      setLoading(true);
      const res = await fetch("/api/healthcenter/doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, health_center_id: healthCenter.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add doctor");

      Success("Doctor added successfully!");
      setForm({
        name: "",
        email: "",
        password: "",
        specialization: "",
        contact: "",
      });
      fetchDoctors();
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete doctor
  const handleDeleteDoctor = async (id) => {
    try {
      const res = await fetch("/api/healthcenter/doctor", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete doctor");
      Success("Doctor deleted successfully");
      fetchDoctors();
    } catch (err) {
      errorToast(err.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/auth/healthcenter");
    } catch (err) {
      errorToast(err.message);
    }
  };

  if (loading && !healthCenter)
    return <Loader2 className="h-6 w-6 animate-spin" />;

  return (
    <div
      className={`min-h-screen p-6 transition-colors ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Welcome, {healthCenter?.name || "Health Center"}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      <div
        className={`w-fit my-2 rounded-2xl px-3 py-1 ${
          isDarkMode ? "bg-gray-700" : "bg-amber-300"
        }`}
      >
        My Email : {user?.email}
      </div>

      {/* Add Doctor Form */}
      <form
        onSubmit={handleAddDoctor}
        className={`space-y-2 mb-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } p-4 rounded-xl shadow`}
      >
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin mr-2 inline-block" />
          )}{" "}
          Add Doctor
        </button>
      </form>

      {/* Doctors List */}
      <h3 className="text-xl font-semibold mb-2">Doctors</h3>
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <ul>
          {doctors.map((d) => (
            <li
              key={d.id}
              className={`flex justify-between items-center border p-2 rounded mb-2 ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
              }`}
            >
              <div>
                <p>
                  <strong>{d.name}</strong> ({d.specialization})
                </p>
                <p>
                  {d.email} | {d.contact}
                </p>
              </div>
              <button
                onClick={() => handleDeleteDoctor(d.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HealthCenterDashboard;
