"use client";

import { useState } from "react";
import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc"; 

const allowedSuperAdmins =
  process.env.NEXT_PUBLIC_SUPER_ADMINS?.split(",") || [];

export default function AdminAuthPage() {
  const router = useRouter();
  const { Success, errorToast } = useToast();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: "super_admin" } },
      });
      if (error) throw error;
      if (data.user) {
        Success("✅ Registration Successful");
        setTab("login");
      }
    } catch (err) {
      errorToast("❌ Registration Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const user = data.user;
      if (user && allowedSuperAdmins.includes(user.email)) {
        Success("Welcome Super Admin!");
        router.push("/admin/dashboard");
      } else {
        await supabase.auth.signOut();
        throw new Error("You are not authorized as a Super Admin.");
      }
    } catch (err) {
      errorToast(" Login Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password
  const handleForgotPassword = async () => {
    if (!email) return errorToast(" Please enter your email first");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });
      if (error) throw error;
      Success(" Password reset link sent");
    } catch (err) {
      errorToast(" Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin/dashboard`,
        },
      });
      if (error) throw error;
      // Redirect handled automatically by Supabase
    } catch (err) {
      errorToast(" Google Login Failed: " + err.message);
    }
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center transition-colors ${
        isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-md p-6 rounded-2xl shadow-lg border transition-colors
          ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
      >
        <h2 className="mx-auto text-xl font-bold my-4 flex justify-center">
          Admin Panel of Mediconnection
        </h2>

        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden mb-6 border border-cyan-400">
          <button
            onClick={() => setTab("login")}
            className={`w-1/2 py-2 text-center font-medium transition-colors
              ${
                tab === "login"
                  ? "bg-cyan-600 text-white"
                  : "bg-transparent text-cyan-600 hover:bg-cyan-200"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("register")}
            className={`w-1/2 py-2 text-center font-medium transition-colors
              ${
                tab === "register"
                  ? "bg-cyan-600 text-white"
                  : "bg-transparent text-cyan-600 hover:bg-cyan-200"
              }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={tab === "login" ? handleLogin : handleRegister}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 transition
              ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-cyan-400"
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-cyan-600"
              }`}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 transition
              ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-cyan-400"
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-cyan-600"
              }`}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold transition-colors
              ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-400 text-white"
              }`}
          >
            {loading
              ? "Please wait..."
              : tab === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        {/* Forgot Password */}
        {tab === "login" && (
          <button
            onClick={handleForgotPassword}
            disabled={loading}
            className="w-full mt-3 text-sm text-cyan-600 hover:underline disabled:opacity-50"
          >
            Forgot Password?
          </button>
        )}

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          <span className="px-2 text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 w-full py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
