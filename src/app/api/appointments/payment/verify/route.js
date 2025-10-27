import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { serviceSupabase } from "@/supabase/serviceClient";

export async function POST(req) {
  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json(
        { success: false, error: "Missing order_id" },
        { status: 400 }
      );
    }

    const cashfree = new Cashfree(
      CFEnvironment.SANDBOX,
      process.env.CASHFREE_CLIENT_ID,
      process.env.CASHFREE_CLIENT_SECRET
    );

    const response = await cashfree.PGOrderFetchPayments(order_id);
    const paymentData = response.data?.[0];

    if (!paymentData) {
      throw new Error("No payment record found for this order.");
    }

    const paymentStatus = paymentData.payment_status?.toLowerCase();

    // 🔄 Update payment_appointments
    const { data: paymentRow } = await serviceSupabase
      .from("payment_appointments")
      .select("appointment_id")
      .eq("order_id", order_id)
      .single();

    if (paymentRow) {
      await serviceSupabase
        .from("payment_appointments")
        .update({
          status: paymentStatus === "success" ? "success" : "failed",
          response: paymentData,
        })
        .eq("order_id", order_id);

      // ✅ Update appointment status if payment successful
      if (paymentStatus === "success") {
        await serviceSupabase
          .from("appointments")
          .update({ status: "confirmed" })
          .eq("id", paymentRow.appointment_id);
      }
    }

    if (paymentStatus === "success") {
      return NextResponse.redirect(
        new URL("/user/book/mybooking", process.env.NEXT_PUBLIC_BASE_URL)
      );
    }

    return NextResponse.json({
      success: false,
      message: "Payment not successful",
      status: paymentStatus || "unknown",
    });
  } catch (error) {
    console.error("Verification error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        error: "Payment verification failed",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
