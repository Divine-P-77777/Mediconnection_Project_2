import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";

/* -------------------- TYPES -------------------- */

interface CreateOrderBody {
  amount?: number | string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
}

interface CashfreeOrderResponse {
  order_id: string;
  payment_session_id: string;
  [key: string]: unknown;
}

/* -------------------- POST: CREATE PAYMENT ORDER -------------------- */

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: CreateOrderBody = await req.json();

    /* -------- INIT CASHFREE -------- */
    const cashfree = new Cashfree(
      CFEnvironment.PRODUCTION, // change to SANDBOX for testing
      process.env.CASHFREE_CLIENT_ID!,
      process.env.CASHFREE_CLIENT_SECRET!
    );

    /* -------- BUILD ORDER REQUEST -------- */
    const orderRequest = {
      order_amount: body.amount ?? "1",
      order_currency: "INR",
      customer_details: {
        customer_id: body.customer_id ?? "node_sdk_test",
        customer_name: body.customer_name ?? "Test User",
        customer_email: body.customer_email ?? "example@gmail.com",
        customer_phone: body.customer_phone ?? "9999999999",
      },
    };

    /* -------- CREATE ORDER -------- */
    const response = await cashfree.PGCreateOrder(orderRequest as any);

    const data = response.data as CashfreeOrderResponse;

    return NextResponse.json(
      {
        success: true,
        order_id: data.order_id,
        payment_session_id: data.payment_session_id,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Order creation failed";

    console.error(
      "Cashfree error:",
      (err as any)?.response?.data ?? message
    );

    return NextResponse.json(
      {
        success: false,
        error: "Order creation failed",
        details: (err as any)?.response?.data ?? message,
      },
      { status: 500 }
    );
  }
}
