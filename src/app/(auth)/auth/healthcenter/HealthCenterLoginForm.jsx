'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';

const HealthCenterLoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { Success, errorToast } = useToast();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) return;
      if (session?.user) {
        router.push('/healthcenter/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await fetch('/api/healthcenter', {
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

      if (!data.user.approved) {
        throw new Error('Your account is not approved yet.');
      }

      Success('Welcome back, Health Center!');
      router.push('/healthcenter/dashboard');
    } catch (err) {
      errorToast(`Login Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/healthcenter/dashboard` },
      });
      if (error) throw error;
    } catch (err) {
      errorToast(`Google login failed: ${err.message}`);
    }
  };

  const baseinputClass = 'pl-10 border rounded-lg w-full py-2 focus:outline-none focus:ring-2 transition duration-200';
  const placeholderColor = isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500';
  const inputBg = isDarkMode ? 'bg-gray-800 text-white border-gray-700 focus:ring-blue-500' : 'bg-white text-black border-gray-300 focus:ring-blue-400';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-5 p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h2 className={`text-2xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Health Center Login</h2>

      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input {...register('email', { required: 'Email required' })} type="email" placeholder="Email" className={`${baseinputClass} ${inputBg} ${placeholderColor}`} />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input {...register('password', { required: 'Password required' })} type="password" placeholder="Password" className={`${baseinputClass} ${inputBg} ${placeholderColor}`} />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium flex justify-center gap-2">
        {loading && <Loader2 className="animate-spin h-4 w-4" />} Login
      </button>

      <button type="button" onClick={handleGoogleLogin} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium flex justify-center">
        Continue with Google
      </button>
    </form>
  );
};

export default HealthCenterLoginForm;