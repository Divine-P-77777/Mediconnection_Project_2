"use client";

import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/client";
import { Loader2 } from "lucide-react";

type UserRole = "super_admin" | "doctor" | "health_center" | "user";

const AuthCallback: FC = () => {
  const router = useRouter();

  useEffect(() => {
    const finalizeAuth = async (): Promise<void> => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session?.user) {
          router.replace("/auth?error=Authentication failed");
          return;
        }

        const user = session.user;

        // Fetch role from profiles table (source of truth)
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        // First-time OAuth user → create profile
        if (profileError || !profile) {
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              role: "user",
              username:
                user.user_metadata?.username ??
                user.email?.split("@")[0],
            });

          if (insertError) {
            router.replace("/auth?error=Profile initialization failed");
            return;
          }

          router.replace("/user");
          return;
        }

        const role = profile.role as UserRole;

        // Role-based redirect
        switch (role) {
          case "super_admin":
            router.replace("/admin/dashboard");
            break;
          case "doctor":
            router.replace("/doctor");
            break;
          case "health_center":
            router.replace("/healthcenter");
            break;
          default:
            router.replace("/user");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        router.replace("/auth?error=Unexpected error");
      }
    };

    finalizeAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
        <p className="text-sm text-muted-foreground">
          Finalizing login...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
