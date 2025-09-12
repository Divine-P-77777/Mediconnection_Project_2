'use client';

import React from 'react';
import ForgotPasswordForm from '@/app/(auth)/auth/Auth/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-gray-900 dark:to-gray-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 space-y-6 transition-colors">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
            Forgot Password?
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Enter your email and we’ll send you instructions to reset it.
          </p>
        </div>

        {/* Form */}
        <ForgotPasswordForm
          email="" // can be pre-filled
          isEmailReadOnly={false}
          direction="col"
          className="w-full"
          submitText="📩 Send Instructions"
          cancelText="❌ Close"
        />

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          Remember your password?{" "}
          <a
            href="/admin"
            className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
