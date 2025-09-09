import { NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export async function POST(req) {
  try {
    const body = await req.json();
    let {
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
      bill,
      prescriptions,
      reports,
      status,
    } = body;

    // Trim
    fullName = fullName?.trim();
    dob = dob?.trim();
    email = email?.trim();
    consultationTime = consultationTime?.trim();
    speciality = speciality?.trim();
    gender = gender?.trim();
    consultationDate = consultationDate?.trim();
    status = status?.trim();

    // Validate required
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
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const phoneNumber = Number(phone);
    if (isNaN(phoneNumber)) {
      return NextResponse.json(
        { success: false, error: "Phone must be a valid number" },
        { status: 400 }
      );
    }

    if (isNaN(new Date(dob).getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid date of birth" },
        { status: 400 }
      );
    }
    if (isNaN(new Date(consultationDate).getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid consultation date" },
        { status: 400 }
      );
    }

    // Insert
    const { data, error } = await supabase
      .from("liveconsult")
      .insert([
        {
          user_id: userId,
          doctor_id: doctorId,
          full_name: fullName,
          dob,
          phone: phoneNumber,
          gender,
          email,
          consultation_date: consultationDate,
          consultation_time: consultationTime,
          speciality,
          bill: bill || 0,
          prescriptions: prescriptions || [],
          reports: reports || [],
          status: status || "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, booking: data });
  } catch (err) {
    console.error("Live consult booking error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
