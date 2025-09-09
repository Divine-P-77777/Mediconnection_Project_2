import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");

    if (!appointmentId) {
      return NextResponse.json({ success: false, error: "Missing appointmentId" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("reports, bills, prescriptions")
      .eq("id", appointmentId)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, docs: data });
  } catch (err) {
    console.error("Docs fetch error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
