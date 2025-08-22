'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Eye, EyeOff} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';
import { supabase } from '@/supabase/client';

const LoginForm = () => {
  const router = useRouter();
  const { Success, errorToast } = useToast();

  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session?.user) {
        if (session.user.user_metadata?.role === 'user') {
          router.replace('/user');
          return;
        }
      }
      setCheckingSession(false);
    };
    checkSession();
  }, [router]);

  // Email/password login
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

      Success('Welcome back!');
      router.push('/user');
    } catch (err) {
      errorToast(`Login Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`, // redirect after login
        },
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
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-5 p-6 rounded-xl shadow-lg transition-colors ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h2 className="text-2xl font-bold text-center">Customer Login</h2>

      {/* Email */}
      <div className="relative">
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
          className={`pl-10 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          {...register('password', { required: 'Password is required' })}
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className={`pl-10 pr-10 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}
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
        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 font-medium disabled:opacity-50"
        disabled={loading}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Login
      </button>

      {/* OR separator */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <span>or</span>
      </div>

      {/* Google Login */}
<button
  type="button"
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 font-medium hover:bg-gray-100 disabled:opacity-50"
  disabled={loading}
>
  <img src="/google-logo.svg" alt="Google" className="h-5 w-5" />
  Continue with Google
</button>


      {/* Forgot Password */}
      <div className="text-sm text-center mt-3">
        <a href="/auth/forgot-password" className="underline hover:text-blue-500">
          Forgot Password?
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
