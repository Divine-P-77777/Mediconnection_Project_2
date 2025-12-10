'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { supabase } from '@/supabase/client';
import { Loader2 } from 'lucide-react';

const HealthCenterLoginForm = dynamic(() => import('./HealthCenterLoginForm'), { ssr: false });
const HealthCenterSignUpForm = dynamic(() => import('./HealthCenterSignUpForm'), { ssr: false });

export default function HealthCenterAuthPage() {
  const [tab, setTab] = useState('login');
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  // Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user && !error) {
        router.replace('/healthcenter/dashboard');
      } else {
        setCheckingSession(false); // allow rendering auth page
      }
    };
    checkSession();
  }, [router]);

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const tabButtonBase = 'flex-1 py-2 text-sm font-semibold transition-colors duration-200';
  const activeTab = 'bg-blue-600 text-white';
  const inactiveTab = isDarkMode
    ? 'bg-gray-700 hover:bg-gray-600 text-white'
    : 'bg-gray-100 hover:bg-gray-200 text-gray-800';

  return (
    <div className={`min-h-screen px-4 py-24 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Health Center Portal</h1>
        <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Manage your health center account easily.
        </p>
      </div>

      <div className={`w-full max-w-md mx-auto rounded-2xl shadow-lg p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`flex justify-between mb-6 border rounded-md overflow-hidden ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
          <button className={`${tabButtonBase} ${tab === 'login' ? activeTab : inactiveTab}`} onClick={() => setTab('login')}>
            Login
          </button>
          <button className={`${tabButtonBase} ${tab === 'signup' ? activeTab : inactiveTab}`} onClick={() => setTab('signup')}>
            Sign Up
          </button>
        </div>

        {tab === 'login' && <HealthCenterLoginForm />}
        {tab === 'signup' && <HealthCenterSignUpForm />}
      </div>
    </div>
  );
}
