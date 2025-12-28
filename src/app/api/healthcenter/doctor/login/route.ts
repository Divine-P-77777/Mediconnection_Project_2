import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/* -------------------- SUPABASE CLIENT -------------------- */

const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* -------------------- TYPES -------------------- */

interface DoctorLoginBody {
  email: string;
  password: string;
}

interface DoctorApproval {
  approved: boolean;
}

/* -------------------- POST: DOCTOR LOGIN -------------------- */

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: DoctorLoginBody = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    /* -------- CHECK DOCTOR APPROVAL -------- */
    const { data: doctorData, error: checkError } = await supabase
      .from("doctors")
      .select("approved")
      .eq("email", email)
      .maybeSingle();

    const doctor = doctorData as DoctorApproval | null;

    if (checkError) {
      throw checkError;
    }

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    if (!doctor.approved) {
      return NextResponse.json(
        { error: "Doctor is not approved yet" },
        { status: 403 }
      );
    }

    /* -------- AUTH LOGIN -------- */
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        user: data.user,
        session: data.session,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Doctor login failed";

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
