import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Loader from "@/app/components/Loader";

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });

  // 1. Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 2. Not logged in: redirect to /user
  if (!session) {
    redirect("/user");
  }

  // 3. Fetch user profile (role & approved)
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, approved")
    .eq("id", session.user.id)
    .maybeSingle();

  // 4. On error: redirect to /user
  if (error) {
    console.error("Profile fetch error:", error.message);
    redirect("/user");
  }

  // 5. No profile: redirect to /user
  if (!profile) {
    redirect("/user");
  }

  // 6. Handle unapproved health_center
  if (profile.role === "health_center" && !profile.approved) {
    redirect("/pending-approval");
  }

  // 7. Role-based redirects
  // Note: /super_admin does not match your role mapping. Adjust as needed.
  const roleRedirects = {
    super_admin: "/admin",      // super_admin → /admin (adjust if you want /super_admin route)
    doctor: "/doctor",
    health_center: "/healthcenter",
    user: "/user",
  };

  const target = roleRedirects[profile.role] ?? "/user";
  redirect(target);

  // You won't see this because redirect() throws, but it's here for completeness
  return <Loader />;
}