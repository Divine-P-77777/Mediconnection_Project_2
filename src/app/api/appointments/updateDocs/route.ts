import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/* -------------------- SUPABASE CLIENT -------------------- */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

/* -------------------- TYPES -------------------- */
interface UpdateDocsBody {
  appointmentId: string;
  reports?: string[];
  bills?: string[];
  prescriptions?: string[];
}

interface AppointmentRow {
  id: string;
  reports: string[] | null;
  bills: string[] | null;
  prescriptions: string[] | null;
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

    const { data: updatedData, error } = await supabase
      .from("appointments")
      .update({
        reports: reports || [],
        bills: bills || [],
        prescriptions: prescriptions || [],
      })
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) throw error;

    const data = updatedData as AppointmentRow | null;

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "UpdateDocs error";
    console.error("UpdateDocs error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
