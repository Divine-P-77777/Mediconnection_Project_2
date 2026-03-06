import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */
interface VerifyRequestBody {
  orderId: string;
  doctorId: string;
  amount: number | string;
  paymentMethod?: object | any; // Cashfree payment method object can be complex
}

interface PaymentLiveConsult {
  id: string;
  doctor_id: string;
  order_id: string;
  status: string;
  payment_method: any; // storing JSON or string
  amount: number;
  created_at?: string;
}

interface CashfreePayment {
  payment_status: "SUCCESS" | "PENDING" | "FAILED" | "USER_DROPPED";
  payment_method?: any;
  [key: string]: any;
}

const CASFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CASFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET;

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: VerifyRequestBody = await req.json();
    const { orderId, doctorId, amount, paymentMethod } = body;

    if (!orderId || !doctorId || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing orderId, doctorId, or amount" },
        { status: 400 }
      );
    }

    if (!CASFREE_CLIENT_ID || !CASFREE_CLIENT_SECRET) {
      throw new Error("Missing Cashfree credentials");
    }

    // @ts-ignore: Assuming constructor compatibility
    const cashfree = new Cashfree(
      CFEnvironment.PRODUCTION, // we can keep SANDBOX for dev
      CASFREE_CLIENT_ID,
      CASFREE_CLIENT_SECRET
    );

    // Fetch payments for order
    // Original: await cashfree.PGOrderFetchPayments(orderId);
    // Assuming version arg is optional or defaulted in lib
    const response = await cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    // Explicitly casting the array of payments
    const paymentData = (response.data?.[0]) as CashfreePayment | undefined;

    if (!paymentData) {
      return NextResponse.json(
        { success: false, order_status: "NOT_FOUND" },
        { status: 404 }
      );
    }

    if (paymentData.payment_status === "SUCCESS") {
      const { data: existingData } = await serviceSupabase
        .from("payment_liveconsult")
        .select("id")
        .eq("order_id", orderId)
        .maybeSingle();

      const existing = existingData as { id: string } | null;

      if (!existing) {
        const { data: insertedData, error } = await serviceSupabase
          .from("payment_liveconsult")
          .insert([
            {
              doctor_id: doctorId,
              order_id: orderId,
              status: "success",
              payment_method: paymentMethod || paymentData.payment_method,
              amount: Number(amount),
            },
          ])
          .select()
          .single();

        if (error) throw new Error(error.message);

        const payment = insertedData as PaymentLiveConsult | null;

        return NextResponse.json({
          success: true,
          order_status: "PAID",
          payment,
        });
      }

      return NextResponse.json({
        success: true,
        order_status: "PAID",
        payment: existing,
      });
    }

    return NextResponse.json({
      success: false,
      order_status: paymentData.payment_status || "FAILED",
    });
  } catch (error: any) {
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
