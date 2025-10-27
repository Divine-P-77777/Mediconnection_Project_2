import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { serviceSupabase } from "@/supabase/serviceClient";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      appointment_id,
      amount,
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
    } = body;

    if (!appointment_id || !amount || !customer_id) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🟡 Init Cashfree SDK
    const cashfree = new Cashfree(
      CFEnvironment.SANDBOX, // change to PRODUCTION later
      process.env.CASHFREE_CLIENT_ID,
      process.env.CASHFREE_CLIENT_SECRET
    );

    // 💰 Create order
    const request = {
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id,
        customer_name,
        customer_email,
        customer_phone,
      },
    };

    const response = await cashfree.PGCreateOrder(request);
    const order_id = response.data.order_id;
    const payment_session_id = response.data.payment_session_id;

    // 🧾 Store in payment_appointments
    const { error } = await serviceSupabase
      .from("payment_appointments")
      .insert([
        {
          appointment_id,
          order_id,
          payment_session_id,
          amount,
          status: "pending",
          response: response.data,
        },
      ]);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      order_id,
      payment_session_id,
    });
  } catch (error) {
    console.error("Cashfree order error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        error: "Order creation failed",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
