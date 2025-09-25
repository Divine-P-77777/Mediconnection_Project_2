import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { serviceSupabase } from "@/supabase/serviceClient";

// 🔹 Verify order and log into DB
export async function POST(req) {
  try {
    const { orderId, liveconsultId, amount, paymentMethod } = await req.json();

    if (!orderId || !liveconsultId || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing orderId, liveconsultId, or amount" },
        { status: 400 }
      );
    }

    const cashfree = new Cashfree(
      CFEnvironment.PRODUCTION, // change to PRODUCTION later
      process.env.CASHFREE_CLIENT_ID,
      process.env.CASHFREE_CLIENT_SECRET
    );

    // 🔹 Verify payment status
    const response = await cashfree.PGOrderFetchPayments(orderId);
    const paymentData = response.data?.[0];

    if (paymentData?.payment_status === "SUCCESS") {
      // ✅ Insert record into payment_liveconsult
      const { data, error } = await serviceSupabase
        .from("payment_liveconsult")
        .insert([
          {
            liveconsult_id: liveconsultId,
            order_id: orderId,
            status: "success",
            payment_method: paymentMethod || paymentData.payment_method,
            amount,
          },
        ])
        .select()
        .single();

      if (error) throw new Error(error.message);

      return NextResponse.json({
        success: true,
        status: "paid",
        payment: data,
      });
    }

    return NextResponse.json({
      success: false,
      status: paymentData?.payment_status || "UNKNOWN",
    });
  } catch (error) {
    console.error("Verify error:", error.response?.data || error.message);
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
