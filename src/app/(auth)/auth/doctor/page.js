'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function DoctorLogin() {
  const router = useRouter();
  const { Success, errorToast } = useToast();

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

      Success('Login successful!');
      router.push('/doctor/dashboard');
    } catch (err) {
      errorToast(err.message);
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
      errorToast(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Doctor Login</h2>

      <form onSubmit={handleLogin} className="space-y-3 mb-4">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>

      <div className="text-center mb-2">or</div>

      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Continue with Google'}
      </button>
    </div>
  );
}
