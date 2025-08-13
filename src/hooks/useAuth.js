'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = user?.user_metadata?.role;
  const isSuperAdmin = role === 'super_admin';
  const isUser = role === 'user';
  const isDoctor = role === 'doctor';
  const isHealthCenter = role === 'health_center';

  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error('Session error:', error);
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    loadSession();
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // =============================
  // USER SIGNUP (First Name, Last Name)
  // =============================
  const signUpUser = async (email, password, firstName, lastName) => {
    if (!email || !password || !firstName || !lastName) {
      throw new Error('All fields are required.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: 'user', first_name: firstName, last_name: lastName } },
    });

    if (error) throw error;
    return data;
  };

  // =============================
  // HEALTH CENTER SIGNUP (Requires Approval)
  // =============================
  const signUpHealthCenter = async (formData) => {
    const {
      officialEmail, password, healthCenterName, pincode,
      contactNumber, address, hcrn, hfc
    } = formData;

    if (!officialEmail || !password || !healthCenterName || !pincode || !contactNumber || !address || (!hcrn && !hfc)) {
      throw new Error('All mandatory fields must be filled.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: officialEmail,
      password,
      options: {
        data: {
          role: 'health_center',
          health_center_name: healthCenterName,
          pincode,
          contact_number: contactNumber,
          address,
          hcrn,
          hfc,
          approved: false // must be approved by super_admin
        },
      },
    });

    if (error) throw error;
    return data;
  };

  // =============================
  // DOCTOR LOGIN (No signup, added by Health Center via backend)
  // =============================
  const signInDoctor = async (username, password) => {
    // Get doctor's email from profiles by username
    const { data: doctorProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, official_email')
      .eq('username', username)
      .eq('role', 'doctor')
      .single();

    if (profileError || !doctorProfile) {
      throw new Error('Doctor not found.');
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: doctorProfile.official_email,
      password,
    });

    if (authError) throw new Error(authError.message);
  };

  // =============================
  // LOGIN (User, Health Center, Super Admin)
  // =============================
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  // =============================
  // SUPER ADMIN LOGIN (Restricted Emails)
  // =============================
  const signInSuperAdmin = async (email, password) => {
    const allowedEmails = ['super@example.com']; // Change to your super_admin email list

    if (!allowedEmails.includes(email)) {
      throw new Error('Access denied: Super Admin only.');
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  // =============================
  // LOGOUT
  // =============================
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = '/auth';
  };

  // =============================
  // FORGOT PASSWORD
  // =============================
  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
  };

  // =============================
  // RESET PASSWORD
  // =============================
  const resetPassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        role,
        isSuperAdmin,
        isUser,
        isDoctor,
        isHealthCenter,
        signUpUser,
        signUpHealthCenter,
        signInDoctor,
        signIn,
        signInSuperAdmin,
        signOut,
        forgotPassword,
        resetPassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
