import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/* -------------------- TYPES (MATCH DB SCHEMA) -------------------- */

interface HealthCenterMe {
  id: string;
  name: string;
  hcrn_hfc: string;
  address: string;
  phone: string;
  pincode: string | number;
  approved: boolean;
  email: string;
  document_proof?: string | null;
  created_at: string;
}

/* -------------------- GET: CURRENT HEALTH CENTER -------------------- */

export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();

    const supabase = createRouteHandlerClient({
      cookies: async () => cookieStore,
    });

    /* -------- AUTHENTICATE USER -------- */
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

    /* -------- FETCH HEALTH CENTER -------- */
    const { data: centerData, error } = await supabase
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

    const data = centerData as HealthCenterMe | null;

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { data },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to fetch health center";

    console.error("Health center fetch error:", message);

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
