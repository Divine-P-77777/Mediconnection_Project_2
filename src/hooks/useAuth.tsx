"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";


/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

type Role = "super_admin" | "doctor" | "health_center" | "user" | "guest";

interface ResetPasswordResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;

  role: Role;
  isSuperAdmin: boolean;
  isDoctor: boolean;
  isHealthCenter: boolean;
  isUser: boolean;

  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<ResetPasswordResult>;
}


interface AuthProviderProps {
  children: ReactNode;
}

/* ---------------------------------- */
/* Context */
/* ---------------------------------- */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ---------------------------------- */
/* Provider */
/* ---------------------------------- */

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  /* ---------- Role Resolution ---------- */
  const role: Role = (user?.user_metadata?.role as Role) ?? "guest";

  const isSuperAdmin = role === "super_admin";
  const isDoctor = role === "doctor";
  const isHealthCenter = role === "health_center";
  const isUser = role === "user";

  /* ---------- Session Handling ---------- */
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error);
      }

      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session ?? null);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    loadSession();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  /* ---------- Logout ---------- */
  const signOut = async (): Promise<void> => {
    try {
      const confirmLogout = window.confirm(
        "Are you sure you want to log out?"
      );
      if (!confirmLogout) return;

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.push("/user");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Logout error:", err.message);
        alert(`Logout failed: ${err.message}`);
      }
    }
  };

  /* ---------- Reset Password ---------- */
  const resetPassword = async (
    newPassword: string
  ): Promise<ResetPasswordResult> => {
    try {
      if (!newPassword || newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return { success: true };
    } catch (err) {
      if (err instanceof Error) {
        console.error("Reset password error:", err.message);
        return { success: false, error: err.message };
      }
      return { success: false, error: "Unknown error" };
    }
  };


  const forgotPassword = async (email: string): Promise<void> => {
    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Forgot password error:", err.message);
        throw err;
      }
      throw new Error("Failed to send reset email");
    }
  };

  /* ---------- Render ---------- */
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
        resetPassword,
        forgotPassword,
      }
      }
    >
      {
        loading ? (
          <div className="flex justify-center items-center h-screen" >
            <span>Loading...</ span >
          </div>
        ) : (
          children
        )}
    </AuthContext.Provider>
  );
};

/* ---------------------------------- */
/* Hook */
/* ---------------------------------- */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
