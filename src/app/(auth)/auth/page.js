'use client';

import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import UserNav from '@/app/user/UserNav';
import UserFoot from '@/app/user/UserFoot';

const LoginForm = dynamic(() => import('./Auth/LoginForm'), { ssr: false });
const SignUpForm = dynamic(() => import('./Auth/SignUpForm'), { ssr: false });
const ForgotPasswordForm = dynamic(() => import('./Auth/ForgotPasswordForm'), { ssr: false });

export default function AuthPage() {
  const { user, loading, role, isUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  const [tab, setTab] = useState('login');

  // Set initial tab from query params
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'user_register') {
      setTab('signup');
    } else {
      setTab('login');
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (loading) return;

    if (user) {
      // Only allow "user" role here
      if (isUser) {
        return router.replace('/user'); 
      }

      // Other roles should not use this page
      alert('Please log in via the correct portal for your role.');
      return router.replace('/');
    }
  }, [user, loading, router, isUser]);

  const handleTabChange = (value) => {
    setTab(value);
    const type = value === 'signup' ? 'user_register' : 'user_login';
    router.replace(`/auth?type=${type}`);
  };

  const bgPrimary = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';
  const bgCard = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const tabButtonBase = 'flex-1 py-2 text-sm font-semibold transition-colors duration-200';
  const activeTab = 'bg-cyan-600 text-white';
  const inactiveTab = isDarkMode
    ? 'bg-gray-700 hover:bg-gray-600 text-white'
    : 'bg-gray-100 hover:bg-gray-200 text-gray-800';

  return (
    <>
    <UserNav />
    <div className={`min-h-screen px-4 py-22 transition-colors duration-300 ${bgPrimary}`}>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Welcome to Mediconnection</h1>
        <p className={`text-base ${mutedText}`}>
          Login or Sign up as a user to book consultations, manage appointments, and access healthcare services.
        </p>
      </div>

      <div className={`w-full max-w-md mx-auto rounded-2xl shadow-lg p-8 ${bgCard} transition-all`}>
        {/* Tabs */}
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

        {/* Forms */}
        {tab === 'login' && <LoginForm role="user" />}
        {tab === 'signup' && <SignUpForm role="user" />}

        {/* Forgot Password */}
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
    <UserFoot />
    </>
  );
}
