// app/api/payment/verify/route.js
import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";

export async function POST(req) {
  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json(
        { success: false, error: "Missing order_id" },
        { status: 400 }
      );
    }

    // 🟡 Init Cashfree SDK
    const cashfree = new Cashfree(
      CFEnvironment.SANDBOX, // change to PRODUCTION later
      process.env.CASHFREE_CLIENT_ID,
      process.env.CASHFREE_CLIENT_SECRET
    );

    // 🔍 Verify order
    const response = await cashfree.PGOrderFetchPayments(order_id);

    const paymentData = response.data?.[0]; // first payment linked with this order

    if (paymentData?.payment_status === "SUCCESS") {
      // ✅ Redirect to bookings page
      return NextResponse.redirect(
        new URL("/user/book/mybooking", process.env.NEXT_PUBLIC_BASE_URL)
      );
    }

    return NextResponse.json({
      success: false,
      message: "Payment not successful",
      status: paymentData?.payment_status || "UNKNOWN",
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
