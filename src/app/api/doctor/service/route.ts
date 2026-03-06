import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";
import { getAuthUser } from "@/lib/serverAuth";

/* -------------------- TYPES -------------------- */

interface DoctorService {
  id: string;
  doctor_id: string;
  service_name: string;
  price: number;
  duration_minutes: number;
  created_at?: string;
}

interface CreateServiceBody {
  doctor_id: string;
  service_name: string;
  price?: number;
  duration_minutes?: number;
}

interface UpdateServiceBody {
  id: string;
  service_name: string;
  price?: number;
  duration_minutes?: number;
}

interface DeleteServiceBody {
  id: string;
}

/* -------------------- GET -------------------- */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const doctor_id = searchParams.get("doctor_id");

  if (!doctor_id) {
    return NextResponse.json({ error: "Missing doctor_id" }, { status: 400 });
  }

  const { data, error } = await serviceSupabase
    .from("doctor_services")
    .select("*")
    .eq("doctor_id", doctor_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data: data as DoctorService[] | null });
}

/* -------------------- POST -------------------- */

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    const body: CreateServiceBody = await req.json();
    const { doctor_id, service_name, price = 0, duration_minutes = 30 } = body;

    if (!doctor_id || !service_name) {
      return NextResponse.json({ error: "Doctor ID and Service Name required" }, { status: 400 });
    }

    // Ownership: doctor can only create services for themselves
    if (user.id !== doctor_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check account number for paid services
    if (price > 0) {
      const { data: account } = await serviceSupabase
        .from("account_details_doctors")
        .select("account_number")
        .eq("doctor_id", doctor_id)
        .maybeSingle();

      if (!account?.account_number) {
        return NextResponse.json(
          { error: "Please set your account number before creating paid services" },
          { status: 400 }
        );
      }
    }

    const { error } = await serviceSupabase
      .from("doctor_services")
      .insert({ doctor_id, service_name, price, duration_minutes });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Create failed" }, { status: 400 });
  }
}

/* -------------------- PATCH -------------------- */

export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser();
    const body: UpdateServiceBody = await req.json();
    const { id, service_name, price = 0, duration_minutes = 30 } = body;

    if (!id || !service_name) {
      return NextResponse.json({ error: "ID and Service Name required" }, { status: 400 });
    }

    // Get the service to verify ownership
    const { data: existing } = await serviceSupabase
      .from("doctor_services")
      .select("doctor_id")
      .eq("id", id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    if (existing.doctor_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check account for paid services
    if (price > 0) {
      const { data: account } = await serviceSupabase
        .from("account_details_doctors")
        .select("account_number")
        .eq("doctor_id", user.id)
        .maybeSingle();

      if (!account?.account_number) {
        return NextResponse.json(
          { error: "Please set your account number before updating to paid services" },
          { status: 400 }
        );
      }
    }

    const { error } = await serviceSupabase
      .from("doctor_services")
      .update({ service_name, price, duration_minutes })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Update failed" }, { status: 400 });
  }
}

/* -------------------- DELETE -------------------- */

export async function DELETE(req: Request) {
  try {
    const user = await getAuthUser();
    const { id }: DeleteServiceBody = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing service ID" }, { status: 400 });
    }

    // Verify ownership
    const { data: existing } = await serviceSupabase
      .from("doctor_services")
      .select("doctor_id")
      .eq("id", id)
      .maybeSingle();

    if (!existing || existing.doctor_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await serviceSupabase
      .from("doctor_services")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Delete failed" }, { status: 400 });
  }
}
