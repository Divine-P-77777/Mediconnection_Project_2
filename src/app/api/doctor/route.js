import { NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export async function GET (req) {
  const { searchParams } = new URL(req.url);
  const service = searchParams.get("service");
  const search = searchParams.get("search");

  try {
    let query = supabase
      .from("doctor_services")
      .select(`id, doctor_id, service_name, price, doctors(name, account_number, id, profile ,specialization)`);

    if (search) {
      query = query.ilike("service_name", `%${search}%`);
    } else if (service) {
      query = query.eq("service_name", service);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, doctors: data || [] });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
