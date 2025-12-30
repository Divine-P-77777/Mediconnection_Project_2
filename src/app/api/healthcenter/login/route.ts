import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { serviceSupabase } from "@/supabase/serviceClient";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;
        const cookieStore = await cookies();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        /* 1️⃣ Authenticate user (normal auth client, NOT service role) */
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

        /* 2️⃣ Fetch profile using SERVICE ROLE (bypasses RLS safely) */
        const { data: profile, error: profileError } = await serviceSupabase
            .from("profiles")
            .select("role, approved")
            .eq("id", userId)
            .single();

        if (profileError || !profile) {
            await supabase.auth.signOut();
            return NextResponse.json(
                { error: "Failed to fetch user profile." },
                { status: 500 }
            );
        }

        /* 3️⃣ Role check */
        if (profile.role !== "health_center") {
            await supabase.auth.signOut();
            return NextResponse.json(
                {
                    error: "Unauthorized access. Health Center account required.",
                },
                { status: 403 }
            );
        }

        /* 4️⃣ Approval check */
        if (!profile.approved) {
            await supabase.auth.signOut();
            return NextResponse.json(
                {
                    error:
                        "Your account is not approved yet. You will be notified via email.",
                },
                { status: 403 }
            );
        }

        /* 5️⃣ Success */
        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    } catch (err) {
        console.error("Health center login error:", err);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
