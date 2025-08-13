'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

import button from '@/components/ui/button';
import input from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSelector } from 'react-redux';

const LoginForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const { toast } = useToast();

 const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { user } = await signIn(data.email, data.password);

      // Role restriction
      if (user?.role !== 'user') {
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'Only customer accounts are allowed to log in here.',
        });
        return;
      }

      toast({
        title: 'Welcome back!',
        description: `Logged in as ${user.email}`,
      });
      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Unable to log in. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { user } = await signInWithGoogle();
      if (user?.role !== 'user') {
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'Only customer accounts can log in with Google.',
        });
        return;
      }
      toast({ title: 'Welcome!', description: `Logged in as ${user.email}` });
      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Google Login Failed',
        description: error.message || 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

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
      <button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Login
      </button>

      {/* Google Login */}
      <button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2"
        disabled={loading}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="h-5 w-5"
        />
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
