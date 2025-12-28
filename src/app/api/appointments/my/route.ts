import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */
interface Appointment {
    id: string;
    center_id: string;
    user_id: string;
    center_name: string;
    date: string;
    time: string;
    purpose: string;
    user_name: string;
    phone: string;
    gender: string;
    dob: string;
    status?: string;
    created_at?: string;
    reports?: string[];
    bills?: string[];
    prescriptions?: string[];
}

/* -------------------- GET: FETCH USER APPOINTMENTS -------------------- */
export async function GET(req: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const user_id: string | null = searchParams.get("user_id");

        if (!user_id) {
            return NextResponse.json(
                { success: false, error: "Missing user_id" },
                { status: 400 }
            );
        }

        const { data: appointmentsData, error } = await serviceSupabase
            .from("appointments")
            .select("*")
            .eq("user_id", user_id)
            .order("date", { ascending: false });

        if (error) {
            throw error;
        }

        const appointments = appointmentsData as Appointment[] | null;

        return NextResponse.json({
            success: true,
            appointments: appointments ?? [],
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Fetch appointments error";
        console.error("Fetch appointments error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
