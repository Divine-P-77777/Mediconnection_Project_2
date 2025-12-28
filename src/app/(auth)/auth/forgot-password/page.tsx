"use client";

import { FC } from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

const ForgotPasswordPage: FC = () => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const router = useRouter();

  return (
    <main
      className={`min-h-screen flex items-center justify-center px-4 transition-colors ${isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-950"
          : "bg-gradient-to-br from-cyan-50 to-cyan-100"
        }`}
    >
      <div
        className={`max-w-md w-full rounded-2xl shadow-xl p-8 space-y-8 transition-colors backdrop-blur-sm ${isDarkMode
            ? "bg-gray-900/70 border border-gray-700"
            : "bg-white/80 border border-gray-200"
          }`}
      >
        <div className="text-center space-y-2">
          <h1
            className={`text-3xl font-bold tracking-tight transition ${isDarkMode ? "text-cyan-400" : "text-cyan-600"
              }`}
          >
            Forgot your password?
          </h1>

          <p
            className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
          >
            Enter your email and we’ll send you instructions to reset it.
          </p>
        </div>

        <ForgotPasswordForm
          email=""
          isEmailReadOnly={false}
          direction="col"
          className="w-full"
          submitText="Send Instructions"
          cancelText="Close"
        />

        <div
          className={`text-center text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
        >
          Remember your password?{" "}
          <button
            onClick={() => router.back()}
            className={`font-medium hover:underline transition ${isDarkMode ? "text-cyan-400" : "text-cyan-600"
              }`}
          >
            Back to Login
          </button>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
