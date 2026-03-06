import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */
interface VerifyBody {
  order_id: string;
}

interface CashfreePayment {
  payment_status: "SUCCESS" | "PENDING" | "FAILED" | "USER_DROPPED";
  [key: string]: any;
}

interface PaymentRow {
  appointment_id: string;
}

/* -------------------- POST: VERIFY PAYMENT -------------------- */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: VerifyBody = await req.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json(
        { success: false, error: "Missing order_id" },
        { status: 400 }
      );
    }

    if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
      throw new Error("Missing Cashfree credentials");
    }

    const cashfree = new Cashfree(
      CFEnvironment.PRODUCTION, // Switched to PRODUCTION based on context, previously SANDBOX
      process.env.CASHFREE_CLIENT_ID,
      process.env.CASHFREE_CLIENT_SECRET
    );

    // Fetch payments
    // Using API version string "2023-08-01" as per other routes
    const response = await cashfree.PGOrderFetchPayments("2023-08-01", order_id);
    const paymentData = (response.data?.[0]) as CashfreePayment | undefined;

    if (!paymentData) {
      throw new Error("No payment record found for this order.");
    }

    const paymentStatus = paymentData.payment_status?.toUpperCase(); // API returns uppercase usually

    // 🔄 Update payment_appointments
    const { data: paymentRowData } = await serviceSupabase
      .from("payment_appointments")
      .select("appointment_id")
      .eq("order_id", order_id)
      .maybeSingle();

    const paymentRow = paymentRowData as PaymentRow | null;

    if (paymentRow) {
      await serviceSupabase
        .from("payment_appointments")
        .update({
          status: paymentStatus === "SUCCESS" ? "success" : "failed",
          response: paymentData,
        })
        .eq("order_id", order_id);

      // ✅ Update appointment status if payment successful
      if (paymentStatus === "SUCCESS") {
        await serviceSupabase
          .from("appointments")
          .update({ status: "confirmed" })
          .eq("id", paymentRow.appointment_id);
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (paymentStatus === "SUCCESS") {
      return NextResponse.redirect(
        new URL("/user/book/mybooking", baseUrl)
      );
    }

    return NextResponse.json({
      success: false,
      message: "Payment not successful",
      status: paymentStatus || "unknown",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Verification failed";
    console.error(
      "Verification error:",
      (err as any)?.response?.data || message
    );
    return NextResponse.json(
      {
        success: false,
        error: "Payment verification failed",
        details: (err as any)?.response?.data || message,
      },
      { status: 500 }
    );
  }
}
