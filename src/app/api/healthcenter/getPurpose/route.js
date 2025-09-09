import { NextResponse } from "next/server";

import { serviceSupabase } from "@/supabase/serviceClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const center_id = searchParams.get("center_id");

  if (!center_id) {
    return NextResponse.json({ success: false, error: "Missing center_id" }, { status: 400 });
  }

  const { data, error } = await serviceSupabase
    .from("health_center_services")
    .select("*")
    .eq("health_center_id", center_id)
    .eq("status", "active");

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, purposes: data });
}