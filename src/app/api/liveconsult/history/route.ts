import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */

interface DoctorInfo {
  name: string;
}

interface LiveConsultHistory {
  id: string;
  full_name: string;
  dob: string;
  phone: string | number;
  gender: string;
  email: string;
  consultation_date: string;
  consultation_time: string;
  speciality: string;
  status: string;
  created_at: string;
  meet_url?: string;
  prescriptions: string[];
  reports: string[];
  bills: string[];
  doctor_id: string;
  doctors?: DoctorInfo | null;
}

/* -------------------- GET: USER CONSULT HISTORY -------------------- */

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);

    const page: number = Math.max(
      1,
      Number(searchParams.get("page")) || 1
    );
    const q: string = searchParams.get("q") ?? "";
    const pageSize = 5;

    const userId: string | null = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let query = serviceSupabase
      .from("liveconsult")
      .select(
        `
        id,
        full_name,
        dob,
        phone,
        gender,
        email,
        consultation_date,
        consultation_time,
        speciality,
        status,
        created_at,
        meet_url,
        prescriptions,
        reports,
        bills,
        doctor_id,
        doctors ( name )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(
        (page - 1) * pageSize,
        page * pageSize - 1
      );

    if (q) {
      query = query.ilike("full_name", `%${q}%`);
    }

    const { data: historyData, error } = await query;

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const history = (historyData ?? []) as unknown as LiveConsultHistory[];

    return NextResponse.json(history, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal Server Error";

    console.error("Route error:", message);

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
