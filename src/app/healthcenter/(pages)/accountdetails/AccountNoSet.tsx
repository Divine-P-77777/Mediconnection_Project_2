"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";


interface AccountForm {
  account_number: string;
  ifsc_code: string;
  bank_name: string;
}

interface ApiError {
  error?: string;
}


const AccountDetailsPage = () => {
  const { user } = useAuth();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { success: successToast, errorToast } = useToast();

  const [form, setForm] = useState<AccountForm>({
    account_number: "",
    ifsc_code: "",
    bank_name: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  /* ---------- Fetch existing details ---------- */
  const fetchDetails = async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const res = await fetch(
        `/api/healthcenter/account?health_center_id=${user.id}`
      );
      const result = (await res.json()) as {
        data?: AccountForm;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(result.error || "Failed to fetch details");
      }

      if (result.data) {
        setForm(result.data);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      errorToast(message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Save details ---------- */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setLoading(true);

      const res = await fetch("/api/healthcenter/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          health_center_id: user.id,
          ...form,
        }),
      });

      const result = (await res.json()) as ApiError;

      if (!res.ok) {
        throw new Error(result.error || "Failed to save details");
      }

      successToast("Account details saved successfully");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      errorToast(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchDetails();
    }
  }, [user?.id]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 transition-colors ${isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
        }`}
    >
      {loading ? (
        <Loader className="h-12 w-12 animate-spin text-cyan-500" />
      ) : (
        <form
          onSubmit={handleSubmit}
          className={`w-full max-w-lg p-8 rounded-2xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Health Center Bank Details
          </h2>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Account Number
            </label>
            <input
              type="text"
              value={form.account_number}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  account_number: e.target.value,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              IFSC Code
            </label>
            <input
              type="text"
              value={form.ifsc_code}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  ifsc_code: e.target.value,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Bank Name
            </label>
            <input
              type="text"
              value={form.bank_name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  bank_name: e.target.value,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition shadow disabled:opacity-60"
          >
            Save Details
          </button>
        </form>
      )}
    </div>
  );
};

export default AccountDetailsPage;
