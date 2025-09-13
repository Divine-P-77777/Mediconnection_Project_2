'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';
import { supabase } from '@/supabase/client';
import { FcGoogle } from "react-icons/fc"; 


const LoginForm = () => {
  const router = useRouter();
  const { Success, errorToast } = useToast();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error && session?.user) {
          router.replace('/user'); // always redirect customers to /user
          return;
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [router]);

  // ✅ Email/password login
  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const res = await fetch('/api/user-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'login',
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (data?.user?.user_metadata?.role !== 'user') {
        errorToast('Only customer accounts can log in here.');
        return;
      }

      Success('✅ Login successful!');
      router.push('/user');
    } catch (err) {
      errorToast(`Login Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/user` },
      });
      if (error) throw error;
    } catch (err) {
      errorToast(`Google Login Failed: ${err.message}`);
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`max-w-md mx-auto p-6 rounded-xl shadow-lg transition-colors ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h2 className="text-2xl font-bold text-center mb-4">Customer Login</h2>

      {/* Email */}
      <div className="relative mb-4">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          type="email"
          placeholder="Email"
          className={`w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="relative mb-4">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          {...register('password', { required: 'Password is required' })}
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg py-2 font-medium disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Login
      </button>

      {/* OR separator */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 my-3">
        <span>or</span>
      </div>

      {/* Google Login */}
       <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 w-full py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>

      {/* Extra logins for other roles */}
      <div className="text-sm text-center mt-6 space-y-1">
        <p className="text-gray-500">Not a customer? Login as:</p>
        <div className="flex justify-center gap-4 font-medium">
          <a href="/auth/doctor" className="underline hover:text-cyan-500">Doctor</a>
          <a href="/auth/healthcenter" className="underline hover:text-cyan-500">Health Center</a>
          <a href="/auth/admin" className="underline hover:text-cyan-500">Admin</a>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
