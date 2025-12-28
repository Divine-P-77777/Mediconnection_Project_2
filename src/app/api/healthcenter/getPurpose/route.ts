import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES (MATCH DB SCHEMA) -------------------- */

type ServiceStatus = "active" | "inactive";

interface HealthCenterService {
  id: string;
  health_center_id: string | null;
  service_name: string;
  price: number | null;
  status: ServiceStatus | null;
  created_at: string | null;
}

/* -------------------- GET: HEALTH CENTER PURPOSES -------------------- */

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const center_id: string | null = searchParams.get("center_id");

    if (!center_id) {
      return NextResponse.json(
        { success: false, error: "Missing center_id" },
        { status: 400 }
      );
    }

    const { data: servicesData, error } = await serviceSupabase
      .from("health_center_services")
      .select("*")
      .eq("health_center_id", center_id)
      .eq("status", "active");

    const data = servicesData as HealthCenterService[] | null;

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { success: true, purposes: data },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to fetch health center purposes";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
