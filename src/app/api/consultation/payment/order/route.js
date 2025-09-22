import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";

export async function POST(req) {
  try {
    const body = await req.json();

    // ✅ Initialize Cashfree correctly
    const cashfree = new Cashfree(
      CFEnvironment.SANDBOX, // change to PRODUCTION later
      process.env.CASHFREE_CLIENT_ID,
      process.env.CASHFREE_CLIENT_SECRET
    );

    // ✅ Build order request
    const request = {
      order_amount: body.amount || "1", // dynamic amount
      order_currency: "INR",
      customer_details: {
        customer_id: body.customer_id || "node_sdk_test",
        customer_name: body.customer_name || "Test User",
        customer_email: body.customer_email || "example@gmail.com",
        customer_phone: body.customer_phone || "9999999999",
      },
    };

    // ✅ Create order using correct method
    const response = await cashfree.PGCreateOrder(request);

    return NextResponse.json({
      success: true,
      order_id: response.data.order_id,
      payment_session_id: response.data.payment_session_id,
    });
  } catch (error) {
    console.error("Cashfree error:", error.response?.data || error.message);

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
