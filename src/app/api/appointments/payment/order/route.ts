import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */
interface CreateOrderBody {
  appointment_id: string;
  amount: number | string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

interface CashfreeOrderResponse {
  order_id: string;
  payment_session_id: string;
  [key: string]: unknown;
}

/* -------------------- POST: CREATE ORDER -------------------- */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: CreateOrderBody = await req.json();
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

    if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
      throw new Error("Missing Cashfree credentials");
    }

    //  Init Cashfree SDK
    const cashfree = new Cashfree(
      CFEnvironment.PRODUCTION, // Switched to PRODUCTION based on previous context, can be SANDBOX
      process.env.CASHFREE_CLIENT_ID,
      process.env.CASHFREE_CLIENT_SECRET
    );

    // Create order
    const request = {
      order_amount: String(amount),
      order_currency: "INR",
      customer_details: {
        customer_id,
        customer_name,
        customer_email,
        customer_phone,
      },
    };

    // Fix applied similar to consultation route
    const response = await cashfree.PGCreateOrder(request as any);
    const data = response.data as CashfreeOrderResponse;

    const order_id = data.order_id;
    const payment_session_id = data.payment_session_id;

    //  Store in payment_appointments
    const { error } = await serviceSupabase
      .from("payment_appointments")
      .insert([
        {
          appointment_id,
          order_id,
          payment_session_id,
          amount: Number(amount),
          status: "pending",
          response: data,
        },
      ]);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      order_id,
      payment_session_id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Order creation failed";
    console.error(
      "Cashfree order error:",
      (err as any)?.response?.data || message
    );

    return NextResponse.json(
      {
        success: false,
        error: "Order creation failed",
        details: (err as any)?.response?.data || message,
      },
      { status: 500 }
    );
  }
}
