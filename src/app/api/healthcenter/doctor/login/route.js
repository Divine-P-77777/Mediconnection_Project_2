import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ✅ Doctor login (only if approved)
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) throw new Error("Email and password required");

    // 1. Check if doctor exists & approved
    const { data: doctor, error: checkError } = await supabase
      .from("doctors")
      .select("approved")
      .eq("email", email)
      .maybeSingle();

    if (checkError) throw checkError;
    if (!doctor) throw new Error("Doctor not found");
    if (!doctor.approved) throw new Error("Doctor is not approved yet");

    // 2. Try login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    return NextResponse.json({ success: true, user: data.user, session: data.session });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
