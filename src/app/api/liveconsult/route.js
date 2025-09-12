import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

// ✅ Create new live consultation booking
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userId,
      doctorId,
      fullName,
      dob,
      phone,
      gender,
      email,
      consultationDate,
      consultationTime,
      speciality,
      orderId, // optional
    } = body;

    // Validate required fields
    if (
      !userId ||
      !doctorId ||
      !fullName ||
      !dob ||
      !phone ||
      !gender ||
      !email ||
      !consultationDate ||
      !consultationTime ||
      !speciality
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into liveconsult
    const { data, error } = await serviceSupabase
      .from("liveconsult")
      .insert([
        {
          user_id: userId,
          doctor_id: doctorId,
          full_name: fullName,
          dob,
          phone,
          gender,
          email,
          consultation_date: consultationDate,
          consultation_time: consultationTime,
          speciality,
          status: "pending",
          bills: [], // start empty
          reports: [], // start empty
          prescriptions: [], // start empty
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ✅ Update prescriptions/reports/bills of an existing consult
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, reports, bills, prescriptions, status, meetUrl } = body;

    if (!id)
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

    const { data, error } = await serviceSupabase
      .from("liveconsult")
      .update({
        ...(reports && { reports }),
        ...(bills && { bills }),
        ...(prescriptions && { prescriptions }),
        ...(status && { status }),
        ...(meetUrl && { meet_url: meetUrl }),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
