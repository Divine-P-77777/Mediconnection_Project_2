import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";
import axios, { AxiosResponse } from "axios";

/* -------------------- ENV CONFIG -------------------- */

const CASHFREE_BASE =
  process.env.CASHFREE_PAYOUT_BASE ??
  "https://payout-api.cashfree.com";

const CLIENT_ID = process.env.CASHFREE_CLIENT_ID!;
const CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET!;

/* -------------------- TYPES -------------------- */

interface PendingPayout {
  payment_id: string;
  doctor_id: string;
  amount: number;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  phone?: string | number;
  email?: string;
}

interface CashfreeResponse {
  status?: string;
  message?: string;
  [key: string]: unknown;
}

/* -------------------- CASHFREE HELPER -------------------- */

async function cashfreeRequest(
  path: string,
  data: Record<string, unknown>
): Promise<AxiosResponse<CashfreeResponse>> {
  return axios.post(`${CASHFREE_BASE}${path}`, data, {
    headers: {
      "x-client-id": CLIENT_ID,
      "x-client-secret": CLIENT_SECRET,
      "Content-Type": "application/json",
    },
    timeout: 15_000,
  });
}

/* -------------------- ENSURE BENEFICIARY -------------------- */

async function ensureBeneficiary(
  doctor: PendingPayout
): Promise<string> {
  const beneId = doctor.doctor_id;

  const payload = {
    beneId,
    name: doctor.bank_name,
    email: doctor.email ?? "na@example.com",
    phone: doctor.phone?.toString() ?? "9999999999",
    bankAccount: doctor.account_number,
    ifsc: doctor.ifsc_code,
    address1: "N/A",
  };

  try {
    await cashfreeRequest("/payout/v1/addBeneficiary", payload);
    console.log(`✅ Beneficiary created: ${beneId}`);
  } catch (err: unknown) {
    if (
      axios.isAxiosError(err) &&
      err.response?.data?.message?.includes("exists")
    ) {
      console.log(`ℹ️ Beneficiary already exists: ${beneId}`);
    } else {
      throw err;
    }
  }

  return beneId;
}

/* -------------------- POST: DOCTOR PAYOUT -------------------- */

export async function POST(): Promise<NextResponse> {
  try {
    /* -------- Fetch pending payouts -------- */
    const { data: pendingData, error } = await serviceSupabase
      .rpc("get_pending_payouts");

    const pending = pendingData as PendingPayout[] | null;

    if (error) throw error;

    if (!pending || pending.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending payouts",
      });
    }

    const results: Array<{
      payment_id: string;
      status: string;
    }> = [];

    /* -------- Process payouts -------- */
    for (const row of pending) {
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
            status: res.data.status ?? "pending",
            response: res.data,
          },
        ]);

        results.push({
          payment_id: row.payment_id,
          status: res.data.status ?? "pending",
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Payout failed";

        console.error(
          "❌ Payout failed:",
          row.payment_id,
          message
        );

        await serviceSupabase.from("payouts_history").insert([
          {
            payment_liveconsult_id: row.payment_id,
            transfer_id: transferId,
            status: "failed",
            response: { error: message },
          },
        ]);

        results.push({
          payment_id: row.payment_id,
          status: "failed",
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Doctor payout error";

    console.error("Doctor payout error:", err);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
