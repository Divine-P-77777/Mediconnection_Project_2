import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { serviceSupabase } from "@/supabase/serviceClient";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const cookieStore = await cookies();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        /* 1️⃣ Authenticate user */
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get: (name) => cookieStore.get(name)?.value,
                    set: (name, value, options) => {
                        try {
                            cookieStore.set({ name, value, ...options });
                        } catch { }
                    },
                    remove: (name, options) => {
                        try {
                            cookieStore.set({ name, value: "", ...options });
                        } catch { }
                    },
                },
            }
        );

        const { data: authData, error: authError } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (authError || !authData.user) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        const userId = authData.user.id;

        /* 2️⃣ Verify role (profiles) */
        const { data: profile, error: profileError } = await serviceSupabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();

        if (profileError || !profile) {
            await supabase.auth.signOut();
            return NextResponse.json(
                { error: "Profile not found." },
                { status: 500 }
            );
        }

        if (profile.role !== "health_center") {
            await supabase.auth.signOut();
            return NextResponse.json(
                { error: "Health Center account required." },
                { status: 403 }
            );
        }

        /* 3️⃣ Approval check (health_centers) */
        const { data: center, error: centerError } = await serviceSupabase
            .from("health_centers")
            .select("approved")
            .eq("user_id", userId)
            .single();

        if (centerError || !center) {
            await supabase.auth.signOut();
            return NextResponse.json(
                { error: "Health center record not found." },
                { status: 403 }
            );
        }

        if (!center.approved) {
            await supabase.auth.signOut();
            return NextResponse.json(
                {
                    error:
                        "Your health center is not approved yet. Please wait for admin approval.",
                },
                { status: 403 }
            );
        }

        /* 4️⃣ Success */
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("Health center login error:", err);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
