import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/* -------------------- SUPABASE ADMIN CLIENT -------------------- */

const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* -------------------- TYPES -------------------- */

interface UpdateDocsBody {
  appointmentId: string;
  reports?: string[];
  bills?: string[];
  prescriptions?: string[];
}

/* -------------------- POST: UPDATE DOCUMENTS -------------------- */

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: UpdateDocsBody = await req.json();
    const { appointmentId, reports, bills, prescriptions } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, error: "Missing appointmentId" },
        { status: 400 }
      );
    }

    const updatePayload = {
      reports: reports ?? [],
      bills: bills ?? [],
      prescriptions: prescriptions ?? [],
    };

    const { data, error } = await supabase
      .from("appointments")
      .update(updatePayload)
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update documents";

    console.error("UpdateDocs error:", message);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
