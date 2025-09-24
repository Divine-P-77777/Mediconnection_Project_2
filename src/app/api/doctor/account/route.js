import { NextResponse } from "next/server";
import { serviceSupabase as supabaseServer } from "@/supabase/serviceClient"; 

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctor_id");

    if (!doctorId) {
      return NextResponse.json({ error: "doctor_id required" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("account_details_doctors")
      .select("*")
      .eq("doctor_id", doctorId)
      .maybeSingle(); // safer than .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || {}); // empty if none
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { doctor_id, account_number, bank_name, ifsc_code } = body;

    if (!doctor_id || !account_number || !bank_name || !ifsc_code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // UPSERT using doctor_id
    const { data, error } = await supabaseServer
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
      .maybeSingle(); // safer

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
