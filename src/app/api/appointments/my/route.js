import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get("user_id");

        if (!user_id) {
            return NextResponse.json(
                { success: false, error: "Missing user_id" },
                { status: 400 }
            );
        }

        const { data: appointments, error } = await serviceSupabase
            .from("appointments")
            .select("*")
            .eq("user_id", user_id)
            .order("date", { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            appointments,
        });
    } catch (error) {
        console.error("Fetch appointments error:", error.message);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
