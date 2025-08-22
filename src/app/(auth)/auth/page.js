'use client';

import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';

const LoginForm = dynamic(() => import('./Auth/LoginForm'), { ssr: false });
const SignUpForm = dynamic(() => import('./Auth/SignUpForm'), { ssr: false });
const ForgotPasswordForm = dynamic(() => import('./Auth/ForgotPasswordForm'), { ssr: false });

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  const [tab, setTab] = useState('login');

  // Set initial tab based on query
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'user_register') {
      setTab('signup');
    } else {
      setTab('login');
    }
  }, [searchParams]);

  // Redirect logged-in users
  useEffect(() => {
    if (loading) return;
    if (user) {
      const role = user?.user_metadata?.role;
      if (role === 'admin') return router.replace('/admin');
      if (role === 'driver') return router.replace('/driver');
      return router.replace('/user');
    }
  }, [user, loading, router]);

  // Handle tab change and update URL
  const handleTabChange = (value) => {
    setTab(value);
    const type = value === 'signup' ? 'user_register' : 'user_login';
    router.replace(`/auth?type=${type}`);
  };

  // Theme-aware styles
  const bgPrimary = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';
  const bgCard = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const tabButtonBase = 'flex-1 py-2 text-sm font-semibold transition-colors duration-200';
  const activeTab = 'bg-blue-600 text-white';
  const inactiveTab = isDarkMode
    ? 'bg-gray-700 hover:bg-gray-600 text-white'
    : 'bg-gray-100 hover:bg-gray-200 text-gray-800';

  return (
    <div className={`min-h-screen px-4 py-16 transition-colors duration-300 ${bgPrimary}`}>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Welcome to FastMover</h1>
        <p className={`text-base ${mutedText}`}>
          Book transport, track deliveries, and manage logistics with ease.
        </p>
      </div>

      <div className={`w-full max-w-md mx-auto rounded-2xl shadow-lg p-8 ${bgCard} transition-all`}>
        <div className={`flex justify-between mb-6 border rounded-md overflow-hidden ${borderColor}`}>
          <button
            className={`${tabButtonBase} ${tab === 'login' ? activeTab : inactiveTab}`}
            onClick={() => handleTabChange('login')}
          >
            Login
          </button>
          <button
            className={`${tabButtonBase} ${tab === 'signup' ? activeTab : inactiveTab}`}
            onClick={() => handleTabChange('signup')}
          >
            Sign Up
          </button>
        </div>

        {tab === 'login' && <LoginForm />}
        {tab === 'signup' && <SignUpForm />}

        <div className="mt-8">
          <ForgotPasswordForm
            direction="col"
            className="w-full"
            email=""
            cancelText="Cancel"
            submitText="Send"
          />
        </div>
      </div>
    </div>
  );
}
