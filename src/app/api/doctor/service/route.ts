import { NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

/* -------------------- TYPES -------------------- */
interface DoctorService {
  id: string;
  doctor_id: string;
  service_name: string;
  price: number;
  duration_minutes: number;
  created_at?: string;
}

interface AccountDetails {
  account_number: string;
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
export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const doctor_id: string | null = searchParams.get("doctor_id");

  if (!doctor_id) {
    return NextResponse.json(
      { error: "Missing doctor_id" },
      { status: 400 }
    );
  }

  const { data: servicesData, error } = await supabase
    .from("doctor_services")
    .select("*")
    .eq("doctor_id", doctor_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const data = servicesData as DoctorService[] | null;

  return NextResponse.json({ data });
}

/* -------------------- POST -------------------- */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: CreateServiceBody = await req.json();
    const { doctor_id, service_name, price = 0, duration_minutes = 30 } = body;

    if (!doctor_id || !service_name) {
      return NextResponse.json(
        { error: "Doctor ID and Service Name required" },
        { status: 400 }
      );
    }

    // ✅ Fetch account number from account_details_doctors
    const { data: accountData } = await supabase
      .from("account_details_doctors")
      .select("account_number")
      .eq("doctor_id", doctor_id)
      .maybeSingle();

    const accountDetails = accountData as AccountDetails | null;

    if (price > 0 && (!accountDetails || !accountDetails.account_number)) {
      return NextResponse.json(
        {
          error:
            "Please set your account number in your profile (Account Details) before creating paid services",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("doctor_services")
      .insert({
        doctor_id,
        service_name,
        price,
        duration_minutes,
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/* -------------------- PATCH -------------------- */
export async function PATCH(req: Request): Promise<NextResponse> {
  try {
    const body: UpdateServiceBody = await req.json();
    const { id, service_name, price = 0, duration_minutes = 30 } = body;

    if (!id || !service_name) {
      return NextResponse.json(
        { error: "ID and Service Name required" },
        { status: 400 }
      );
    }

    // Get doctor_id for this service
    const { data: serviceData } = await supabase
      .from("doctor_services")
      .select("doctor_id")
      .eq("id", id)
      .maybeSingle();

    const existingService = serviceData as { doctor_id: string } | null;

    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // ✅ Check account number in account_details_doctors
    const { data: accountData } = await supabase
      .from("account_details_doctors")
      .select("account_number")
      .eq("doctor_id", existingService.doctor_id)
      .maybeSingle();

    const accountDetails = accountData as AccountDetails | null;

    if (price > 0 && (!accountDetails || !accountDetails.account_number)) {
      return NextResponse.json(
        {
          error:
            "Please set your account number in your profile (Account Details) before updating paid services",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("doctor_services")
      .update({ service_name, price, duration_minutes })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/* -------------------- DELETE -------------------- */
export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const body: DeleteServiceBody = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing service ID" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("doctor_services")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
