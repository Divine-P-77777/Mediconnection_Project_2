import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */

interface HealthCenterRow {
    id: string;
}

/* -------------------- GET: FETCH HEALTH CENTER ID -------------------- */

export async function GET(req: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const user_id: string | null = searchParams.get("user_id");

        if (!user_id) {
            return NextResponse.json(
                { health_center_id: null },
                { status: 200 }
            );
        }

        const { data: rowData, error } = await serviceSupabase
            .from("health_centers")
            .select("id")
            .eq("user_id", user_id)
            .single();

        const data = rowData as HealthCenterRow | null;

        if (error) {
            throw error;
        }

        return NextResponse.json(
            { health_center_id: data?.id ?? null },
            { status: 200 }
        );
    } catch (err: unknown) {
        const message =
            err instanceof Error
                ? err.message
                : "Failed to fetch health center id";

        return NextResponse.json(
            { health_center_id: null, error: message },
            { status: 500 }
        );
    }
}
