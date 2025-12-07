"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";

export default function ForgotPasswordForm({
  className = "",
  direction = "col",
  cancelText = "Cancel",
  submitText = "Send Reset Instructions",
  email,
  isEmailReadOnly,
}) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { forgotPassword } = useAuth();
  const { errorToast, Success } = useToast();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await forgotPassword(data.email);
      Success("Password reset instructions have been sent.");
      setIsOpen(false);
      reset();
    } catch (error) {
      errorToast(error.message || "Failed to send reset instructions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-${direction} gap-2 items-start ${className}`}>
      {/* Toggle button */}
      <Button
        variant="ghost"
        className={`px-4 py-1 rounded-lg text-sm transition ${
          isDarkMode
            ? "text-gray-300 hover:bg-gray-800"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Forgot password?
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="w-full mt-2"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`space-y-5 border p-5 rounded-2xl shadow-md transition-colors ${
                isDarkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Email field */}
              <div className="space-y-2">
                <label
                  htmlFor="reset-email"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-3 h-4 w-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />

                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email format",
                      },
                    })}
                    id="reset-email"
                    type="email"
                    defaultValue={email}
                    readOnly={isEmailReadOnly}
                    placeholder="Enter your registered email"
                    className={`pl-10 rounded-lg transition ${
                      isDarkMode
                        ? "bg-gray-800 text-gray-100 border-gray-700 focus:border-cyan-500 focus:ring-cyan-600"
                        : "bg-white text-gray-900 border-gray-300 focus:border-cyan-600 focus:ring-cyan-600"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Submit */}
                <Button
                  type="submit"
                  className={`w-full font-medium rounded-lg shadow-sm transition ${
                    isDarkMode
                      ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                      : "bg-cyan-600 hover:bg-cyan-500 text-white"
                  } ${loading ? "opacity-80" : ""}`}
                  disabled={loading}
                >
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {submitText}
                </Button>

                {/* Cancel */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
                  className={`w-full sm:w-auto rounded-lg flex items-center justify-center transition ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <X className="h-4 w-4 mr-1" /> {cancelText}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
