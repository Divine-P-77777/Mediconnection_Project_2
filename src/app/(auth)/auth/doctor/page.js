'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';

export default function DoctorLogin() {
  const router = useRouter();
  const { Success, errorToast } = useToast();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;

      const user = data.user;
      if (user.user_metadata.role !== 'doctor') {
        throw new Error('Not a doctor account');
      }

      Success('✅ Login successful!');
      router.push('/doctor/dashboard');
    } catch (err) {
      errorToast('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/doctor/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err) {
      errorToast('❌ ' + err.message);
      setLoading(false);
    }
  };

  // Forgot password redirect
  const handleForgotPassword = () => {
    router.push('/auth/forgot-password'); // 🔹 use your ForgotPasswordPage route
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center transition-colors ${
        isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'
      }`}
    >
      <div
        className={`w-full max-w-md p-6 rounded-2xl shadow-lg border transition-colors
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-cyan-600">
          Doctor Login
        </h2>

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="space-y-4 mb-3">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 transition
              ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-cyan-600'}`}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 transition
              ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-cyan-600'}`}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold transition-colors
              ${loading
                ? 'opacity-70 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-400 text-white'}`}
          >
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-right mb-6">
          <button
            onClick={handleForgotPassword}
            className="text-sm font-medium text-cyan-600 hover:text-cyan-400 transition"
          >
            Forgot Password?
          </button>
        </div>

        <div className="text-center mb-4 text-sm opacity-70">or</div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full py-2 rounded-md font-semibold transition-colors flex items-center justify-center gap-2
            ${loading
              ? 'opacity-70 cursor-not-allowed'
              : 'border hover:bg-red-600 text-white'}`}
        >
          {loading ? (
            'Please wait...'
          ) : (
            <>
              <svg
                className="w-5 h-5"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.84-6.84C35.08 2.52 29.88 0 24 0 14.62 0 6.52 5.4 2.45 13.3l7.98 6.2C12.33 13.02 17.67 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.5 24.5c0-1.57-.14-3.08-.39-4.5H24v9h12.7c-.54 2.74-2.14 5.06-4.45 6.64l7.1 5.5c4.16-3.83 7.15-9.42 7.15-16.64z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.43 28.5c-.5-1.47-.78-3.04-.78-4.5s.28-3.03.78-4.5l-7.98-6.2C.9 16.97 0 20.38 0 24s.9 7.03 2.45 10.2l7.98-6.2z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.9-2.14 15.87-5.8l-7.1-5.5C30.64 38.68 27.45 39.5 24 39.5c-6.33 0-11.67-3.52-14.57-8.5l-7.98 6.2C6.52 42.6 14.62 48 24 48z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}
