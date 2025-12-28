import { NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

/* -------------------- TYPES -------------------- */

interface DoctorInfo {
  name: string;
  id: string;
  profile?: string | null;
  specialization: string;
}

interface DoctorService {
  id: string;
  doctor_id: string;
  service_name: string;
  price: number;
  doctors: DoctorInfo | null; // Joined column
}

/* -------------------- GET: FETCH DOCTOR SERVICES -------------------- */

export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const service: string | null = searchParams.get("service");
  const search: string | null = searchParams.get("search");

  try {
    let query = supabase
      .from("doctor_services")
      .select(`
        id, 
        doctor_id, 
        service_name, 
        price, 
        doctors (
          name, 
          id, 
          profile,
          specialization
        )
      `);

    if (search) {
      query = query.ilike("service_name", `%${search}%`);
    } else if (service) {
      query = query.eq("service_name", service);
    }

    const { data: servicesData, error } = await query;

    if (error) throw error;

    // Supabase returns 'doctors' as an object (single) or array depending on relation one-to-one/many
    // Usually inner join returns single object if foreign key is unique or we use proper notation
    // Assuming 'doctors' is singular relation here based on original code structure
    const doctors = (servicesData || []) as unknown as DoctorService[];

    return NextResponse.json({ success: true, doctors });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch doctors";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
