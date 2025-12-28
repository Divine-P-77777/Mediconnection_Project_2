"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";

/* ================= TYPES ================= */

interface DoctorService {
  id: string;
  service_name: string;
  price: number;
  duration_minutes: number;
}

interface ServiceForm {
  service_name: string;
  price: number;
  duration_minutes: number;
}

/* ================ COMPONENT ================ */

const DoctorServicesManage: FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { errorToast } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const doctor_id: string | undefined = user?.id;

  const [services, setServices] = useState<DoctorService[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>({
    service_name: "",
    price: 0,
    duration_minutes: 30,
  });

  if (!user) {
    router.push("/auth/doctor");
    errorToast("Please login to access doctor portal");
    return null;
  }

  const fetchServices = async (): Promise<void> => {
    if (!doctor_id) return;
    try {
      setLoading(true);
      const res = await fetch(
        `/api/doctor/service?doctor_id=${doctor_id}`
      );
      const result: { data?: DoctorService[]; error?: string } =
        await res.json();

      if (result.error) throw new Error(result.error);
      setServices(result.data ?? []);
    } catch (err) {
      errorToast((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [doctor_id]);

  const handleSave = async (): Promise<void> => {
    if (!form.service_name.trim()) {
      errorToast("Service name required");
      return;
    }

    try {
      setLoading(true);
      const method = editingId ? "PATCH" : "POST";
      const payload = editingId
        ? { ...form, id: editingId }
        : { ...form, doctor_id };

      const res = await fetch("/api/doctor/service", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result: { error?: string } = await res.json();
      if (result.error) throw new Error(result.error);

      setForm({ service_name: "", price: 0, duration_minutes: 30 });
      setEditingId(null);
      fetchServices();
    } catch (err) {
      errorToast((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: DoctorService): void => {
    setForm({
      service_name: service.service_name,
      price: service.price,
      duration_minutes: service.duration_minutes,
    });
    setEditingId(service.id);
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm("Are you sure to delete this service?")) return;
    try {
      const res = await fetch("/api/doctor/service", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result: { error?: string } = await res.json();
      if (result.error) throw new Error(result.error);

      fetchServices();
    } catch (err) {
      errorToast((err as Error).message);
    }
  };

  return (
    <div
      className={`min-h-screen pt-20 px-6 transition-colors ${isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-white text-black"
        }`}
    >
      <h1 className="text-3xl font-bold mb-6 text-cyan-500">
        Manage Your Services
      </h1>

      <div
        className={`p-6 rounded-2xl shadow-md mb-6 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
      >
        <input
          value={form.service_name}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              service_name: e.target.value,
            }))
          }
          placeholder="Service Name"
          className={`w-full mb-3 px-3 py-2 rounded border ${isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white border-gray-300"
            }`}
        />

        <input
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              price: Number(e.target.value),
            }))
          }
          placeholder="Price (0 for free)"
          className={`w-full mb-3 px-3 py-2 rounded border ${isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white border-gray-300"
            }`}
        />

        <input
          type="number"
          value={form.duration_minutes}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              duration_minutes: Number(e.target.value),
            }))
          }
          placeholder="Duration (minutes)"
          className={`w-full mb-4 px-3 py-2 rounded border ${isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white border-gray-300"
            }`}
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-6 py-2 rounded-xl font-semibold transition ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-cyan-500 hover:bg-cyan-600 text-white"
            }`}
        >
          {editingId ? "Update Service" : "Add Service"}
        </button>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-4 rounded-2xl shadow-md flex justify-between ${isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
          >
            <div>
              <h3 className="font-semibold text-lg">
                {service.service_name}
              </h3>
              <p className="text-sm">
                {service.price > 0
                  ? `₹${service.price} (Paid)`
                  : "Free"}
              </p>
              <p className="text-sm">
                Duration: {service.duration_minutes} min
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(service)}
                className="px-3 py-1 rounded bg-cyan-500 text-white hover:bg-cyan-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorServicesManage;
