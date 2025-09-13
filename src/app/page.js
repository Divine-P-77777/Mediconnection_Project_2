import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Loader from "@/app/components/Loader";

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });


  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/user"); 
  }

  //  Fetch profile (role + approval only)
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, approved")
    .eq("id", session.user.id)
    .maybeSingle();

  if (error) {
    console.error("Profile fetch error:", error.message);
    return redirect("/user");
  }

  //  No profile → fallback to user dashboard
  if (!profile) {
    return redirect("/user");
  }
  //  Handle unapproved health center
  if (profile.role === "health_center" && !profile.approved) {
    return redirect("/pending-approval");
  }

  // Role-based redirects
  const roleRedirects = {
    super_admin: "/admin",
    doctor: "/doctor",
    health_center: "/healthcenter",
    user: "/user",
  };

  const target = roleRedirects[profile.role] ?? "/user";
  redirect(target);

  // 🔹 Fallback loader (though redirect() never returns)
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  );
}
