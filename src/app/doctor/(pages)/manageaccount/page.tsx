"use client";

import { FC, useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";

/* ================= TYPES ================= */

interface AccountFormData {
  account_number: string;
  bank_name: string;
  ifsc_code: string;
}

/* ================ COMPONENT ================ */

const ManageAccount: FC = () => {
  const { user, isDoctor, loading } = useAuth();
  const router = useRouter();
  const { success: Success, errorToast } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const doctorId: string | undefined = user?.id;

  const [formData, setFormData] = useState<AccountFormData>({
    account_number: "",
    bank_name: "",
    ifsc_code: "",
  });

  const [saving, setSaving] = useState<boolean>(false);

  if (!user) {
    router.push("/auth/doctor");
    errorToast("Please login to access doctor portal");
    return null;
  }

  useEffect((): void => {
    if (!doctorId) return;

    const fetchAccount = async (): Promise<void> => {
      try {
        const res = await fetch(
          `/api/doctor/account?doctor_id=${doctorId}`
        );
        const result: Partial<AccountFormData> & { error?: string } =
          await res.json();

        if (!result.error && result.account_number) {
          setFormData({
            account_number: result.account_number ?? "",
            bank_name: result.bank_name ?? "",
            ifsc_code: result.ifsc_code ?? "",
          });
        }
      } catch {
        errorToast("Failed to load account details");
      }
    };

    fetchAccount();
  }, [doctorId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!doctorId) {
      errorToast("Doctor ID not found");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/doctor/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor_id: doctorId, ...formData }),
      });

      const result: { error?: string } = await res.json();
      if (result.error) throw new Error(result.error);

      Success("Account details saved!");
    } catch (err) {
      errorToast((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className={`animate-spin rounded-full h-10 w-10 border-b-2 ${isDarkMode
              ? "border-cyan-400"
              : "border-cyan-600"
            }`}
        />
      </div>
    );
  }

  if (!isDoctor) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${isDarkMode
            ? "text-red-300"
            : "text-red-600"
          }`}
      >
        Access denied. Doctors only.
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-30 flex justify-center items-center px-4 py-10 ${isDarkMode
          ? "bg-gray-900 text-cyan-300"
          : "bg-gray-100 text-gray-800"
        }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`p-8 rounded-2xl w-full max-w-md shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
      >
        <h2
          className={`text-3xl font-bold mb-6 text-center ${isDarkMode
              ? "text-cyan-300"
              : "text-cyan-600"
            }`}
        >
          Manage Account Details
        </h2>

        <input
          name="account_number"
          value={formData.account_number}
          onChange={handleChange}
          placeholder="Account Number"
          className={`w-full mb-4 p-3 rounded-lg border ${isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-gray-50 border-gray-300"
            }`}
          required
        />

        <input
          name="bank_name"
          value={formData.bank_name}
          onChange={handleChange}
          placeholder="Bank Name"
          className={`w-full mb-4 p-3 rounded-lg border ${isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-gray-50 border-gray-300"
            }`}
          required
        />

        <input
          name="ifsc_code"
          value={formData.ifsc_code}
          onChange={handleChange}
          placeholder="IFSC Code"
          className={`w-full mb-6 p-3 rounded-lg border ${isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-gray-50 border-gray-300"
            }`}
          required
        />

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded-lg font-semibold transition ${saving
              ? "opacity-70 cursor-not-allowed"
              : ""
            } ${isDarkMode
              ? "bg-cyan-500 text-black hover:bg-cyan-400"
              : "bg-cyan-600 text-white hover:bg-cyan-500"
            }`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default ManageAccount;
