import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

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
  doctors: DoctorInfo | null;
}

/* -------------------- GET: FETCH DOCTOR SERVICES -------------------- */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const service = searchParams.get("service");
  const search = searchParams.get("search");

  try {
    let query = serviceSupabase
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

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      success: true,
      doctors: (data || []) as unknown as DoctorService[],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
