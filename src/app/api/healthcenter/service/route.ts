import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/* -------------------- SUPABASE CLIENT -------------------- */
const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* -------------------- TYPES -------------------- */

type ServiceStatus = "active" | "inactive";

interface HealthCenterService {
  id: string;
  health_center_id: string | null;
  service_name: string;
  price: number | null;
  status: ServiceStatus | null;
  created_at: string;
}

interface CreateServiceBody {
  health_center_id: string;
  service_name: string;
  price?: number;
  status?: ServiceStatus;
}

interface UpdateServiceBody {
  id: string;
  service_name?: string;
  price?: number;
  status?: ServiceStatus;
}

/* -------------------- GET: FETCH SERVICES -------------------- */

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const health_center_id: string | null = searchParams.get("health_center_id");

    if (!health_center_id) {
      return NextResponse.json(
        { success: false, error: "Missing health_center_id" },
        { status: 400 }
      );
    }

    const { data: servicesData, error } = await supabase
      .from("health_center_services")
      .select("*")
      .eq("health_center_id", health_center_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const services = servicesData as HealthCenterService[] | null;

    return NextResponse.json({ success: true, services });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Services fetch error";
    console.error("Services fetch error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/* -------------------- POST: CREATE SERVICE -------------------- */

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: CreateServiceBody = await req.json();
    const { health_center_id, service_name, price, status } = body;

    if (!health_center_id || !service_name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: serviceData, error } = await supabase
      .from("health_center_services")
      .insert([
        {
          health_center_id,
          service_name,
          price,
          status: status || "active",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const service = serviceData as HealthCenterService | null;

    return NextResponse.json({ success: true, service });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Service creation error";
    console.error("Service creation error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/* -------------------- PATCH: UPDATE SERVICE -------------------- */

export async function PATCH(req: Request): Promise<NextResponse> {
  try {
    const body: UpdateServiceBody = await req.json();
    const { id, service_name, price, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing service id" },
        { status: 400 }
      );
    }

    const updatePayload: Partial<HealthCenterService> = {};
    if (service_name !== undefined) updatePayload.service_name = service_name;
    if (price !== undefined) updatePayload.price = price;
    if (status !== undefined) updatePayload.status = status;

    const { data: serviceData, error } = await supabase
      .from("health_center_services")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const service = serviceData as HealthCenterService | null;

    return NextResponse.json({ success: true, service });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Service update error";
    console.error("Service update error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/* -------------------- DELETE: REMOVE SERVICE -------------------- */

export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id: string | null = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing service id" },
        { status: 400 }
      );
    }

    const { data: deletedData, error } = await supabase
      .from("health_center_services")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const deleted = deletedData as HealthCenterService | null;

    return NextResponse.json({ success: true, deleted });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Service deletion error";
    console.error("Service deletion error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
