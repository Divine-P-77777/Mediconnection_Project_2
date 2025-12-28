"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import DocNav from "@/app/doctor/components/DocNav";
import DocFoot from "@/app/doctor/components/DocFoot";

type LoginFormState = {
  email: string;
  password: string;
};

const DoctorLogin: FC = () => {
  const router = useRouter();
  const { success: Success, errorToast } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  /* ---------------- Email / Password Login ---------------- */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error || !data.user) throw error;

      // ✅ Fetch role from profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError || profile?.role !== "doctor") {
        await supabase.auth.signOut();
        throw new Error("This is not a doctor account");
      }

      Success("Login successful!");
      router.push("/doctor");
    } catch (err) {
      errorToast(
        err instanceof Error ? err.message : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Google OAuth ---------------- */
  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      errorToast(
        err instanceof Error ? err.message : "Google login failed"
      );
      setLoading(false);
    }
  };

  /* ---------------- Forgot Password ---------------- */
  const handleForgotPassword = (): void => {
    router.push("/auth/forgot-password");
  };

  return (
    <>
      <DocNav />

      <div
        className={`flex min-h-screen items-center justify-center transition-colors ${isDarkMode
            ? "bg-gray-900 text-gray-100"
            : "bg-gray-100 text-gray-800"
          }`}
      >
        <div
          className={`w-full max-w-md p-6 rounded-2xl shadow-lg border transition-colors ${isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
            }`}
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-cyan-600">
            Doctor Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4 mb-3">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              required
              className={`w-full px-3 py-2 rounded-md border ${isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              required
              className={`w-full px-3 py-2 rounded-md border ${isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md font-semibold ${loading
                  ? "opacity-70 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white"
                }`}
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>

          <div className="text-right mb-6">
            <button
              onClick={handleForgotPassword}
              className="text-sm text-cyan-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div className="text-center mb-4 text-sm opacity-70">or</div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full py-2 rounded-md border flex justify-center gap-2 ${isDarkMode
                ? "border-gray-600 hover:bg-gray-800"
                : "border-gray-300 hover:bg-gray-100"
              }`}
          >
            Continue with Google
          </button>
        </div>
      </div>

      <DocFoot />
    </>
  );
};

export default DoctorLogin;
