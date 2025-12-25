"use client";

import { useState } from "react";
import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import AdminFoot from "@/app/admin/AdminFoot"
import AdminNav from "@/app/admin/AdminNav"


export default function AdminAuthPage() {
  const router = useRouter();
  const { Success, errorToast } = useToast();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Email + Password Login (ROLE BASED)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Authenticate
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;

      //  Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Role check
      if (profile.role !== "super_admin") {
        errorToast("Sorry, you don’t have permission");
        router.replace("/admin"); // stay on login
        return;
      }

      Success("Welcome Super Admin!");
      router.push("/admin/dashboard");
    } catch (err) {
      errorToast("❌ Login Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password
  const handleForgotPassword = async () => {
    if (!email) return errorToast("Please enter your email first");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });
      if (error) throw error;

      Success("Password reset link sent");
    } catch (err) {
      errorToast(err.message);
    }
  };

  // ⚠️ Google Login (still needs OAuth guard page)
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin/oauth-check`,
        },
      });

      if (error) throw error;
    } catch (err) {
      errorToast("Google Login Failed: " + err.message);
    }
  };

  return (
    <>
      <AdminNav />
      <div
        className={`flex min-h-screen px-4 items-center justify-center ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
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
              className="w-full py-2 bg-cyan-600 text-white rounded-md"
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
            className="flex items-center justify-center gap-2 w-full py-2 border rounded-md"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>
        </div>
      </div>
      <AdminFoot />
    </>
  );
}
