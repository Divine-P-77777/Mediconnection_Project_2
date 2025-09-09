import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

// GET /api/healthcenter/search?pincode=xxxxxx
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pincode = searchParams.get("pincode");

  if (!pincode) {
    return NextResponse.json({ success: false, error: "Missing pincode" }, { status: 400 });
  }

  // Fetch health centers
  const { data: centers, error: centerError } = await serviceSupabase
    .from("health_centers")
    .select("*")
    .eq("pincode", pincode)
    .eq("approved", true);

  if (centerError) {
    return NextResponse.json({ success: false, error: centerError.message }, { status: 500 });
  }

  // For each center, fetch availability and services
  const centersWithRelations = await Promise.all((centers || []).map(async (center) => {
    // Availability
    const { data: availability } = await serviceSupabase
      .from("health_center_availability")
      .select("*")
      .eq("health_center_id", center.id);

    // Services
    const { data: purposes } = await serviceSupabase
      .from("health_center_services")
      .select("*")
      .eq("health_center_id", center.id)
      .eq("status", "active");

    return {
      ...center,
      availability: availability || [],
      purposes: purposes || [],
    };
  }));

  return NextResponse.json({ success: true, centers: centersWithRelations });
}