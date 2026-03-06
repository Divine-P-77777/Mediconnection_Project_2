import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";
import { requireSuperAdmin } from "@/lib/serverAuth";

/* -------------------- POST: CREATE SUPER ADMIN -------------------- */

export async function POST(req: Request) {
    try {
        await requireSuperAdmin();

        const { email, password, username } = await req.json();

        if (!email || !password || !username) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const { data, error } = await serviceSupabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { username },
            app_metadata: { role: "super_admin" },
        });

        if (error) throw error;

        const userId = data.user.id;

        const { error: profileError } = await serviceSupabase
            .from("profiles")
            .upsert({
                id: userId,
                role: "super_admin",
                username,
                official_email: email,
            }, { onConflict: "id" });

        if (profileError) {
            console.error("Profile upsert error:", profileError);
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        const status = err.message === "Forbidden" || err.message === "Unauthorized" ? 403 : 500;
        return NextResponse.json({ error: err.message }, { status });
    }
}
