"use client";

import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/client";

/* ---------------- Types ---------------- */

type LoginFormData = {
  email: string;
  password: string;
};

/* ---------------- Component ---------------- */

const HealthCenterLoginForm: FC = () => {
  const router = useRouter();
  const { success: Success, errorToast } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  useEffect(() => {
    const checkSession = async (): Promise<void> => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user) return;

      const userId = data.session.user.id;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (profile?.role === "health_center") {
        router.replace("/healthcenter/dashboard");
      }
    };

    checkSession();
  }, [router]);

  const onSubmit = async (formData: LoginFormData): Promise<void> => {
    try {
      setLoading(true);

      const res = await fetch("/api/healthcenter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "login", ...formData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");
      if (!data?.user?.approved) {
        throw new Error("Your account is not approved yet");
      }

      Success("Welcome back, Health Center!");
      router.push("/healthcenter/dashboard");
    } catch (err) {
      errorToast((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/healthcenter/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err) {
      errorToast((err as Error).message);
    }
  };

  const baseInput =
    "pl-10 border rounded-lg w-full py-2 focus:outline-none focus:ring-2 transition duration-200";
  const placeholderColor = isDarkMode
    ? "placeholder-gray-400"
    : "placeholder-gray-500";
  const inputBg = isDarkMode
    ? "bg-gray-800 text-white border-gray-700 focus:ring-cyan-400"
    : "bg-white text-black border-gray-300 focus:ring-cyan-600";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-5 p-6 rounded-2xl shadow-xl max-w-md w-full mx-auto ${isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
    >
      <h2
        className={`text-2xl font-bold text-center ${isDarkMode ? "text-cyan-400" : "text-cyan-600"
          }`}
      >
        Health Center Login
      </h2>

      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          {...register("email", { required: "Email is required" })}
          type="email"
          placeholder="Email"
          className={`${baseInput} ${inputBg} ${placeholderColor}`}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder="Password"
          className={`${baseInput} ${inputBg} ${placeholderColor}`}
        />
        {errors.password && (
          <p className="text-xs text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-medium flex justify-center gap-2 disabled:opacity-70"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Login
      </button>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium disabled:opacity-70"
      >
        Continue with Google
      </button>
    </form>
  );
};

export default HealthCenterLoginForm;
