import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";
import { getAuthUser } from "@/lib/serverAuth";

/* -------------------- TYPES -------------------- */

type AvailabilityStatus = "available" | "unavailable";

interface DoctorAvailability {
  id: string;
  doctor_id: string;
  day_of_week: string;
  slot_time: string[];
  status: AvailabilityStatus;
  created_at?: string;
}

interface AvailabilityInput {
  day_of_week: string;
  slots: string[];
  status?: AvailabilityStatus;
}

interface PostBody {
  doctor_id: string;
  availability: AvailabilityInput[];
}

interface PutBody {
  doctor_id: string;
  day_of_week: string;
  slots: string[];
  status?: AvailabilityStatus;
}

interface DeleteBody {
  doctor_id: string;
  day_of_week?: string;
}

/* -------------------- GET -------------------- */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const doctor_id = searchParams.get("doctor_id");

    if (!doctor_id) {
      return NextResponse.json({ error: "Missing doctor_id" }, { status: 400 });
    }

    const { data, error } = await serviceSupabase
      .from("doctor_availability")
      .select("*")
      .eq("doctor_id", doctor_id);

    if (error) throw error;

    return NextResponse.json({ data: (data as DoctorAvailability[]) ?? [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Fetch failed" }, { status: 400 });
  }
}

/* -------------------- POST -------------------- */

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    const body: PostBody = await req.json();
    const { doctor_id, availability } = body;

    if (!doctor_id || !Array.isArray(availability)) {
      return NextResponse.json({ error: "Missing doctor_id or availability array" }, { status: 400 });
    }
    if (user.id !== doctor_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete existing then insert new
    const { error: delError } = await serviceSupabase
      .from("doctor_availability")
      .delete()
      .eq("doctor_id", doctor_id);
    if (delError) throw delError;

    const insertData = availability.map((a) => ({
      doctor_id,
      day_of_week: a.day_of_week,
      slot_time: a.slots,
      status: a.status || "available",
    }));

    const { error: insertError } = await serviceSupabase
      .from("doctor_availability")
      .insert(insertData);
    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Create failed" }, { status: 400 });
  }
}

/* -------------------- PUT -------------------- */

export async function PUT(req: Request) {
  try {
    const user = await getAuthUser();
    const body: PutBody = await req.json();
    const { doctor_id, day_of_week, slots, status } = body;

    if (!doctor_id || !day_of_week || !slots) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (user.id !== doctor_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await serviceSupabase
      .from("doctor_availability")
      .update({ slot_time: slots, status })
      .eq("doctor_id", doctor_id)
      .eq("day_of_week", day_of_week)
      .select()
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data as DoctorAvailability | null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Update failed" }, { status: 400 });
  }
}

/* -------------------- DELETE -------------------- */

export async function DELETE(req: Request) {
  try {
    const user = await getAuthUser();
    const body: DeleteBody = await req.json();
    const { doctor_id, day_of_week } = body;

    if (!doctor_id) {
      return NextResponse.json({ error: "Missing doctor_id" }, { status: 400 });
    }
    if (user.id !== doctor_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let query = serviceSupabase
      .from("doctor_availability")
      .delete()
      .eq("doctor_id", doctor_id);

    if (day_of_week) {
      query = query.eq("day_of_week", day_of_week);
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Delete failed" }, { status: 400 });
  }
}
