import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Loader from "@/app/components/Loader";

export default async function Page() {
  // ✅ Await cookies()
  const cookieStore = await cookies();

  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  // 1. Get session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  // 2. If no session → redirect
  if (sessionError || !session) {
    console.error("Session error:", sessionError ?? "No session available");
    redirect("/user");
  }

  // 3. Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, approved")
    .eq("id", session.user.id)
    .maybeSingle();

  // 4. On error or no profile → redirect
  if (profileError || !profile) {
    console.error("Profile fetch error:", profileError?.message);
    redirect("/user");
  }

  // 5. Handle unapproved health_center
  if (profile.role === "health_center" && !profile.approved) {
    redirect("/pending-approval");
  }

  // 6. Role-based redirects
  const roleRedirects = {
    super_admin: "/admin", // super_admin → /admin
    doctor: "/doctor",
    health_center: "/healthcenter",
    user: "/user",
  };

  const target = roleRedirects[profile.role] ?? "/user";
  redirect(target);

  // Loader fallback
  return <Loader />;
}
