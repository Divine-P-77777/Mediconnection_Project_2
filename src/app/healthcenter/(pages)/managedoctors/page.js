"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import Loader from "@/app/components/Loader";

const ITEMS_PER_PAGE = 10;

const ManageDoctors = () => {
  const { Success, errorToast } = useToast();
  const { user } = useAuth();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [healthCenter, setHealthCenter] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Form State
  const [form, setForm] = useState({
    id: null, // track editing
    name: "",
    email: "",
    password: "",
    specialization: "",
    contact: "",
  });

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Fetch Health Center
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
          .eq("user_id", session.user.id)
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

  // ✅ Fetch Doctors
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

  // ✅ Add / Update Doctor
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!healthCenter?.id) return errorToast("Health center not loaded yet");

    try {
      setLoading(true);

      // If editing → PUT
      const method = form.id ? "PUT" : "POST";
      const res = await fetch("/api/healthcenter/doctor", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, health_center_id: healthCenter.id }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to add/update doctor");

      Success(form.id ? "✅ Doctor updated successfully!" : "✅ Doctor added successfully!");
      setForm({
        id: null,
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

  // ✅ Delete Doctor
  const handleDeleteDoctor = async (id) => {
    try {
      const res = await fetch("/api/healthcenter/doctor", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete doctor");
      Success("🗑️ Doctor deleted successfully");
      fetchDoctors();
    } catch (err) {
      errorToast(err.message);
    }
  };

  // ✅ Edit Doctor
  const handleEditDoctor = (doctor) => {
    setForm({
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      password: "", // do not auto fill password
      specialization: doctor.specialization,
      contact: doctor.contact,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pagination logic
  const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);
  const paginatedDoctors = doctors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading && !healthCenter)
    return (
      <>
        <Loader />
      </>
    );

  return (
    <div
      className={`min-h-screen py-32 transition-colors ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-center text-3xl font-bold mb-10">
          Manage & Create Doctor Accounts
        </h1>

        {/* Add / Edit Doctor Form */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-3 mb-10 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-xl shadow-md`}
        >
          <h3 className="text-xl font-semibold text-cyan-600 text-center">
            {form.id ? "Edit Doctor" : "Add a New Doctor"}
          </h3>
          {["name", "email", "password", "specialization", "contact"].map(
            (field) => (
              <input
                key={field}
                type={field === "password" ? "password" : "text"}
                placeholder={
                  field.charAt(0).toUpperCase() + field.slice(1)
                }
                value={form[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                className="border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 p-3 rounded-lg w-full text-sm transition"
                required={field !== "contact" && field !== "password"}
              />
            )
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition w-full flex justify-center items-center"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin mr-2 inline-block" />
            )}
            {form.id ? "Update Doctor" : "Add Doctor"}
          </button>
        </form>

        {/* Doctors List */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-cyan-600">
            Doctors
          </h3>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
          ) : doctors.length === 0 ? (
            <p className="text-gray-500 italic text-center">
              No doctors found yet.
            </p>
          ) : (
            <>
              <ul className="space-y-3">
                {paginatedDoctors.map((d) => (
                  <li
                    key={d.id}
                    className={`flex justify-between items-center p-4 rounded-xl shadow-sm transition ${
                      isDarkMode
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-white border border-gray-200 hover:shadow-md"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-lg">{d.name}</p>
                      <p className="text-sm text-gray-500">
                        {d.specialization} | {d.email} | {d.contact}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditDoctor(d)}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1.5 rounded-lg text-sm shadow transition flex items-center gap-1"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(d.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm shadow transition flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-6 gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 rounded bg-cyan-500 disabled:bg-gray-300 text-white"
                >
                  Prev
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 rounded bg-cyan-500 disabled:bg-gray-300 text-white"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;
