import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */

type AuthType = "signup" | "login";

interface RegisterRequestBody {
  type: AuthType;
  email: string;
  password: string;
  username?: string;
}

/* -------------------- POST -------------------- */

export async function POST(req: Request) {
  try {
    const body: RegisterRequestBody = await req.json();
    const { type, email, password, username } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    /* -------- SIGNUP -------- */
    if (type === "signup") {
      if (!username) {
        return NextResponse.json({ error: "Username required" }, { status: 400 });
      }

      const { data, error } = await serviceSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username },
        app_metadata: { role: "user" },
      });

      if (error) throw error;

      return NextResponse.json(
        { message: "User created successfully", user: data.user },
        { status: 201 }
      );
    }

    /* -------- LOGIN (cookie-based) -------- */
    if (type === "login") {
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

      // Ensure app_metadata role is set
      if (!data.user.app_metadata?.role) {
        await serviceSupabase.auth.admin.updateUserById(data.user.id, {
          app_metadata: { role: "user" },
        });
      }

      return NextResponse.json(
        { message: "Login successful", user: data.user },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
