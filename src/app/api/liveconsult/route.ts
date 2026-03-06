import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */

type ConsultationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | string;

interface CreateLiveConsultBody {
  userId: string;
  doctorId: string;
  fullName: string;
  dob: string;
  phone: string | number;
  gender: "male" | "female" | "other" | string;
  email: string;
  consultationDate: string;
  consultationTime: string;
  speciality: string;
}

interface UpdateLiveConsultBody {
  id: string;
  reports?: string[];
  bills?: string[];
  prescriptions?: string[];
  status?: ConsultationStatus;
  meetUrl?: string;
}

/* -------------------- CREATE LIVE CONSULT -------------------- */

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: CreateLiveConsultBody = await req.json();

    const {
      userId,
      doctorId,
      fullName,
      dob,
      phone,
      gender,
      email,
      consultationDate,
      consultationTime,
      speciality,
    } = body;

    if (
      !userId ||
      !doctorId ||
      !fullName ||
      !dob ||
      !phone ||
      !gender ||
      !email ||
      !consultationDate ||
      !consultationTime ||
      !speciality
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: consult, error } = await serviceSupabase
      .from("liveconsult")
      .insert([
        {
          user_id: userId,
          doctor_id: doctorId,
          full_name: fullName,
          dob,
          phone,
          gender,
          email,
          consultation_date: consultationDate,
          consultation_time: consultationTime,
          speciality,
          status: "pending",
          bills: [],
          reports: [],
          prescriptions: [],
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, data: consult },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create consultation";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/* -------------------- UPDATE LIVE CONSULT -------------------- */

export async function PATCH(req: Request): Promise<NextResponse> {
  try {
    const body: UpdateLiveConsultBody = await req.json();
    const {
      id,
      reports,
      bills,
      prescriptions,
      status,
      meetUrl,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 }
      );
    }

    const updatePayload = {
      ...(reports !== undefined && { reports }),
      ...(bills !== undefined && { bills }),
      ...(prescriptions !== undefined && { prescriptions }),
      ...(status !== undefined && { status }),
      ...(meetUrl !== undefined && { meet_url: meetUrl }),
    };

    const { data: consult, error } = await serviceSupabase
      .from("liveconsult")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, data: consult },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update consultation";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
