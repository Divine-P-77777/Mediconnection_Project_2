import { NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

// GET, POST, PATCH, DELETE for doctor services
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const doctor_id = searchParams.get("doctor_id");
  if (!doctor_id) return NextResponse.json({ error: "Missing doctor_id" }, { status: 400 });

  const { data, error } = await supabase
    .from("doctor_services")
    .select("*")
    .eq("doctor_id", doctor_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { doctor_id, service_name, price = 0, duration_minutes = 30 } = body;

    if (!doctor_id || !service_name) throw new Error("Doctor ID and Service Name required");

    // Fetch doctor account number
    const { data: doctor } = await supabase.from("doctors").select("account_number").eq("id", doctor_id).maybeSingle();
    if (price > 0 && (!doctor || !doctor.account_number)) throw new Error("Please set your account number in profile for paid services");

    const { error } = await supabase.from("doctor_services").insert({ doctor_id, service_name, price, duration_minutes });
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, service_name, price = 0, duration_minutes = 30 } = body;
    if (!id || !service_name) throw new Error("ID and Service Name required");

    const { data: existingService } = await supabase.from("doctor_services").select("doctor_id").eq("id", id).maybeSingle();
    if (!existingService) throw new Error("Service not found");

    const { data: doctor } = await supabase.from("doctors").select("account_number").eq("id", existingService.doctor_id).maybeSingle();
    if (price > 0 && (!doctor || !doctor.account_number)) throw new Error("Please set your account number in profile for paid services");

    const { error } = await supabase.from("doctor_services").update({ service_name, price, duration_minutes }).eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) throw new Error("Missing service ID");

    const { error } = await supabase.from("doctor_services").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
