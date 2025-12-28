import { supabase } from "@/supabase/client";
import { NextResponse } from "next/server";

/* -------------------- TYPES -------------------- */

type ConsultationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | string;

interface PatchAppointmentBody {
  appointmentId: string;
  status: ConsultationStatus;
}

/* -------------------- GET: DOCTOR APPOINTMENTS -------------------- */

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId: string | null = searchParams.get("doctorId");

    if (!doctorId) {
      return NextResponse.json(
        { error: "Doctor ID required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("liveconsult")
      .select(
        `
        id,
        full_name,
        email,
        consultation_date,
        consultation_time,
        speciality,
        status,
        bills,
        prescriptions,
        reports,
        meet_url
      `
      )
      .eq("doctor_id", doctorId)
      .order("consultation_date", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch appointments";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/* -------------------- PATCH: UPDATE APPOINTMENT STATUS -------------------- */

export async function PATCH(req: Request): Promise<NextResponse> {
  try {
    const body: PatchAppointmentBody = await req.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: "Appointment ID and status required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("liveconsult")
      .update({ status })
      .eq("id", appointmentId)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update appointment";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
