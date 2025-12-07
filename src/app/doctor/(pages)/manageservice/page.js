"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const DoctorServicesManage = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { user } = useAuth();
  const doctor_id = user?.id;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ service_name: "", price: 0, duration_minutes: 30 });
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();
  const { errorToast } = useToast();

    if(!user){
    router.push("/auth/doctor");
    errorToast("Please login to access doctor portal");
    return null;
  }


  // Fetch services from API
  const fetchServices = async () => {
    if (!doctor_id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/doctor/service?doctor_id=${doctor_id}`);
      const data = await res.json();
      if (res.ok) setServices(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [doctor_id]);

  // Save or update service
  const handleSave = async () => {
    if (!form.service_name) return alert("Service name required");

    try {
      setLoading(true);
      const method = editingId ? "PATCH" : "POST";
      const body = editingId ? { ...form, id: editingId } : { ...form, doctor_id };
      const res = await fetch("/api/doctor/service", { 
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setForm({ service_name: "", price: 0, duration_minutes: 30 });
      setEditingId(null);
      fetchServices();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setForm({ service_name: service.service_name, price: service.price, duration_minutes: service.duration_minutes });
    setEditingId(service.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this service?")) return;
    try {
      const res = await fetch("/api/doctor/service", { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      fetchServices();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={`min-h-screen pt-20 px-6 transition-colors ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h1 className="text-3xl font-bold mb-6 text-cyan-500">Manage Your Services</h1>
      <p className="mb-4 text-sm opacity-80">
        Add, edit or remove your consulting services. Set pricing or mark as free. Paid services use the account number from your profile.
      </p>

      {/* Form */}
      <div className={`p-6 rounded-2xl shadow-md mb-6 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <input
          type="text"
          placeholder="Service Name"
          value={form.service_name}
          onChange={(e) => setForm({ ...form, service_name: e.target.value })}
          className={`w-full mb-3 px-3 py-2 rounded border ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
        />
        <label htmlFor="price" className={`block mb-1 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Price (0 for free)</label>
        <input id="price"
          type="number"
          placeholder="Price (0 for free)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className={`w-full mb-3 px-3 py-2 rounded border ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
        />
        <label htmlFor="duration" className={`block mb-1 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Duration (minutes)</label>
        <input id="duration"
          type="number"
          placeholder="Duration (minutes)"
          value={form.duration_minutes}
          maxLength={60}
          onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
          className={`w-full mb-3 px-3 py-2 rounded border ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-6 py-2 rounded-xl font-semibold shadow-md transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600 text-white"}`}
        >
          {editingId ? "Update Service" : "Add Service"}
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className={`p-4 rounded-2xl shadow-md flex justify-between items-center ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            <div>
              <h3 className="font-semibold text-lg">{service.service_name}</h3>
              <p className="text-sm">{service.price > 0 ? `₹${service.price} (Paid)` : "Free"}</p>
              <p className="text-sm">Duration: {service.duration_minutes} min</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(service)} className="px-3 py-1 rounded bg-cyan-500 text-white hover:bg-cyan-600">Edit</button>
              <button onClick={() => handleDelete(service.id)} className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorServicesManage;
