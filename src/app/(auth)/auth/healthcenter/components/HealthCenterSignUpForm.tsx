"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, User, Loader2, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";

/* ---------------- Types ---------------- */

type HealthCenterSignUpFormData = {
  username: string;
  email: string;
  password: string;
  name: string;
  hcrn_hfc: string;
  address: string;
  contact: string;
  pincode: string;
};

/* ---------------- Component ---------------- */

const HealthCenterSignUpForm: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { success: Success, errorToast } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HealthCenterSignUpFormData>();

  const onSubmit = async (
    formData: HealthCenterSignUpFormData
  ): Promise<void> => {
    try {
      setLoading(true);

      const res = await fetch("/api/healthcenter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "signup", ...formData }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.error || "Signup failed");
      }

      Success("Account Created Your health center is registered and awaiting approval.");
      reset();
    } catch (err) {
      errorToast((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const baseInput =
    "pl-10 border rounded-lg w-full py-2 focus:outline-none focus:ring-2 transition duration-200";
  const placeholderColor = isDarkMode
    ? "placeholder-gray-400"
    : "placeholder-gray-500";
  const labelColor = isDarkMode ? "text-gray-200" : "text-gray-700";
  const inputBg = isDarkMode
    ? "bg-gray-800 text-white border-gray-700 focus:ring-cyan-400"
    : "bg-white text-black border-gray-300 focus:ring-cyan-600";
  const formBg = isDarkMode ? "bg-gray-900" : "bg-white";
  const headingColor = isDarkMode ? "text-cyan-400" : "text-cyan-600";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-5 ${formBg} p-6 rounded-2xl shadow-xl max-w-md w-full mx-auto`}
    >
      <h2 className={`text-2xl font-bold text-center ${headingColor}`}>
        Register Health Center
      </h2>

      {/* Username */}
      <div className="space-y-1">
        <label className={`text-sm font-medium ${labelColor}`}>
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            className={`${baseInput} ${inputBg} ${placeholderColor}`}
            placeholder="Choose a username"
            {...register("username", {
              required: "Username is required",
              pattern: {
                value: /^[A-Za-z0-9_]{3,16}$/,
                message:
                  "3–16 characters, letters, numbers, underscores only",
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

      {/* Email */}
      <div className="space-y-1">
        <label className={`text-sm font-medium ${labelColor}`}>
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="email"
            className={`${baseInput} ${inputBg} ${placeholderColor}`}
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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

      {/* Password */}
      <div className="space-y-1">
        <label className={`text-sm font-medium ${labelColor}`}>
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="password"
            className={`${baseInput} ${inputBg} ${placeholderColor}`}
            placeholder="Create a password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Minimum 8 characters required",
              },
            })}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {[
        { id: "name", label: "Health Center Name", icon: User },
        { id: "hcrn_hfc", label: "HCRN / HFC" },
        { id: "address", label: "Address" },
        { id: "contact", label: "Contact Number", icon: Phone },
        { id: "pincode", label: "Pincode", icon: MapPin },
      ].map(({ id, label, icon: Icon }) => (
        <div key={id} className="space-y-1">
          <label className={`text-sm font-medium ${labelColor}`}>
            {label}
          </label>
          <div className="relative">
            {Icon && (
              <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            )}
            <input
              className={`${baseInput} ${inputBg} ${placeholderColor}`}
              {...register(id as keyof HealthCenterSignUpFormData, {
                required: `${label} is required`,
              })}
            />
          </div>
          {errors[id as keyof HealthCenterSignUpFormData] && (
            <p className="text-xs text-red-500">
              {
                errors[id as keyof HealthCenterSignUpFormData]
                  ?.message
              }
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg py-2 font-medium flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Register Health Center
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

export default HealthCenterSignUpForm;
