import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { serviceSupabase } from "@/supabase/serviceClient";
import axios from "axios";

const CASHFREE_BASE = process.env.CASHFREE_PAYOUT_BASE || "https://payout-api.cashfree.com";
const CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET;

// 🔹 Helper: Call Cashfree Payout API
async function cashfreeRequest(path, data) {
  return axios.post(`${CASHFREE_BASE}${path}`, data, {
    headers: {
      "x-client-id": CLIENT_ID,
      "x-client-secret": CLIENT_SECRET,
      "Content-Type": "application/json",
    },
    timeout: 15000,
  });
}

// 🔹 Ensure beneficiary exists for doctor
async function ensureBeneficiary(doctor) {
  const beneId = doctor.doctor_id;

  const payload = {
    beneId,
    name: doctor.bank_name,
    email: doctor.email || "na@example.com",
    phone: doctor.phone?.toString() || "9999999999",
    bankAccount: doctor.account_number,
    ifsc: doctor.ifsc_code,
    address1: "N/A",
  };

  try {
    await cashfreeRequest("/payout/v1/addBeneficiary", payload);
    console.log(`✅ Beneficiary created: ${beneId}`);
  } catch (err) {
    if (err.response?.data?.message?.includes("exists")) {
      console.log(`ℹ️ Beneficiary already exists: ${beneId}`);
    } else {
      throw err;
    }
  }

  return beneId;
}

// 🔹 Handle payment verification + trigger payout
export async function POST(req) {
  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json(
        { success: false, error: "Missing order_id" },
        { status: 400 }
      );
    }

    // Init Cashfree SDK
    const cashfree = new Cashfree(
      CFEnvironment.PRODUCTION, // change to PRODUCTION later
      process.env.CASHFREE_CLIENT_ID,
      process.env.CASHFREE_CLIENT_SECRET
    );

    // Verify order
    const response = await cashfree.PGOrderFetchPayments(order_id);
    const paymentData = response.data?.[0];

    if (paymentData?.payment_status === "SUCCESS") {
      // ✅ Update payment status in DB
      const { data: payment, error: updateErr } = await serviceSupabase
        .from("payment_liveconsult")
        .update({ status: "success" })
        .eq("order_id", order_id)
        .select("id")
        .single();

      if (updateErr) throw new Error(updateErr.message);

      // ✅ Fetch pending payout row (doctor + bank details)
      const { data: pending, error: fetchErr } =
        await serviceSupabase.rpc("get_pending_payouts");

      if (fetchErr) throw new Error(fetchErr.message);

      // Find the matching payout for this payment
      const row = pending.find((p) => p.payment_id === payment.id);

      if (row) {
        const transferId = `transfer_${row.payment_id}_${Date.now()}`;

        try {
          await ensureBeneficiary(row);

          const payoutPayload = {
            beneId: row.doctor_id,
            amount: row.amount,
            transferId,
            purpose: "consultation_payment",
          };

          const res = await cashfreeRequest(
            "/payout/v1/requestTransfer",
            payoutPayload
          );

          await serviceSupabase.from("payouts_history").insert([
            {
              payment_liveconsult_id: row.payment_id,
              transfer_id: transferId,
              status: res.data.status || "pending",
              response: res.data,
            },
          ]);

          console.log(`✅ Payout triggered for payment_id ${row.payment_id}`);
        } catch (err) {
          console.error("❌ Payout failed:", err.message);
          await serviceSupabase.from("payouts_history").insert([
            {
              payment_liveconsult_id: row.payment_id,
              transfer_id: transferId,
              status: "failed",
              response: { error: err.message },
            },
          ]);
        }
      }

      // 🔹 If frontend initiated, redirect user to bookings page
      if (process.env.NEXT_PUBLIC_BASE_URL) {
        return NextResponse.redirect(
          new URL("/user/book/mybooking", process.env.NEXT_PUBLIC_BASE_URL)
        );
      }

      // If webhook call, return success JSON
      return NextResponse.json({ success: true, status: "paid_and_payout_triggered" });
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
