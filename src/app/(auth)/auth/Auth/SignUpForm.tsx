"use client";

import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";

type SignUpFormValues = {
  username: string;
  email: string;
  password: string;
};

const SignUpForm: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { success: Success, errorToast } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormValues>();

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    try {
      setLoading(true);

      const res = await fetch("/api/user-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "signup",
          email: data.email,
          password: data.password,
          username: data.username,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.error || "Signup failed");
      }

      Success("🎉 Account Created Successfully!");
      reset();
    } catch (err) {
      errorToast(`❌ Signup Failed: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const baseInput =
    "pl-10 pr-10 border rounded-lg w-full py-2 focus:outline-none focus:ring-2 transition duration-200";

  const placeholderColor = isDarkMode
    ? "placeholder-gray-400"
    : "placeholder-gray-500";

  const labelColor = isDarkMode ? "text-gray-200" : "text-gray-700";

  const inputBg = isDarkMode
    ? "bg-gray-800 text-white border-gray-700 focus:ring-cyan-500"
    : "bg-gray-50 text-gray-900 border-gray-300 focus:ring-cyan-400";

  const formBg = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-gray-900";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-5 ${formBg} p-6 rounded-xl shadow-lg max-w-md w-full mx-auto transition-colors`}
    >
      <h2 className="text-2xl font-semibold text-center">
        Create Your Account
      </h2>

      <div className="space-y-1">
        <label className={`text-sm font-medium ${labelColor}`}>
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            placeholder="Choose a username"
            className={`${baseInput} ${inputBg} ${placeholderColor}`}
            {...register("username", {
              required: "Username is required",
              pattern: {
                value: /^[A-Za-z0-9_]{3,16}$/,
                message:
                  "3–16 characters. Letters, numbers, underscores only.",
              },
            })}
          />
        </div>
        {errors.username && (
          <p className="text-xs text-red-500">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className={`text-sm font-medium ${labelColor}`}>
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="email"
            placeholder="you@example.com"
            className={`${baseInput} ${inputBg} ${placeholderColor}`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className={`text-sm font-medium ${labelColor}`}>
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            className={`${baseInput} ${inputBg} ${placeholderColor}`}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Minimum 8 characters required",
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg py-2 font-medium disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Create Account
      </button>

      <p
        className={`text-xs text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
      >
        By signing up, you agree to our Terms & Privacy Policy.
      </p>
    </form>
  );
};

export default SignUpForm;
