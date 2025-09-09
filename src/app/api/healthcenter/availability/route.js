import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

// GET appointments for a health center
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const health_center_id = searchParams.get("health_center_id");

    if (!health_center_id) {
      return NextResponse.json({ success: false, error: "Missing health_center_id" }, { status: 400 });
    }

    const { data, error } = await serviceSupabase
      .from("appointments")
      .select("*")
      .eq("center_id", health_center_id)
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, appointments: data });
  } catch (err) {
    console.error("Appointment fetch error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Bulk upsert availability for a health center
export async function POST(req) {
  try {
    const body = await req.json();
    const { health_center_id, availability } = body;

    if (!health_center_id || !Array.isArray(availability)) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // For simplicity, delete old availability and insert new
    await serviceSupabase
      .from("health_center_availability")
      .delete()
      .eq("health_center_id", health_center_id);

    const insertData = availability.map(item => ({
      health_center_id,
      day_of_week: item.day_of_week,
      slot_time: item.slots,
      status: item.status || "available",
    }));

    const { data, error } = await serviceSupabase
      .from("health_center_availability")
      .insert(insertData)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, updatedAvailability: data });
  } catch (err) {
    console.error("Availability bulk save error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}