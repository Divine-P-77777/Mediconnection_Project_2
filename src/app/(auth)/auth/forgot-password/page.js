'use client';

import React from 'react';
import ForgotPasswordForm from '@/app/(auth)/auth/Auth/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">Enter your email to receive reset instructions.</p>
        </div>

        <ForgotPasswordForm
          email="" // or pre-fill from context if available
          isEmailReadOnly={false}
          direction="col"
          className="w-full"
          submitText="Send Instructions"
          cancelText="Close"
        />
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
