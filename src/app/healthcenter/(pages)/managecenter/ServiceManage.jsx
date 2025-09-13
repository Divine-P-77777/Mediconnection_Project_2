"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {Loader} from "lucide-react";

const HealthCenterServicesManage = () => {
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const { user } = useAuth();
    const user_id = user?.id;

    const [healthCenterId, setHealthCenterId] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ service_name: "", price: 0 });
    const [editingId, setEditingId] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [initLoading, setInitLoading] = useState(true);

    // Fetch health center id
    useEffect(() => {
        if (!user_id) {
            setInitLoading(false);
            setHealthCenterId(null);
            return;
        }
        setInitLoading(true);
        fetch(`/api/healthcenter/getHealthCenterId?user_id=${user_id}`)
            .then((res) => res.json())
            .then((data) => {
                setHealthCenterId(data.health_center_id || null);
                setInitLoading(false);
            })
            .catch((err) => {
                setErrorMsg("Failed to load health center: " + err.message);
                setHealthCenterId(null);
                setInitLoading(false);
            });
    }, [user_id]);

    // Fetch services
    const fetchServices = async () => {
        if (!healthCenterId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/healthcenter/service?health_center_id=${healthCenterId}`);
            const data = await res.json();
            if (data.success) {
                setServices(data.services || []);
                setErrorMsg("");
            } else {
                setErrorMsg(data.error || "Failed to fetch services");
            }
        } catch (err) {
            setErrorMsg("Error fetching services: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (healthCenterId) fetchServices();
    }, [healthCenterId]);

    // Save / Update
    const handleSave = async () => {
        setErrorMsg("");
        if (!form.service_name.trim()) {
            setErrorMsg("Service name required");
            return;
        }
        if (!healthCenterId) {
            setErrorMsg("Health center not found!");
            return;
        }
        try {
            setLoading(true);
            const method = editingId ? "PATCH" : "POST";
            const body = editingId
                ? { id: editingId, service_name: form.service_name, price: form.price }
                : { health_center_id: healthCenterId, service_name: form.service_name, price: form.price };
            const res = await fetch("/api/healthcenter/service", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error || "Failed");
            setForm({ service_name: "", price: 0 });
            setEditingId(null);
            fetchServices();
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (service) => {
        setForm({ service_name: service.service_name, price: service.price });
        setEditingId(service.id);
        setErrorMsg("");
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure to delete this service?")) return;
        setErrorMsg("");
        try {
            setLoading(true);
            const res = await fetch(`/api/healthcenter/service?id=${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error || "Failed");
            fetchServices();
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (initLoading) {
        return (
            <section className={`p-4 rounded-md ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} shadow-md flex justify-center items-center min-h-[200px]`}>
           <Loader className="w-8 h-8 animate-spin" color="cyan" />
           </section>
        );
    }

    if (!healthCenterId) {
        return (
            <div className={`p-4  ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} shadow-md`}>
                <div className="py-8 text-center text-red-600">No health center found for your account.</div>
                {errorMsg && <div className="mt-2 text-red-500">{errorMsg}</div>}
            </div>
        );
    }

    return (
        <div className={`p-4  ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} shadow-md`}>
            <h2 className="text-lg font-semibold mb-4">Manage Services</h2>
            {errorMsg && <div className="mb-4 text-red-500">{errorMsg}</div>}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Service Name"
                    className={`flex-1 px-3 py-2 rounded border ${isDarkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-gray-100 border-gray-300"
                        }`}
                    value={form.service_name}
                    onChange={(e) => setForm({ ...form, service_name: e.target.value })}
                    disabled={loading}
                />
                <input
                    type="number"
                    placeholder="Price"
                    className={`w-24 px-3 py-2 rounded border ${isDarkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-gray-100 border-gray-300"
                        }`}
                    value={form.price}
                    min={0}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    disabled={loading}
                />
                <button
                    onClick={handleSave}
                    disabled={loading || !healthCenterId}
                    className={`px-4 py-2 rounded transition ${loading ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                >
                    {loading ? "Saving..." : editingId ? "Update" : "Add"}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className={`min-w-full text-left border ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                    <thead className={`${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-700"}`}>
                        <tr>
                            <th className="px-4 py-2">Service</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((s) => (
                            <tr key={s.id} className={`${isDarkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"}`}>
                                <td className="px-4 py-2">{s.service_name}</td>
                                <td className="px-4 py-2">{s.price}</td>
                                <td className="px-4 py-2 flex gap-2">
                                    <button onClick={() => handleEdit(s)} disabled={loading} className="px-2 py-1 bg-yellow-500 rounded hover:bg-yellow-600 text-white">Edit</button>
                                    <button onClick={() => handleDelete(s.id)} disabled={loading} className="px-2 py-1 bg-red-500 rounded hover:bg-red-600 text-white">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {services.length === 0 && <tr><td colSpan="3" className="text-center py-4 text-gray-500">No services yet</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HealthCenterServicesManage;