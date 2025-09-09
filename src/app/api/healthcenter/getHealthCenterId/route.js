import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    if (!user_id) return NextResponse.json({ health_center_id: null });

    const { data, error } = await serviceSupabase
        .from("health_centers")
        .select("id")
        .eq("user_id", user_id)
        .single();

    if (data && data.id) return NextResponse.json({ health_center_id: data.id });
    return NextResponse.json({ health_center_id: null });
}