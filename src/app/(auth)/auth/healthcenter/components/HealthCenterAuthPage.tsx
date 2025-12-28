"use client";

import { FC, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { supabase } from "@/supabase/client";
import { Loader2 } from "lucide-react";

const HealthCenterLoginForm = dynamic(
  () => import("./HealthCenterLoginForm"),
  { ssr: false }
);
const HealthCenterSignUpForm = dynamic(
  () => import("./HealthCenterSignUpForm"),
  { ssr: false }
);

type AuthTab = "login" | "signup";

const HealthCenterAuthPage: FC = () => {
  const [tab, setTab] = useState<AuthTab>("login");
  const [checkingSession, setCheckingSession] = useState<boolean>(true);

  const router = useRouter();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  /* ---------------- Session & Role Check ---------------- */
  useEffect(() => {
    const checkSession = async (): Promise<void> => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session?.user) {
          setCheckingSession(false);
          return;
        }

        const userId = data.session.user.id;

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single();

        if (profileError || profile?.role !== "health_center") {
          // ❌ Wrong role → logout & show auth page
          await supabase.auth.signOut();
          setCheckingSession(false);
          return;
        }

        // ✅ Correct role
        router.replace("/healthcenter/dashboard");
      } catch {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  /* ---------------- Loading State ---------------- */
  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  const tabButtonBase =
    "flex-1 py-2 text-sm font-semibold transition-colors duration-200";
  const activeTab = "bg-cyan-600 text-white";
  const inactiveTab = isDarkMode
    ? "bg-gray-700 hover:bg-gray-600 text-white"
    : "bg-gray-100 hover:bg-gray-200 text-gray-800";

  return (
    <div
      className={`min-h-screen px-4 py-24 transition-colors ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">
          Health Center Portal
        </h1>
        <p
          className={`text-base ${isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
        >
          Manage your health center account easily.
        </p>
      </div>

      <div
        className={`w-full max-w-md mx-auto rounded-2xl shadow-lg p-8 ${isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
      >
        <div
          className={`flex mb-6 border rounded-md overflow-hidden ${isDarkMode ? "border-gray-700" : "border-gray-300"
            }`}
        >
          <button
            className={`${tabButtonBase} ${tab === "login" ? activeTab : inactiveTab
              }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>

          <button
            className={`${tabButtonBase} ${tab === "signup" ? activeTab : inactiveTab
              }`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {tab === "login" && <HealthCenterLoginForm />}
        {tab === "signup" && <HealthCenterSignUpForm />}
      </div>
    </div>
  );
};

export default HealthCenterAuthPage;
