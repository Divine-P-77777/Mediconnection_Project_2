import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/* -------------------- TYPES -------------------- */

interface HealthCenterMe {
  id: string;
  name: string;
  hcrn_hfc: string;
  address: string | null;
  phone: string | null;
  pincode: string | number | null;
  approved: boolean;
  email: string | null;
  document_proof?: string | null;
  created_at: string;
}

/* -------------------- GET -------------------- */

export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies(); // ✅ MUST be awaited

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => cookieStore.get(name)?.value,
        },
      }
    );

    /* ---------- AUTH ---------- */
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ---------- FETCH CENTER ---------- */
    const { data, error } = await supabase
      .from("health_centers")
      .select(
        `
        id,
        name,
        hcrn_hfc,
        address,
        phone,
        pincode,
        approved,
        email,
        document_proof,
        created_at
        `
      )
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Health center not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: data as HealthCenterMe },
      { status: 200 }
    );
  } catch (err) {
    console.error("Health center /me error:", err);
    return NextResponse.json(
      { error: "Failed to fetch health center" },
      { status: 500 }
    );
  }
}
