import { supabase } from "@/supabase/client";
import { NextResponse } from "next/server";

/* -------------------- TYPES -------------------- */
interface DoctorProfile {
  id: string;
  name: string;
  email: string; // usually present
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
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const userId: string | null = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    const { data: profileData, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;

    const data = profileData as DoctorProfile | null;

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Fetch profile failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* -------------------- PATCH: UPDATE PROFILE -------------------- */
export async function PATCH(req: Request): Promise<NextResponse> {
  try {
    const body: UpdateProfileBody = await req.json();
    const { userId, name, specialization, contact, profile } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    const updates: Partial<DoctorProfile> = {};
    if (name) updates.name = name;
    if (specialization) updates.specialization = specialization;
    if (contact) updates.contact = contact;
    if (profile) updates.profile = profile;

    const { data: updatedData, error } = await supabase
      .from("doctors")
      .update(updates)
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error) throw error;

    const data = updatedData as DoctorProfile | null;

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update profile failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
