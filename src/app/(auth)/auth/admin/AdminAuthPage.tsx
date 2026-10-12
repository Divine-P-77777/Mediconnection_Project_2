"use client";

import { FC, FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import { FiEye, FiEyeOff } from "react-icons/fi";

import AdminNavbar from "@/app/admin/AdminNavbar";
import AdminFooter from "@/app/admin/AdminFooter";
import dynamic from "next/dynamic";
const ForgotPasswordForm = dynamic(
  () => import("../forgot-password/ForgotPasswordForm"),
  { ssr: false }
);

const AdminAuthPage: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success: Success, errorToast } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


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
      const nextUrl = searchParams.get("next") || "/admin";
      router.replace(nextUrl);
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
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          redirectTo: `${window.location.origin}/auth/reset-password`
        }),
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
        className={`flex min-h-screen px-4 py-24 items-center justify-center ${isDarkMode
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

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 pr-10 rounded-md border"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-cyan-600 text-white rounded-md disabled:opacity-70"
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-8">
            <ForgotPasswordForm
              direction="col"
              className="w-full"
              email=""
              cancelText="Cancel"
              submitText="Send"
            />
          </div>


        </div>
      </div>

      <AdminFooter />
    </>
  );
};

export default AdminAuthPage;
