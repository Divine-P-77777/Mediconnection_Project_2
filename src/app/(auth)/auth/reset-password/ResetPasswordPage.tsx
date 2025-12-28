"use client";

import { FC, useEffect, useState, FormEvent } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/supabase/client";
import { useAppSelector } from "@/store/hooks";

/* ---------------- Component ---------------- */

const ResetPasswordPage: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const { resetPassword } = useAuth();
  const { success: Success, errorToast } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  /* ---------------- Validate Recovery Session ---------------- */

  useEffect(() => {
    const validateRecoverySession = async (): Promise<void> => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setPageError("Invalid or expired password reset link.");
      } else {
        setPageError(null);
      }
      setLoading(false);
    };

    validateRecoverySession();
  }, []);

  /* ---------------- Submit Handler ---------------- */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (password !== confirmPassword) {
      errorToast("Passwords do not match");
      return;
    }

    const result = await resetPassword(password);

    if (!result.success) {
      errorToast(result.error || "Failed to reset password");
      return;
    }

    Success("Password updated successfully! Please log in.");
    window.location.href = "/auth";
  };

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
      </div>
    );
  }

  /* ---------------- Error State ---------------- */

  if (pageError) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 text-center ${isDarkMode ? "bg-black text-white" : "bg-white text-black"
          }`}
      >
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="opacity-80">{pageError}</p>
          <Button
            onClick={() =>
              (window.location.href = "/auth/forgot-password")
            }
          >
            Request New Reset Link
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="opacity-70">Enter your new password</p>
        </div>

        <div className="space-y-4">
          {/* Password */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-3 opacity-60"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm */}
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-3 opacity-60"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
