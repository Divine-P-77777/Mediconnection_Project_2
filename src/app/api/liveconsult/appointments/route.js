import { supabase } from "@/supabase/client";
import { NextResponse } from "next/server";

// GET: Fetch all appointments for a doctor
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("liveconsult")
      .select(
        "id, full_name, email, consultation_date, consultation_time, speciality, status, bills, prescriptions, reports, meet_url"
      )
      .eq("doctor_id", doctorId)
      .order("consultation_date", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update appointment status
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json({ error: "Appointment ID and status required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("liveconsult")
      .update({ status })
      .eq("id", appointmentId)
      .select()
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
