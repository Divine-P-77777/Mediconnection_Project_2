import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */
interface BookingBody {
  center_id: string;
  user_id: string;
  center_name: string;
  date: string;
  time: string;
  purpose: string;
  user_name: string;
  phone: string;
  gender: string;
  dob: string;
}

interface AppointmentRow {
  id: string;
}

/* -------------------- POST: BOOK APPOINTMENT -------------------- */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: BookingBody = await req.json();
    const {
      center_id,
      user_id,
      center_name,
      date,
      time,
      purpose,
      user_name,
      phone,
      gender,
      dob,
    } = body;

    // Validate required fields
    if (
      !center_id ||
      !user_id ||
      !center_name ||
      !date ||
      !time ||
      !purpose ||
      !user_name ||
      !phone ||
      !gender ||
      !dob
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for existing booking in the same slot
    const { data: existingData, error: existErr } = await serviceSupabase
      .from("appointments")
      .select("id")
      .eq("center_id", center_id)
      .eq("date", date)
      .eq("time", time)
      .maybeSingle();

    if (existErr) throw existErr;

    if (existingData) {
      return NextResponse.json(
        { success: false, error: "Slot already booked" },
        { status: 409 }
      );
    }

    // Insert new appointment
    const { data: appointmentData, error } = await serviceSupabase
      .from("appointments")
      .insert([
        {
          center_id,
          user_id,
          center_name,
          date,
          time,
          purpose,
          user_name,
          phone,
          gender,
          dob,
        },
      ])
      .select("id")
      .single();

    if (error) throw error;

    const data = appointmentData as AppointmentRow;

    return NextResponse.json({
      success: true,
      appointment_id: data.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Booking failed";
    console.error("Appointment booking error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
