import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const health_center_id = searchParams.get("health_center_id");

    if (!health_center_id) {
      return NextResponse.json([], { status: 200 });
    }

    const { data, error } = await serviceSupabase
      .from("health_center_availability")
      .select("day_of_week, slot_time, status")
      .eq("health_center_id", health_center_id);

    if (error) throw error;

    return NextResponse.json(data || []); // 👈 return plain array
  } catch (err) {
    console.error("Slots fetch error:", err.message);
    return NextResponse.json([], { status: 200 }); // keep frontend safe
  }
}

// POST a new availability slot
export async function POST(req) {
  try {
    const body = await req.json();
    const { health_center_id, day_of_week, slot_time, status } = body;

    if (!health_center_id || !day_of_week || !slot_time?.length) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("health_center_availability")
      .insert([{ health_center_id, day_of_week, slot_time, status: status || "available" }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, slot: data });
  } catch (err) {
    console.error("Slot creation error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH (update availability)
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, day_of_week, slot_time, status } = body;

    if (!id) return NextResponse.json({ success: false, error: "Missing slot id" }, { status: 400 });

    const { data, error } = await supabase
      .from("health_center_availability")
      .update({ day_of_week, slot_time, status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, slot: data });
  } catch (err) {
    console.error("Slot update error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE a slot
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, error: "Missing slot id" }, { status: 400 });

    const { data, error } = await supabase.from("health_center_availability").delete().eq("id", id).select().single();
    if (error) throw error;

    return NextResponse.json({ success: true, deleted: data });
  } catch (err) {
    console.error("Slot deletion error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
