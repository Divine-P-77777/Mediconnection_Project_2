import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";
import { getAuthUser } from "@/lib/serverAuth";

/* -------------------- TYPES -------------------- */

type ConsultationStatus = "pending" | "confirmed" | "completed" | "cancelled" | string;

interface PatchAppointmentBody {
  appointmentId: string;
  status: ConsultationStatus;
}

/* -------------------- GET: DOCTOR APPOINTMENTS -------------------- */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID required" }, { status: 400 });
    }

    const { data, error } = await serviceSupabase
      .from("liveconsult")
      .select(`
        id, full_name, email,
        consultation_date, consultation_time,
        speciality, status,
        bills, prescriptions, reports, meet_url
      `)
      .eq("doctor_id", doctorId)
      .order("consultation_date", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch appointments" }, { status: 500 });
  }
}

/* -------------------- PATCH: UPDATE APPOINTMENT STATUS -------------------- */

export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser();
    const body: PatchAppointmentBody = await req.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json({ error: "Appointment ID and status required" }, { status: 400 });
    }

    // Verify the doctor owns this appointment
    const { data: appt } = await serviceSupabase
      .from("liveconsult")
      .select("doctor_id")
      .eq("id", appointmentId)
      .single();

    if (!appt || appt.doctor_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await serviceSupabase
      .from("liveconsult")
      .update({ status })
      .eq("id", appointmentId)
      .select()
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update appointment" }, { status: 500 });
  }
}
