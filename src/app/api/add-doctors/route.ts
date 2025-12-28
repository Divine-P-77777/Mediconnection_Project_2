import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/* -------------------- SUPABASE ADMIN CLIENT -------------------- */
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase admin credentials");
}

const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseKey);

/* -------------------- TYPES -------------------- */
interface AddDoctorBody {
  email: string;
  username: string;
  password?: string;
  addedByHealthCenter: string;
}

/* -------------------- POST: ADD DOCTOR -------------------- */
// Converting Pages API syntax to App Router syntax
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: AddDoctorBody = await req.json();
    const { email, username, password, addedByHealthCenter } = body;

    if (!email || !username || !password || !addedByHealthCenter) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "doctor",
        username,
        health_center_id: addedByHealthCenter,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Error";
    console.error("Add Doctor Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
