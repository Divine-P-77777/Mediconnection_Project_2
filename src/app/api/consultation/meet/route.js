import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");

    if (!appointmentId) {
      return NextResponse.json({ success: false, error: "Missing appointmentId" }, { status: 400 });
    }

    // unique meet url
    const roomID = `consult_${appointmentId}_${Date.now()}`;
    const meetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/consult?roomID=${roomID}`;

    // update in supabase
    const { error } = await supabase
      .from("liveconsult")
      .update({ meet_url: meetUrl })
      .eq("id", appointmentId);

    if (error) throw error;

    return NextResponse.json({ success: true, meetUrl });
  } catch (err) {
    console.error("Meet API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
