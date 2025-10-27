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
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      appointment_id: data.id, // ✅ fixed
    });
  } catch (err) {
    console.error("Appointment booking error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
