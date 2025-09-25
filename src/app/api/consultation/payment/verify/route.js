import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { serviceSupabase } from "@/supabase/serviceClient";

export async function POST(req) {
  try {
    const { orderId, doctorId, amount, paymentMethod } = await req.json();

    if (!orderId ||  !doctorId || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing orderId,  doctorId, or amount" },
        { status: 400 }
      );
    }


    const cashfree = new Cashfree(
      CFEnvironment.PRODUCTION, // we can  keep SANDBOX for dev
      process.env.CASHFREE_CLIENT_ID, 
      process.env.CASHFREE_CLIENT_SECRET
    );

    const response = await cashfree.PGOrderFetchPayments(orderId);
    const paymentData = response.data?.[0];

    if (!paymentData) {
      return NextResponse.json(
        { success: false, order_status: "NOT_FOUND" },
        { status: 404 }
      );
    }

    if (paymentData.payment_status === "SUCCESS") {
      const { data: existing } = await serviceSupabase
        .from("payment_liveconsult")
        .select("id")
        .eq("order_id", orderId)
        .maybeSingle();

      if (!existing) {
        const { data, error } = await serviceSupabase
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

        return NextResponse.json({
          success: true,
          order_status: "PAID",
          payment: data,
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
