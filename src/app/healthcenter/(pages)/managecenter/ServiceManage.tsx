"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "lucide-react";

/* ---------- Types ---------- */

interface RootState {
    theme: {
        isDarkMode: boolean;
    };
}

interface HealthCenterService {
    id: number;
    service_name: string;
    price: number;
}

interface ServiceForm {
    service_name: string;
    price: number;
}

/* ---------- Component ---------- */

const HealthCenterServicesManage = () => {
    const isDarkMode = useSelector(
        (state: RootState) => state.theme.isDarkMode
    );

    const { user } = useAuth();
    const userId: string | undefined = user?.id;

    const [healthCenterId, setHealthCenterId] = useState<number | null>(null);
    const [services, setServices] = useState<HealthCenterService[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [initLoading, setInitLoading] = useState<boolean>(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const [form, setForm] = useState<ServiceForm>({
        service_name: "",
        price: 0,
    });

    /* ---------- Fetch Health Center ID ---------- */
    useEffect(() => {
        if (!userId) {
            setHealthCenterId(null);
            setInitLoading(false);
            return;
        }

        setInitLoading(true);
        setErrorMsg("");

        fetch(`/api/healthcenter/getHealthCenterId?user_id=${userId}`)
            .then((res) => res.json())
            .then((data: { health_center_id?: number }) => {
                setHealthCenterId(data.health_center_id ?? null);
            })
            .catch((err: Error) => {
                setErrorMsg(`Failed to load health center: ${err.message}`);
                setHealthCenterId(null);
            })
            .finally(() => {
                setInitLoading(false);
            });
    }, [userId]);

    /* ---------- Fetch Services ---------- */
    const fetchServices = async (): Promise<void> => {
        if (!healthCenterId) return;

        setLoading(true);
        try {
            const res = await fetch(
                `/api/healthcenter/service?health_center_id=${healthCenterId}`
            );
            const data: {
                success: boolean;
                services?: HealthCenterService[];
                error?: string;
            } = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Failed to fetch services");
            }

            setServices(data.services ?? []);
            setErrorMsg("");
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Unknown error";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (healthCenterId) fetchServices();
    }, [healthCenterId]);

    /* ---------- Save / Update ---------- */
    const handleSave = async (): Promise<void> => {
        if (!form.service_name.trim()) {
            setErrorMsg("Service name required");
            return;
        }

        if (!healthCenterId) {
            setErrorMsg("Health center not found!");
            return;
        }

        setErrorMsg("");
        setLoading(true);

        try {
            const method = editingId ? "PATCH" : "POST";
            const payload = editingId
                ? {
                    id: editingId,
                    service_name: form.service_name,
                    price: form.price,
                }
                : {
                    health_center_id: healthCenterId,
                    service_name: form.service_name,
                    price: form.price,
                };

            const res = await fetch("/api/healthcenter/service", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data: { success: boolean; error?: string } = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Failed to save service");
            }

            setForm({ service_name: "", price: 0 });
            setEditingId(null);
            fetchServices();
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Unknown error";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- Edit ---------- */
    const handleEdit = (service: HealthCenterService): void => {
        setForm({
            service_name: service.service_name,
            price: service.price,
        });
        setEditingId(service.id);
        setErrorMsg("");
    };

    /* ---------- Delete ---------- */
    const handleDelete = async (id: number): Promise<void> => {
        if (!confirm("Are you sure to delete this service?")) return;

        setLoading(true);
        setErrorMsg("");

        try {
            const res = await fetch(`/api/healthcenter/service?id=${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            const data: { success: boolean; error?: string } = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Failed to delete service");
            }

            fetchServices();
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Unknown error";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- UI ---------- */

    if (initLoading) {
        return (
            <section
                className={`p-4 flex justify-center items-center min-h-[200px] ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
                    }`}
            >
                <Loader className="w-8 h-8 animate-spin" color="cyan" />
            </section>
        );
    }

    if (!healthCenterId) {
        return (
            <div
                className={`p-4 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
                    }`}
            >
                <p className="text-center text-red-600 py-8">
                    No health center found for your account.
                </p>
                {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            </div>
        );
    }

    return (
        <div
            className={`p-4 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
                }`}
        >
            <h2 className="text-lg font-semibold mb-4">Manage Services</h2>

            {errorMsg && <p className="mb-4 text-red-500">{errorMsg}</p>}

            {/* Form */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Service Name"
                    value={form.service_name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setForm({ ...form, service_name: e.target.value })
                    }
                    disabled={loading}
                    className={`flex-1 px-3 py-2 rounded border ${isDarkMode
                            ? "bg-gray-800 border-gray-700 text-gray-100"
                            : "bg-gray-100 border-gray-300"
                        }`}
                />

                <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setForm({ ...form, price: Number(e.target.value) })
                    }
                    disabled={loading}
                    className={`w-24 px-3 py-2 rounded border ${isDarkMode
                            ? "bg-gray-800 border-gray-700 text-gray-100"
                            : "bg-gray-100 border-gray-300"
                        }`}
                />

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`px-4 py-2 rounded ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                >
                    {loading ? "Saving..." : editingId ? "Update" : "Add"}
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border">
                    <thead className={isDarkMode ? "bg-gray-800" : "bg-gray-100"}>
                        <tr>
                            <th className="px-4 py-2">Service</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center py-4 text-gray-500">
                                    No services yet
                                </td>
                            </tr>
                        )}

                        {services.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="px-4 py-2">{s.service_name}</td>
                                <td className="px-4 py-2">₹{s.price}</td>
                                <td className="px-4 py-2 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(s)}
                                        className="px-2 py-1 bg-yellow-500 text-white rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(s.id)}
                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HealthCenterServicesManage;
