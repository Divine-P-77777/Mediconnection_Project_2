import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { serviceSupabase } from "@/supabase/serviceClient";
import Loader from "@/app/components/Loader";
import { getRoleFromUser, getRoleDashboardUrl } from "@/lib/role-redirect";

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

  // 1. Check user session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // 2. Unauthenticated -> public landing
  if (userError || !user) {
    redirect("/user");
  }

  // 3. Resolve role
  const role = getRoleFromUser(user);

  // 4. Check approval for provider roles
  if (role === "health_center") {
    const { data: hc } = await serviceSupabase
      .from("health_centers")
      .select("approved")
      .eq("user_id", user.id)
      .maybeSingle();

    if (hc && !hc.approved) {
      redirect("/pending-approval");
    }
  }

  if (role === "doctor") {
    const { data: doc } = await serviceSupabase
      .from("doctors")
      .select("approved")
      .eq("id", user.id)
      .maybeSingle();

    if (doc && !doc.approved) {
      redirect("/pending-approval");
    }
  }

  // 5. Redirect to role dashboard
  redirect(getRoleDashboardUrl(role));

  return <Loader />;
}
