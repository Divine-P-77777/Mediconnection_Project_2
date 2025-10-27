import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

export async function POST(req) {
  try {
    const body = await req.json();
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

    // ✅ Basic field validation
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

    // ✅ Optional slot availability check (recommended)
    const { data: existing, error: existErr } = await serviceSupabase
      .from("appointments")
      .select("id")
      .eq("center_id", center_id)
      .eq("date", date)
      .eq("time", time)
      .maybeSingle();

    if (existErr) throw existErr;
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Slot already booked" },
        { status: 409 }
      );
    }

    // ✅ Insert new appointment
    const { data, error } = await serviceSupabase
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
  .select("id") // 👈 add this to return the inserted row
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
  appointment_id: data.id,
    });
  } catch (err) {
    console.error("Appointment booking error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
