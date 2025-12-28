"use client";

import { FC, useEffect, useState, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Stethoscope, Phone, Eye } from "lucide-react";
import CloudinaryUpload from "@/app/components/Cloudinary";
import Loader from "@/app/components/Loader";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

/* ================= TYPES ================= */

interface DoctorProfileData {
  id: string;
  name: string;
  email: string;
  specialization: string;
  contact: string;
  profile: string;
  account_number: string | null;
  health_center_id?: string | null;
}

interface DoctorProfileForm {
  name: string;
  specialization: string;
  contact: string;
  profile: string;
  account_number: string;
}

/* ================ COMPONENT ================ */

const DoctorProfile: FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { success: Success, errorToast } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const [visibleAC, setVisibleAC] = useState<boolean>(false);
  const [doctor, setDoctor] = useState<DoctorProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [form, setForm] = useState<DoctorProfileForm>({
    name: "",
    specialization: "",
    contact: "",
    profile: "",
    account_number: "",
  });

  const toggleVisible = (): void => setVisibleAC((prev) => !prev);

  if (!user) {
    router.push("/auth/doctor");
    errorToast("Please login to access doctor portal");
    return null;
  }

  const fetchDoctorData = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch(`/api/doctor/me?userId=${user.id}`);
      const result: { data?: DoctorProfileData; error?: string } =
        await res.json();

      if (result.error) throw new Error(result.error);

      if (result.data) {
        setDoctor(result.data);
        setForm({
          name: result.data.name ?? "",
          specialization: result.data.specialization ?? "",
          contact: result.data.contact ?? "",
          profile: result.data.profile ?? "",
          account_number: result.data.account_number ?? "",
        });
      }
    } catch (err) {
      errorToast((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/doctor/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...form,
        }),
      });

      const result: { data?: DoctorProfileData; error?: string } =
        await res.json();

      if (result.error) throw new Error(result.error);

      if (result.data) {
        setDoctor(result.data);
        Success("Profile updated successfully!");
      }
    } catch (err) {
      errorToast((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [user]);

  if (loading && !doctor) {
    return <Loader />;
  }

  return (
    <div
      className={`pt-30 min-h-screen p-6 transition-colors ${isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
        }`}
    >
      <div className="flex flex-col items-center mb-6 gap-3">
        <CloudinaryUpload
          currentImage={form.profile}
          onUpload={(url: string) =>
            setForm((prev) => ({ ...prev, profile: url }))
          }
        />
        <h2 className="text-2xl font-bold">
          Dr. {doctor?.name || "Profile"}
        </h2>
        <span className="text-sm text-gray-500">{user.email}</span>
      </div>

      <form
        onSubmit={handleUpdate}
        className={`space-y-3 mt-6 p-4 rounded-xl shadow ${isDarkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border"
          }`}
      >
        <h3 className="text-xl font-semibold mb-2">Update Profile</h3>

        <input
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Name"
          required
          className={`border p-2 rounded w-full ${isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-gray-50 border-gray-300"
            }`}
        />

        <input
          value={form.specialization}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              specialization: e.target.value,
            }))
          }
          placeholder="Specialization"
          required
          className={`border p-2 rounded w-full ${isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-gray-50 border-gray-300"
            }`}
        />

        <input
          value={form.contact}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, contact: e.target.value }))
          }
          placeholder="Contact"
          className={`border p-2 rounded w-full ${isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-gray-50 border-gray-300"
            }`}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded font-semibold transition-colors ${isDarkMode
              ? "bg-cyan-600 hover:bg-cyan-500"
              : "bg-cyan-500 hover:bg-cyan-400"
            } text-white`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
          ) : (
            "Update Profile"
          )}
        </button>
      </form>

      {doctor && (
        <div
          className={`mt-6 p-4 rounded-xl shadow ${isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-green-100"
            }`}
        >
          <h3 className="text-lg font-semibold mb-2">Doctor Details</h3>

          <p className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <strong>Name:</strong> {doctor.name}
          </p>

          <p>
            <strong>Email:</strong> {doctor.email}
          </p>

          <p className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <strong>Specialization:</strong> {doctor.specialization}
          </p>

          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <strong>Contact:</strong> {doctor.contact}
          </p>

          <p className="mt-2 flex items-center gap-2">
            <strong>Account Number:</strong>
            {visibleAC
              ? doctor.account_number || "Not Set"
              : "************"}
            <button
              type="button"
              onClick={toggleVisible}
              className="ml-2 text-blue-500"
            >
              {visibleAC ? "Hide" : <Eye className="h-4 w-4" />}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
