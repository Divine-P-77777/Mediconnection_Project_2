"use client";

import { useState } from "react";
import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from '@/hooks/use-toast'

const allowedSuperAdmins =process.env.NEXT_PUBLIC_SUPER_ADMINS;

export default function AdminAuthPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: "super_admin" },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "✅ Registration Successful",
          description: "You can now log in as Super Admin.",
        });
        setTab("login");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "❌ Registration Failed",
        description: err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;

      if (user && allowedSuperAdmins.includes(user.email)) {
        toast({
          title: "✅ Welcome Super Admin!",
          description: "Redirecting you to dashboard...",
        });
        router.push("/super-admin");
      } else {
        await supabase.auth.signOut();
        throw new Error("You are not authorized as a Super Admin.");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "❌ Login Failed",
        description: err.message || "Invalid credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "⚠️ Missing Email",
        description: "Please enter your email to reset your password.",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });

      if (error) throw error;

      toast({
        title: "📩 Reset Link Sent",
        description: "Check your email inbox to reset your password.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "❌ Reset Failed",
        description: err.message || "Could not send reset link.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-96">
        {/* Tabs */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setTab("login")}
            className={`w-1/2 py-2 ${
              tab === "login"
                ? "border-b-2 border-indigo-600 font-bold"
                : "text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("register")}
            className={`w-1/2 py-2 ${
              tab === "register"
                ? "border-b-2 border-indigo-600 font-bold"
                : "text-gray-500"
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required={tab === "register" || tab === "login"}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : tab === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        {/* Forgot Password Button */}
        {tab === "login" && (
          <button
            onClick={handleForgotPassword}
            disabled={loading}
            className="w-full mt-3 text-sm text-indigo-600 hover:underline disabled:opacity-50"
          >
            Forgot Password?
          </button>
        )}
      </div>
    </div>
  );
}
