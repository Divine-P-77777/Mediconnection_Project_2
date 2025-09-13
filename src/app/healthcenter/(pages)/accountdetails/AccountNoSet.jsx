"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {Loader} from "lucide-react"

const AccountDetailsPage = () => {
  const { user } = useAuth();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { successToast, errorToast } = useToast();

  const [form, setForm] = useState({
    account_number: "",
    ifsc_code: "",
    bank_name: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing account details
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/healthcenter/account?health_center_id=${user?.id}`
      );
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed to fetch details");
      if (result.data) setForm(result.data);
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save account details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/healthcenter/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ health_center_id: user?.id, ...form }),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed to save");
      successToast("Account details saved successfully");
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchDetails();
  }, [user]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 transition-colors ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {loading ? (
        <Loader className="h-12 w-12 animate-spin" color="cyan" />
      ) : (
        <form
          onSubmit={handleSubmit}
          className={`w-full max-w-lg p-8 rounded-2xl shadow-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Health Center Bank Details
          </h2>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Account Number</label>
            <input
              type="text"
              value={form.account_number}
              onChange={(e) => setForm({ ...form, account_number: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">IFSC Code</label>
            <input
              type="text"
              value={form.ifsc_code}
              onChange={(e) => setForm({ ...form, ifsc_code: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Bank Name</label>
            <input
              type="text"
              value={form.bank_name}
              onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition shadow"
          >
            {loading ? "Saving..." : "Save Details"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AccountDetailsPage;
