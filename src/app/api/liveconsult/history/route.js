import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient"; 

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const q = searchParams.get("q") || "";
    const pageSize = 5;

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = serviceSupabase
      .from("liveconsult")
      .select(
        `id,
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
         doctors (name)`
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (q) query = query.ilike("full_name", `%${q}%`);

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
