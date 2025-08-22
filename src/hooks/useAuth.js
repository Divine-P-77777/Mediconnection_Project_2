'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Determine user role safely
  const role = user?.user_metadata?.role ?? 'guest';
  const isSuperAdmin = role === 'super_admin';
  const isDoctor = role === 'doctor';
  const isHealthCenter = role === 'health_center';
  const isUser = role === 'user';

  // Load session and listen for auth changes
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error('Session error:', error);
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    loadSession();

    return () => listener?.subscription.unsubscribe();
  }, []);

  // Logout function
  const signOut = async () => {
    try {
      // Ask for confirmation
      const confirmLogout = window.confirm("Are you sure you want to log out?");
      if (!confirmLogout) return;

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Redirect to login page after successful logout
      router.push('/user');
    } catch (err) {
      console.error('Logout error:', err.message);
      alert(`Logout failed: ${err.message}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        role,
        isSuperAdmin,
        isDoctor,
        isHealthCenter,
        isUser,
        signOut,
      }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
