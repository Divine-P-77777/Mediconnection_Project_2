import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/* -------------------- SUPABASE CLIENT -------------------- */
// Using local creation to match original logic, but adding strict type checks
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables for Meet route");
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

/* -------------------- GET: GENERATE MEET URL -------------------- */
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const appointmentId: string | null = searchParams.get("appointmentId");

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, error: "Missing appointmentId" },
        { status: 400 }
      );
    }

    // Unique meet url
    const roomID = `consult_${appointmentId}_${Date.now()}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const meetUrl = `${appUrl}/consult?roomID=${roomID}`;

    // Update in supabase
    const { error } = await supabase
      .from("liveconsult")
      .update({ meet_url: meetUrl })
      .eq("id", appointmentId);

    if (error) throw error;

    return NextResponse.json({ success: true, meetUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Meet API error";
    console.error("Meet API error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}