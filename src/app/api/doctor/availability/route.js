import { NextResponse } from "next/server";
import {supabase} from "@/supabase/client"


// ------------------------
// GET: fetch availability for a doctor
// ------------------------
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const doctor_id = searchParams.get("doctor_id");

    if (!doctor_id) {
      throw new Error("Missing doctor_id");
    }

    const { data, error } = await supabase
      .from("doctor_availability")
      .select("*")
      .eq("doctor_id", doctor_id);

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// ------------------------
// POST: create or overwrite availability for doctor
// ------------------------
export async function POST(req) {
  try {
    const body = await req.json();
    const { doctor_id, availability } = body;

    if (!doctor_id || !availability) {
      throw new Error("Missing doctor_id or availability array");
    }

    // Optional: delete existing availability first
    const { error: delError } = await supabase
      .from("doctor_availability")
      .delete()
      .eq("doctor_id", doctor_id);
    if (delError) throw delError;

    // Insert new availability
    const { error: insertError } = await supabase
      .from("doctor_availability")
      .insert(
        availability.map((a) => ({
          doctor_id,
          day_of_week: a.day_of_week,
          slot_time: a.slots,
          status: a.status || "available",
        }))
      );

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// ------------------------
// PUT: update specific day availability
// ------------------------
export async function PUT(req) {
  try {
    const body = await req.json();
    const { doctor_id, day_of_week, slots, status } = body;

    if (!doctor_id || !day_of_week || !slots) {
      throw new Error("Missing required fields");
    }

    const { data, error } = await supabase
      .from("doctor_availability")
      .update({ slot_time: slots, status })
      .eq("doctor_id", doctor_id)
      .eq("day_of_week", day_of_week)
      .select()
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// ------------------------
// DELETE: remove availability for a doctor or specific day
// ------------------------
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { doctor_id, day_of_week } = body;

    if (!doctor_id) throw new Error("Missing doctor_id");

    let query = supabase.from("doctor_availability").delete().eq("doctor_id", doctor_id);

    if (day_of_week) query = query.eq("day_of_week", day_of_week);

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
