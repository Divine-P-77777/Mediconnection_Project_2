import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      center_id, user_id, center_name, date, time, purpose,
      user_name, phone, gender, dob
    } = body;

    if (!center_id || !user_id || !center_name || !date || !time || !purpose || !user_name || !phone || !gender || !dob) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Optionally check for slot clash
    // const { data: existing, error: existErr } = await supabase
    //   .from("appointments")
    //   .select("id")
    //   .eq("center_id", center_id)
    //   .eq("date", date)
    //   .eq("time", time);
    // if (existing?.length) {
    //   return NextResponse.json({ success: false, error: "Slot already booked" }, { status: 409 });
    // }

    const { error } = await serviceSupabase.from("appointments").insert([{
      center_id, user_id, center_name, date, time, purpose,
      user_name, phone, gender, dob
    }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}