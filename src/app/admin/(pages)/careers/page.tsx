"use client";

import { useEffect, useState, JSX } from "react";
import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";

const MAIN_ADMIN_EMAIL = process.env.NEXT_PUBLIC_MAIN_SUPER_ADMIN_EMAIL;

export default function CareersPage(): JSX.Element {
  const router = useRouter();
  const { success: Success, errorToast } = useToast();
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // 🔐 STRICT ACCESS GUARD
  useEffect(() => {
    if (!MAIN_ADMIN_EMAIL) {
      errorToast("Admin email not configured");
      router.replace("/admin");
      return;
    }

    const guard = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        errorToast("Please login first");
        router.replace("/admin");
        return;
      }

      if (data.user.email !== MAIN_ADMIN_EMAIL) {
        errorToast("You don’t have permission to access this page");
        router.replace("/admin/dashboard");
        return;
      }

      setChecking(false);
    };

    guard();
  }, [router, errorToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ CREATE SUPER ADMIN (SERVER SIDE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password.length < 8) {
      errorToast("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/super-admin/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Creation failed");

      Success("✅ Super Admin created successfully");

      setForm({ username: "", email: "", password: "" });
    } catch (err: any) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Checking access...</span>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex py-20 items-center justify-center px-4 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
        }`}
    >
      <div
        className={`w-full max-w-md p-6 rounded-2xl shadow-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
      >
        <h1 className="text-xl font-bold mb-1">
          Create Technical Super Admin
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Only the main technical admin can add new super admins
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Unique Username"
            required
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 rounded border"
          />

          <input
            name="email"
            type="email"
            placeholder="Admin Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded border"
          />

          <input
            name="password"
            type="password"
            placeholder="Temporary Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 rounded border"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded font-semibold disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Super Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
