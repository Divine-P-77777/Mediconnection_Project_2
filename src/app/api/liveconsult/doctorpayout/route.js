import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";
import axios from "axios";

const CASHFREE_BASE = process.env.CASHFREE_PAYOUT_BASE || "https://payout-api.cashfree.com";
const CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET;

/**
 * Helper: Call Cashfree Payout API
 */
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

/**
 * Ensure beneficiary exists for doctor
 */
async function ensureBeneficiary(doctor) {
  const beneId = doctor.doctor_id; // use doctor UUID as beneId

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
    // If already exists, Cashfree returns error → ignore
    if (err.response?.data?.message?.includes("exists")) {
      console.log(`ℹ️ Beneficiary already exists: ${beneId}`);
    } else {
      throw err;
    }
  }

  return beneId;
}

/**
 * POST → Trigger doctor payouts
 */
export async function POST() {
  try {
    // Step 1: Fetch pending successful payments
    const { data: pending, error } = await serviceSupabase.rpc("get_pending_payouts");
    if (error) throw new Error(error.message);

    if (!pending || pending.length === 0) {
      return NextResponse.json({ success: true, message: "No pending payouts" });
    }

    const results = [];

    for (const row of pending) {
      const transferId = `transfer_${row.payment_id}_${Date.now()}`;

      try {
        // Step 2: Ensure beneficiary
        await ensureBeneficiary(row);

        // Step 3: Trigger payout
        const payoutPayload = {
          beneId: row.doctor_id,
          amount: row.amount,
          transferId,
          purpose: "consultation_payment",
        };

        const res = await cashfreeRequest("/payout/v1/requestTransfer", payoutPayload);

        // Step 4: Insert into payouts_history
        await serviceSupabase.from("payouts_history").insert([
          {
            payment_liveconsult_id: row.payment_id,
            transfer_id: transferId,
            status: res.data.status || "pending",
            response: res.data,
          },
        ]);

        results.push({ payment_id: row.payment_id, status: res.data.status });
      } catch (err) {
        console.error("❌ Payout failed:", row.payment_id, err.message);

        await serviceSupabase.from("payouts_history").insert([
          {
            payment_liveconsult_id: row.payment_id,
            transfer_id: transferId,
            status: "failed",
            response: { error: err.message },
          },
        ]);

        results.push({ payment_id: row.payment_id, status: "failed" });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error("Doctor payout error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
