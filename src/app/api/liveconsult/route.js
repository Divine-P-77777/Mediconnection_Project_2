import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

// Create new live consultation booking + payment record
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
      orderId, // optional, can be payment gateway order ID
      paymentStatus = "pending", // default
      paymentMethod = null, // optional
      amount = null, // optional
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

    // Step 1: Insert into liveconsult
    const { data: consult, error: consultError } = await serviceSupabase
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
          bills: [],
          reports: [],
          prescriptions: [],
        },
      ])
      .select()
      .single();

    if (consultError) {
      return NextResponse.json(
        { success: false, error: consultError.message },
        { status: 500 }
      );
    }

    // Step 2: Insert into payment_liveconsult (referencing the liveconsult row)
    const { data: payment, error: paymentError } = await serviceSupabase
      .from("payment_liveconsult")
      .insert([
        {
          liveconsult_id: consult.id, // foreign key reference
          order_id: orderId || null,
          status: paymentStatus,
          payment_method: paymentMethod,
          amount,
        },
      ])
      .select()
      .single();

    if (paymentError) {
      return NextResponse.json(
        { success: false, error: paymentError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { consult, payment },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// Update prescriptions/reports/bills/payment/status
export async function PATCH(req) {
  try {
    const body = await req.json();
    const {
      id, // liveconsult id
      reports,
      bills,
      prescriptions,
      status,
      meetUrl,
      paymentStatus,
      paymentId,
    } = body;

    if (!id)
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 }
      );

    // Step 1: Update liveconsult record
    const { data: consult, error: consultError } = await serviceSupabase
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

    if (consultError) {
      return NextResponse.json(
        { success: false, error: consultError.message },
        { status: 500 }
      );
    }

    let payment = null;

    // Step 2: Optionally update payment record
    if (paymentId || paymentStatus) {
      const { data, error } = await serviceSupabase
        .from("payment_liveconsult")
        .update({
          ...(paymentStatus && { status: paymentStatus }),
        })
        .eq(paymentId ? "id" : "liveconsult_id", paymentId || id)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      payment = data;
    }

    return NextResponse.json({ success: true, data: { consult, payment } });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
