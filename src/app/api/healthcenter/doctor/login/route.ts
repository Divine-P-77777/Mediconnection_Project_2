import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */

interface DoctorLoginBody {
  email: string;
  password: string;
}

/* -------------------- POST: DOCTOR LOGIN -------------------- */

export async function POST(req: Request) {
  try {
    const { email, password }: DoctorLoginBody = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    /* 1️⃣ Check doctor approval BEFORE auth (avoids wasted signIn) */
    const { data: doctor } = await serviceSupabase
      .from("doctors")
      .select("approved")
      .eq("email", email)
      .maybeSingle();

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    if (!doctor.approved) {
      return NextResponse.json({ error: "Doctor is not approved yet" }, { status: 403 });
    }

    /* 2️⃣ Authenticate with cookie-based server client */
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => cookieStore.get(name)?.value,
          set: (name, value, options) => {
            try { cookieStore.set({ name, value, ...options }); } catch { }
          },
          remove: (name, options) => {
            try { cookieStore.set({ name, value: "", ...options }); } catch { }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    /* 3️⃣ Ensure app_metadata has doctor role */
    if (data.user.app_metadata?.role !== "doctor") {
      await serviceSupabase.auth.admin.updateUserById(data.user.id, {
        app_metadata: { role: "doctor" },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Doctor login failed" }, { status: 400 });
  }
}
