"use client";

import { FC, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";

import AdminNavbar from "@/app/admin/AdminNavbar";
import AdminFooter from "@/app/admin/AdminFooter";

/* ================= COMPONENT ================= */

const AdminAuthPage: FC = () => {
  const router = useRouter();
  const { success: Success, errorToast } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOGIN ================= */

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/super-admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Admin login failed");
      }

      Success("Welcome Super Admin!");
      router.replace("/admin");
    } catch (err) {
      errorToast((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PASSWORD RESET ================= */

  const handleForgotPassword = async () => {
    if (!email) {
      errorToast("Please enter your email first");
      return;
    }

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      Success("Password reset link sent to your email");
    } catch (err) {
      errorToast((err as Error).message);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  // OPTIONAL: usually disabled for admins
  const handleGoogleLogin = async () => {
    errorToast("Google login is disabled for admin accounts");
  };

  /* ================= UI ================= */

  return (
    <>
      <AdminNavbar />

      <div
        className={`flex min-h-screen px-4 items-center justify-center ${isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-800"
          }`}
      >
        <div
          className={`w-full max-w-md p-6 rounded-2xl shadow-lg border ${isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
            }`}
        >
          <h2 className="text-xl font-bold text-center mb-6">
            Admin Panel – Mediconnection
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md border"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md border"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-cyan-600 text-white rounded-md disabled:opacity-70"
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>

          <button
            onClick={handleForgotPassword}
            className="mt-3 text-sm text-cyan-600 hover:underline w-full"
          >
            Forgot Password?
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-2 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-full py-2 border rounded-md opacity-50 cursor-not-allowed"
          >
            <FcGoogle size={20} />
            Google login disabled
          </button>
        </div>
      </div>

      <AdminFooter />
    </>
  );
};

export default AdminAuthPage;
