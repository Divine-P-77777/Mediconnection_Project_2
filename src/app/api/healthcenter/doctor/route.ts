import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";
import { supabase } from "@/supabase/client";

/* -------------------- TYPES -------------------- */

interface DoctorCreateBody {
  name: string;
  email: string;
  password: string;
  specialization: string;
  contact?: string;
  health_center_id: string;
}

interface DoctorDeleteBody {
  id: string;
}

/* -------------------- GET: FETCH DOCTORS -------------------- */

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const health_center_id: string | null =
      searchParams.get("health_center_id");

    if (!health_center_id) {
      return NextResponse.json(
        { error: "Missing health_center_id" },
        { status: 400 }
      );
    }

    const { data, error } = await serviceSupabase
      .from("doctors")
      .select("*")
      .eq("health_center_id", health_center_id);

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch doctors";

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

/* -------------------- POST: CREATE DOCTOR -------------------- */

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: DoctorCreateBody = await req.json();
    const {
      name,
      email,
      password,
      specialization,
      contact,
      health_center_id,
    } = body;

    if (!email || !password || !name || !specialization || !health_center_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* -------- CHECK EXISTING DOCTOR -------- */
    const { data: existingDoctor, error: checkError } =
      await serviceSupabase
        .from("doctors")
        .select("id, health_center_id")
        .eq("email", email)
        .maybeSingle();

    if (checkError) throw checkError;

    if (existingDoctor) {
      if (existingDoctor.health_center_id === health_center_id) {
        throw new Error(
          "Doctor is already registered in this health center"
        );
      } else {
        throw new Error(
          "Doctor is already registered in another health center"
        );
      }
    }

    /* -------- CREATE AUTH USER -------- */
    const { data: signupData, error: signupError } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: "doctor",
          },
        },
      });

    if (signupError) throw signupError;

    const doctorId: string | undefined = signupData.user?.id;
    if (!doctorId) {
      throw new Error("Failed to create doctor user");
    }

    /* -------- INSERT DOCTOR RECORD -------- */
    const { error: dbError } = await serviceSupabase
      .from("doctors")
      .insert({
        id: doctorId,
        name,
        email,
        specialization,
        contact,
        health_center_id,
        approved: false,
      });

    if (dbError) throw dbError;

    return NextResponse.json(
      { success: true, id: doctorId },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Doctor creation failed";

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

/* -------------------- DELETE: REMOVE DOCTOR -------------------- */

export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const body: DoctorDeleteBody = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing doctor id" },
        { status: 400 }
      );
    }

    const { error } = await serviceSupabase
      .from("doctors")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete doctor";

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
