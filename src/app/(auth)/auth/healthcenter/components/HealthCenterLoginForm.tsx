"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";

/* ---------------- Types ---------------- */

type LoginFormData = {
  email: string;
  password: string;
};

/* ---------------- Component ---------------- */

const HealthCenterLoginForm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, errorToast } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (formData: LoginFormData) => {
    try {
      setLoading(true);

      const res = await fetch("/api/healthcenter/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      success("Welcome back, Health Center!");
      const nextUrl = searchParams.get("next") || "/healthcenter";
      router.replace(nextUrl);
    } catch (err) {
      errorToast((err as Error).message);
      setLoading(false);
    }
  };

  /* ---------------- Styles ---------------- */

  const baseInput =
    "pl-10 border rounded-lg w-full py-2 focus:outline-none focus:ring-2 transition duration-200";

  const inputBg = isDarkMode
    ? "bg-gray-800 text-white border-gray-700 focus:ring-cyan-400"
    : "bg-white text-black border-gray-300 focus:ring-cyan-600";

  const placeholderColor = isDarkMode
    ? "placeholder-gray-400"
    : "placeholder-gray-500";

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
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
          className={`${baseInput} ${inputBg} ${placeholderColor}`}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          className={`${baseInput} ${inputBg} ${placeholderColor}`}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Link
          href="/auth/forgot-password"
          className={`text-sm hover:underline ${isDarkMode ? "text-cyan-400" : "text-cyan-600"
            }`}
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-medium flex justify-center gap-2 disabled:opacity-70"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Login
      </button>
    </form>
  );
};

export default HealthCenterLoginForm;
