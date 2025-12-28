"use client";

import { FC, FormEvent, useState } from "react";
import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";

import AdminFooter from "@/app/admin/AdminFooter";
import AdminNavbar from "@/app/admin/AdminNavbar";
import { useAppSelector } from "@/store/hooks";

/* ================= COMPONENT ================= */

const AdminAuthPage: FC = () => {
  const router = useRouter();
  const { success: Success, errorToast } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  /* ================= HANDLERS ================= */

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("User not found");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) throw profileError;

      if (profile.role !== "super_admin") {
        errorToast("Sorry, you don’t have permission");
        router.replace("/admin");
        return;
      }

      Success("Welcome Super Admin!");
      router.push("/admin/dashboard");
    } catch (err) {
      errorToast("❌ Login Failed: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (): Promise<void> => {
    if (!email) {
      errorToast("Please enter your email first");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });

      if (error) throw error;
      Success("Password reset link sent");
    } catch (err) {
      errorToast((err as Error).message);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin/oauth-check`,
        },
      });

      if (error) throw error;
    } catch (err) {
      errorToast("Google Login Failed: " + (err as Error).message);
    }
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
            className="flex items-center justify-center gap-2 w-full py-2 border rounded-md"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>
        </div>
      </div>

      <AdminFooter />
    </>
  );
};

export default AdminAuthPage;
