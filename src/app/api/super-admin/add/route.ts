import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient"; // service role client

export async function POST(req: Request) {
    try {
        const { email, password, username } = await req.json();

        if (!email || !password || !username) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const { data, error } = await serviceSupabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: "super_admin" },
        });

        if (error) throw error;

        const userId = data.user.id;

        const { error: profileError } = await serviceSupabase
            .from("profiles")
            .insert({
                id: userId,
                role: "super_admin",
                username,
                official_email: email,
                approved: true,
            });

        if (profileError) throw profileError;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}
