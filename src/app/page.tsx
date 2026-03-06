import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { serviceSupabase } from "@/supabase/serviceClient";
import Loader from "@/app/components/Loader";

export default async function Page() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
      },
    }
  );

  // 1. Get user (more reliable than getSession)
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  // 2. No user → public landing
  if (userError || !user) {
    redirect("/user");
  }

  // 3. Check app_metadata first, then profile table
  const role = user.app_metadata?.role;

  if (role) {
    const roleRedirects: Record<string, string> = {
      super_admin: "/admin",
      doctor: "/doctor",
      health_center: "/healthcenter",
      user: "/user",
    };

    // For health_center, check approval
    if (role === "health_center") {
      const { data: hc } = await serviceSupabase
        .from("health_centers")
        .select("approved")
        .eq("user_id", user.id)
        .single();

      if (hc && !hc.approved) {
        redirect("/pending-approval");
      }
    }

    redirect(roleRedirects[role] ?? "/user");
  }

  // 4. Fallback: check profiles table
  const { data: profile } = await serviceSupabase
    .from("profiles")
    .select("role, approved")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/user");
  }

  if (profile.role === "health_center" && !profile.approved) {
    redirect("/pending-approval");
  }

  const roleRedirects: Record<string, string> = {
    super_admin: "/admin",
    doctor: "/doctor",
    health_center: "/healthcenter",
    user: "/user",
  };

  redirect(roleRedirects[profile.role] ?? "/user");

  return <Loader />;
}
