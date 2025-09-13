import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const health_center_id = searchParams.get("health_center_id");

    if (!health_center_id) throw new Error("Missing health_center_id");

    const { data, error } = await serviceSupabase
      .from("account_details_healthcenter")
      .select("*")
      .eq("health_center_id", health_center_id)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { health_center_id, account_number, ifsc_code, bank_name } = body;

    if (!health_center_id || !account_number) {
      throw new Error("Missing required fields");
    }

    const { data, error } = await serviceSupabase
      .from("account_details_healthcenter")
      .upsert(
        { health_center_id, account_number, ifsc_code, bank_name },
        { onConflict: "health_center_id" }
      )
      .select()
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
