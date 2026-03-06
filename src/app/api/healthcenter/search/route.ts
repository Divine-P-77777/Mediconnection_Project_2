import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES (MATCH DB SCHEMA) -------------------- */

interface HealthCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
  pincode: string | number;
  approved: boolean;
  created_at: string;
  [key: string]: unknown; // allow extra columns
}

interface HealthCenterAvailability {
  id: string;
  health_center_id: string;
  day_of_week: string;
  slot_time: string[]; // stored as array
  status: string;
}

interface HealthCenterService {
  id: string;
  health_center_id: string;
  service_name: string;
  price: number | null;
  status: "active" | "inactive";
  created_at: string;
}

/* -------------------- GET: SEARCH HEALTH CENTERS -------------------- */

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const pincode: string | null = searchParams.get("pincode");

    if (!pincode) {
      return NextResponse.json(
        { success: false, error: "Missing pincode" },
        { status: 400 }
      );
    }

    /* -------- FETCH APPROVED HEALTH CENTERS -------- */
    const { data: centersData, error: centerError } =
      await serviceSupabase
        .from("health_centers")
        .select("*")
        .eq("pincode", pincode)
        .eq("approved", true);

    const centers = centersData as HealthCenter[] | null;

    if (centerError) {
      throw centerError;
    }

    const centersWithRelations = await Promise.all(
      (centers ?? []).map(async (center) => {
        const { data: availabilityData } = await serviceSupabase
          .from("health_center_availability")
          .select("*")
          .eq("health_center_id", center.id);

        const availability = availabilityData as HealthCenterAvailability[] | null;

        const { data: purposesData } = await serviceSupabase
          .from("health_center_services")
          .select("*")
          .eq("health_center_id", center.id)
          .eq("status", "active");

        const purposes = purposesData as HealthCenterService[] | null;

        return {
          ...center,
          availability: availability ?? [],
          purposes: purposes ?? [],
        };
      })
    );

    return NextResponse.json(
      { success: true, centers: centersWithRelations },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to search health centers";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
