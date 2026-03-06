import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { serviceSupabase } from "@/supabase/serviceClient";
import { cookies } from "next/headers";

const ROOT_ADMIN_EMAIL = process.env.ROOT_ADMIN_EMAIL;

export async function POST(req: Request) {
    const { email, password } = await req.json();
    const cookieStore = await cookies();

    // 1️⃣ Normal auth (anon client)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name) => cookieStore.get(name)?.value,
                set: (name, value, options) => {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // Handle server component cookie set limitations if needed
                    }
                },
                remove: (name, options) => {
                    try {
                        cookieStore.set({ name, value: "", ...options });
                    } catch (error) {
                        // Handle server component cookie set limitations if needed
                    }
                },
            },
        }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error || !data.user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const userId = data.user.id;

    // 2️⃣ Check if root admin OR existing admin
    const isRootAdmin = email === ROOT_ADMIN_EMAIL;

    const { data: profile } = await serviceSupabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

    if (!isRootAdmin && profile?.role !== "super_admin") {
        await supabase.auth.signOut();
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 3️⃣ Inject role into JWT (Option A)
    await serviceSupabase.auth.admin.updateUserById(userId, {
        app_metadata: {
            role: "super_admin",
        },
    });

    return NextResponse.json({ success: true });
}
