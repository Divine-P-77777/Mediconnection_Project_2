import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */
interface AdminAccessBody {
  email: string;
  username: string;
  password?: string;
  addedByHealthCenter: string;
}

/* -------------------- POST: ADMIN CREATE USER -------------------- */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: AdminAccessBody = await req.json();
    const { email, username, password, addedByHealthCenter } = body;

    // Basic validation
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await serviceSupabase.auth.admin.createUser({
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
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
