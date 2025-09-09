import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { appointmentId, reports, bills, prescriptions } = await req.json();

    if (!appointmentId) {
      return NextResponse.json({ success: false, error: "Missing appointmentId" }, { status: 400 });
    }

    const { data, error } = await supabase
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

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("UpdateDocs error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
