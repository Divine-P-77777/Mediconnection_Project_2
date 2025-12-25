"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";

const MAIN_ADMIN_EMAIL = process.env.NEXT_PUBLIC_MAIN_SUPER_ADMIN_EMAIL;

export default function CareersPage() {
  const router = useRouter();
  const { Success, errorToast } = useToast();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // 🔐 STRICT ACCESS GUARD (NO SIGN OUT)
  useEffect(() => {
    const guard = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        errorToast("Please login first");
        router.replace("/admin");
        return;
      }

      if (user.email !== MAIN_ADMIN_EMAIL) {
        errorToast("You don’t have permission to access this page");
        router.replace("/admin/dashboard");
        return;
      }

      setChecking(false);
    };

    guard();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  //  CREATE SUPER ADMIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create Auth User
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: form.email,
          password: form.password,
          email_confirm: true,
        });

      if (authError) throw authError;

      const userId = authData.user.id;

      //  Insert Profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        role: "super_admin",
        username: form.username,
        official_email: form.email,
        approved: true,
      });

      if (profileError) throw profileError;

      Success(" Super Admin created successfully");

      setForm({
        username: "",
        email: "",
        password: "",
      });
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;

  return (
    <div
      className={`min-h-screen flex py-20 items-center justify-center px-4 transition-colors ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-md p-6 rounded-2xl shadow-lg border ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <h1 className="text-xl font-bold mb-1">
          Create Technical Super Admin
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Only main technical admin can add new super admins
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
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded font-semibold transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Super Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}