import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";
import { SupabaseClient } from "@supabase/supabase-js";


/* -------------------- TYPES -------------------- */

type SlotStatus = "available" | "unavailable" | "booked";

interface HealthCenterSlot {
  id: string;
  health_center_id: string;
  day_of_week: string;
  slot_time: string[];
  status: SlotStatus;
  created_at?: string;
}

interface CreateSlotBody {
  health_center_id: string;
  day_of_week: string;
  slot_time: string[];
  status?: SlotStatus;
}

interface UpdateSlotBody {
  id: string;
  day_of_week?: string;
  slot_time?: string[];
  status?: SlotStatus;
}

/* -------------------- GET: FETCH SLOTS -------------------- */

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const health_center_id: string | null = searchParams.get("health_center_id");

    if (!health_center_id) {
      return NextResponse.json([], { status: 200 });
    }

    const { data: slotsData, error } = await serviceSupabase
      .from("health_center_availability")
      .select("day_of_week, slot_time, status")
      .eq("health_center_id", health_center_id);

    if (error) throw error;

    // We only selected specific fields, so cast to partial or custom shape if needed
    // but casting to unknown first allows flexibility
    const data = slotsData as any[];

    return NextResponse.json(data || []);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Slots fetch error:", message);
    return NextResponse.json([], { status: 200 }); // keep frontend safe
  }
}

/* -------------------- POST: CREATE SLOT -------------------- */

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: CreateSlotBody = await req.json();
    const { health_center_id, day_of_week, slot_time, status } = body;

    if (!health_center_id || !day_of_week || !slot_time?.length) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: slotData, error } = await serviceSupabase
      .from("health_center_availability")
      .insert([
        {
          health_center_id,
          day_of_week,
          slot_time,
          status: status || "available",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const slot = slotData as HealthCenterSlot | null;

    return NextResponse.json({ success: true, slot });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Slot creation error";
    console.error("Slot creation error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/* -------------------- PATCH: UPDATE SLOT -------------------- */

export async function PATCH(req: Request): Promise<NextResponse> {
  try {
    const body: UpdateSlotBody = await req.json();
    const { id, day_of_week, slot_time, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing slot id" },
        { status: 400 }
      );
    }

    const updatePayload: Partial<HealthCenterSlot> = {};
    if (day_of_week !== undefined) updatePayload.day_of_week = day_of_week;
    if (slot_time !== undefined) updatePayload.slot_time = slot_time;
    if (status !== undefined) updatePayload.status = status;

    const { data: slotData, error } = await serviceSupabase
      .from("health_center_availability")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const slot = slotData as HealthCenterSlot | null;

    return NextResponse.json({ success: true, slot });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Slot update error";
    console.error("Slot update error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/* -------------------- DELETE: REMOVE SLOT -------------------- */

export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id: string | null = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing slot id" },
        { status: 400 }
      );
    }

    const { data: deletedData, error } = await serviceSupabase
      .from("health_center_availability")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const deleted = deletedData as HealthCenterSlot | null;

    return NextResponse.json({ success: true, deleted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Slot deletion error";
    console.error("Slot deletion error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
