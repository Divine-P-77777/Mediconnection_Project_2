import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/* -------------------- SUPABASE CLIENT -------------------- */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

/* -------------------- TYPES -------------------- */
interface AppointmentDocs {
  reports: string[] | null;
  bills: string[] | null;
  prescriptions: string[] | null;
}

/* -------------------- GET: FETCH DOCUMENTS -------------------- */
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const appointmentId: string | null = searchParams.get("appointmentId");

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, error: "Missing appointmentId" },
        { status: 400 }
      );
    }

    const { data: docsData, error } = await supabase
      .from("appointments")
      .select("reports, bills, prescriptions")
      .eq("id", appointmentId)
      .single();

    if (error) throw error;

    const docs = docsData as AppointmentDocs | null;

    return NextResponse.json({ success: true, docs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Docs fetch error";
    console.error("Docs fetch error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
