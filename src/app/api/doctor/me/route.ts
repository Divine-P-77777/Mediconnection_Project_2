import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";
import { getAuthUser } from "@/lib/serverAuth";

/* -------------------- TYPES -------------------- */

interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  specialization: string;
  contact: string;
  profile?: string | null;
  approved?: boolean;
  health_center_id?: string | null;
  created_at?: string;
}

interface UpdateProfileBody {
  userId: string;
  name?: string;
  specialization?: string;
  contact?: string;
  profile?: string;
}

/* -------------------- GET: FETCH PROFILE -------------------- */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const { data, error } = await serviceSupabase
      .from("doctors")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ data: data as DoctorProfile | null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Fetch profile failed" }, { status: 500 });
  }
}

/* -------------------- PATCH: UPDATE PROFILE -------------------- */

export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser();
    const body: UpdateProfileBody = await req.json();
    const { userId, name, specialization, contact, profile } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Ensure user can only update their own profile
    if (user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updates: Partial<DoctorProfile> = {};
    if (name) updates.name = name;
    if (specialization) updates.specialization = specialization;
    if (contact) updates.contact = contact;
    if (profile) updates.profile = profile;

    const { data, error } = await serviceSupabase
      .from("doctors")
      .update(updates)
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ data: data as DoctorProfile | null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Update profile failed" }, { status: 500 });
  }
}
