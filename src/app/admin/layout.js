"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from "./adminNav";
import AdminFoot from "./adminFoot";

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('auth_token'); // Replace with your actual auth check

    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white dark:bg-[#0A192F]">
      <AdminNav />
      <div className="w-full h-[1px] shadow-md shadow-purple-200 bg-purple-200"></div>

      <div className="flex-1 w-full">{children}</div>
      <AdminFoot />
    </div>
  );
}
