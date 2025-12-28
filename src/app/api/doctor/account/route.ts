import { NextResponse } from "next/server";
import { serviceSupabase as supabaseServer } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */

interface DoctorAccount {
  id: string; // Assuming 'id' exists in DB auto-generated
  doctor_id: string;
  account_number: string;
  bank_name: string;
  ifsc_code: string;
  created_at?: string;
  updated_at?: string;
}

interface AccountRequestBody {
  doctor_id: string;
  account_number: string;
  bank_name: string;
  ifsc_code: string;
}

/* -------------------- GET: FETCH ACCOUNT -------------------- */

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId: string | null = searchParams.get("doctor_id");

    if (!doctorId) {
      return NextResponse.json(
        { error: "doctor_id required" },
        { status: 400 }
      );
    }

    const { data: accountData, error } = await supabaseServer
      .from("account_details_doctors")
      .select("*")
      .eq("doctor_id", doctorId)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const data = accountData as DoctorAccount | null;

    return NextResponse.json(data || {});
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/* -------------------- POST: UPSERT ACCOUNT -------------------- */

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: AccountRequestBody = await req.json();
    const { doctor_id, account_number, bank_name, ifsc_code } = body;

    if (!doctor_id || !account_number || !bank_name || !ifsc_code) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // UPSERT using doctor_id
    const { data: accountData, error } = await supabaseServer
      .from("account_details_doctors")
      .upsert(
        [
          {
            doctor_id,
            account_number,
            bank_name,
            ifsc_code,
          },
        ],
        { onConflict: "doctor_id" }
      )
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const data = accountData as DoctorAccount | null;

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
