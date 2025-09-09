import { NextResponse } from "next/server";
import { Cashfree } from "cashfree-pg";

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // Use Cashfree SDK v5+ instance (dynamic config)
    const cashfree = new Cashfree(
      Cashfree.SANDBOX,
      process.env.CASHFREE_CLIENT_ID,
      process.env.CASHFREE_CLIENT_SECRET
    );

    const apiVersion = "2023-08-01";
    const response = await cashfree.PGFetchOrder(apiVersion, orderId);

    return NextResponse.json({
      success: true,
      order_status: response.data.order_status,
      data: response.data,
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}