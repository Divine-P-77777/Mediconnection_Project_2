import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

// POST: update prescriptions/reports/bills arrays
export async function POST(req) {
  try {
    const body = await req.json();
    const { id, reports, bills, prescriptions } = body;

    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

    // Update arrays in the liveconsult table
    const { error } = await serviceSupabase
      .from("liveconsult")
      .update({
        reports, // array of URLs
        bills, // array of URLs
        prescriptions // array of URLs
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}