import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/* -------------------- TYPES -------------------- */

type AuthType = "signup" | "login";

interface RegisterRequestBody {
  type: AuthType;
  email: string;
  password: string;
  username?: string;
}

/* -------------------- SUPABASE ADMIN CLIENT -------------------- */

const supabaseAdmin: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* -------------------- ROUTE HANDLER -------------------- */

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: RegisterRequestBody = await req.json();
    const { type, email, password, username } = body;

    /* -------- Validation -------- */
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    /* -------- SIGNUP -------- */
    if (type === "signup") {
      if (!username) {
        return NextResponse.json(
          { error: "Username required" },
          { status: 400 }
        );
      }

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: "user",
          username,
        },
      });

      if (error) {
        throw error;
      }

      return NextResponse.json(
        {
          message: "User created successfully",
          user: data.user,
        },
        { status: 201 }
      );
    }

    /* -------- LOGIN -------- */
    if (type === "login") {
      const supabaseClient: SupabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        throw error;
      }

      return NextResponse.json(
        {
          message: "Login successful",
          user: data.user,
        },
        { status: 200 }
      );
    }

    /* -------- INVALID TYPE -------- */
    return NextResponse.json(
      { error: "Invalid type" },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Server error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
