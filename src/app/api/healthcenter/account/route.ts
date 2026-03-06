import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */

interface HealthCenterAccount {
  health_center_id: string;
  account_number: string;
  ifsc_code?: string;
  bank_name?: string;
}

interface CreateOrUpdateAccountBody {
  health_center_id: string;
  account_number: string;
  ifsc_code?: string;
  bank_name?: string;
}

/* -------------------- GET: FETCH ACCOUNT DETAILS -------------------- */

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const health_center_id: string | null =
      searchParams.get("health_center_id");

    if (!health_center_id) {
      return NextResponse.json(
        { error: "Missing health_center_id" },
        { status: 400 }
      );
    }

    const { data: accountData, error } = await serviceSupabase
      .from("account_details_healthcenter")
      .select("*")
      .eq("health_center_id", health_center_id)
      .maybeSingle();

    const data = accountData as HealthCenterAccount | null;

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { data },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch account details";

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

/* -------------------- POST: UPSERT ACCOUNT DETAILS -------------------- */

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: CreateOrUpdateAccountBody = await req.json();
    const {
      health_center_id,
      account_number,
      ifsc_code,
      bank_name,
    } = body;

    if (!health_center_id || !account_number) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: accountData, error } = await serviceSupabase
      .from("account_details_healthcenter")
      .upsert(
        {
          health_center_id,
          account_number,
          ifsc_code,
          bank_name,
        },
        { onConflict: "health_center_id" }
      )
      .select()
      .maybeSingle();

    const data = accountData as HealthCenterAccount | null;

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to save account details";

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
