"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import Loader from "@/app/components/Loader";

/* -------------------- CONSTANTS -------------------- */

const ITEMS_PER_PAGE = 10;

/* -------------------- TYPES -------------------- */

interface HealthCenter {
  id: number;
  name: string;
}

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  contact: string;
}

interface DoctorForm {
  id: number | null;
  name: string;
  email: string;
  password: string;
  specialization: string;
  contact: string;
}

/* -------------------- COMPONENT -------------------- */

const ManageDoctors = ()=> {
  const { success: Success, errorToast } = useToast();
  const { user } = useAuth();

  const isDarkMode = useAppSelector(
    (state) => state.theme.isDarkMode
  );

  const [healthCenter, setHealthCenter] = useState<HealthCenter | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  /* ---------- Form State ---------- */
  const [form, setForm] = useState<DoctorForm>({
    id: null,
    name: "",
    email: "",
    password: "",
    specialization: "",
    contact: "",
  });

  /* ---------- Pagination ---------- */
  const [currentPage, setCurrentPage] = useState<number>(1);

  /* -------------------- FETCH HEALTH CENTER -------------------- */

  useEffect(() => {
    const fetchHealthCenter = async (): Promise<void> => {
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

        setHealthCenter(data as HealthCenter);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load health center";
        errorToast(message);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthCenter();
  }, [errorToast]);

  /* -------------------- FETCH DOCTORS -------------------- */

  const fetchDoctors = async (): Promise<void> => {
    if (!healthCenter?.id) return;

    try {
      setLoading(true);
      const res = await fetch(
        `/api/healthcenter/doctor?health_center_id=${healthCenter.id}`
      );

      const data: {
        data?: Doctor[];
        error?: string;
      } = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch doctors");
      }

      setDoctors(data.data ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch doctors";
      errorToast(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (healthCenter?.id) fetchDoctors();
  }, [healthCenter]);

  /* -------------------- ADD / UPDATE DOCTOR -------------------- */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!healthCenter?.id) {
      errorToast("Health center not loaded yet");
      return;
    }

    try {
      setLoading(true);

      const method: "POST" | "PUT" = form.id ? "PUT" : "POST";

      const res = await fetch("/api/healthcenter/doctor", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          health_center_id: healthCenter.id,
        }),
      });

      const data: { error?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add/update doctor");
      }

      Success(
        form.id
          ? "✅ Doctor updated successfully!"
          : "✅ Doctor added successfully!"
      );

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
      const message =
        err instanceof Error ? err.message : "Operation failed";
      errorToast(message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- DELETE DOCTOR -------------------- */

  const handleDeleteDoctor = async (id: number): Promise<void> => {
    try {
      const res = await fetch("/api/healthcenter/doctor", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data: { error?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete doctor");
      }

      Success("🗑️ Doctor deleted successfully");
      fetchDoctors();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Delete failed";
      errorToast(message);
    }
  };

  /* -------------------- EDIT DOCTOR -------------------- */

  const handleEditDoctor = (doctor: Doctor): void => {
    setForm({
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      password: "",
      specialization: doctor.specialization,
      contact: doctor.contact,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* -------------------- PAGINATION -------------------- */

  const totalPages = Math.max(
    1,
    Math.ceil(doctors.length / ITEMS_PER_PAGE)
  );

  const paginatedDoctors = doctors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading && !healthCenter) {
    return <Loader />;
  }

  /* -------------------- UI -------------------- */

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

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-3 mb-10 p-6 rounded-xl shadow-md ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-xl font-semibold text-cyan-600 text-center">
            {form.id ? "Edit Doctor" : "Add a New Doctor"}
          </h3>

          {(
            ["name", "email", "password", "specialization", "contact"] as const
          ).map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, [field]: e.target.value })
              }
              className="border p-3 rounded-lg w-full text-sm"
              required={field !== "contact" && field !== "password"}
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 text-white px-6 py-3 rounded-lg font-semibold w-full flex justify-center items-center"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            {form.id ? "Update Doctor" : "Add Doctor"}
          </button>
        </form>

        {/* LIST */}
        {doctors.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            No doctors found yet.
          </p>
        ) : (
          <>
            <ul className="space-y-3">
              {paginatedDoctors.map((d) => (
                <li
                  key={d.id}
                  className={`flex justify-between items-center p-4 rounded-xl ${
                    isDarkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
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
                      className="bg-cyan-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(d.id)}
                      className="bg-red-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* PAGINATION */}
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
  );
};

export default ManageDoctors;
