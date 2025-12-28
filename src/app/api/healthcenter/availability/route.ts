import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */

interface AvailabilitySlot {
  day_of_week: string;        // e.g. "Monday"
  slots: string[];            // e.g. ["10:00", "10:30"]
  status?: "available" | "unavailable";
}

interface AvailabilityRequestBody {
  health_center_id: string;
  availability: AvailabilitySlot[];
}

/* -------------------- GET: HEALTH CENTER APPOINTMENTS -------------------- */

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const health_center_id: string | null =
      searchParams.get("health_center_id");

    if (!health_center_id) {
      return NextResponse.json(
        { success: false, error: "Missing health_center_id" },
        { status: 400 }
      );
    }

    const { data, error } = await serviceSupabase
      .from("appointments")
      .select("*")
      .eq("center_id", health_center_id)
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { success: true, appointments: data },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to fetch appointments";

    console.error("Appointment fetch error:", message);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/* -------------------- POST: BULK UPSERT AVAILABILITY -------------------- */

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: AvailabilityRequestBody = await req.json();
    const { health_center_id, availability } = body;

    if (!health_center_id || !Array.isArray(availability)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Delete old availability
    await serviceSupabase
      .from("health_center_availability")
      .delete()
      .eq("health_center_id", health_center_id);

    const insertData = availability.map((item) => ({
      health_center_id,
      day_of_week: item.day_of_week,
      slot_time: item.slots,
      status: item.status ?? "available",
    }));

    const { data, error } = await serviceSupabase
      .from("health_center_availability")
      .insert(insertData)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { success: true, updatedAvailability: data },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to save availability";

    console.error("Availability bulk save error:", message);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
