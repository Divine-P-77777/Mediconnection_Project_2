import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/* -------------------- TYPES -------------------- */

type UserRole = "super_admin" | "doctor" | "health_center" | "user";

interface Profile {
  role: UserRole;
}

interface DeleteRequestBody {
  id: string;
}

/* -------------------- SUPABASE ADMIN CLIENT -------------------- */

const supabaseAdmin: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* -------------------- GET: FETCH ALL CENTERS -------------------- */

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const authHeader: string | null =
      req.headers.get("authorization") ?? req.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token: string = authHeader.replace("Bearer ", "");

    /* -------- USER CLIENT (JWT BASED) -------- */
    const supabaseUser: SupabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    /* -------- AUTHENTICATE USER -------- */
    const {
      data: { user },
      error: userError,
    }: { data: { user: User | null }; error: Error | null } =
      await supabaseUser.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* -------- CHECK ROLE (ADMIN SOURCE OF TRUTH) -------- */
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const profile = profileData as Profile | null;

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 403 }
      );
    }

    if (profile.role !== "super_admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    /* -------- FETCH ALL HEALTH CENTERS -------- */
    const { data, error } = await supabaseAdmin
      .from("health_centers")
      .select("*");

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to fetch health centers";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/* -------------------- DELETE: REMOVE CENTER -------------------- */

export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const body: DeleteRequestBody = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Health center ID required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("health_centers")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json(
      { message: "Health center deleted" },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to delete health center";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
