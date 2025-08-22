import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { approved } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Health center ID is required" }, { status: 400 });
    }

    // ✅ Just update the health_centers table
    const { data, error } = await supabaseAdmin
      .from("health_centers")
      .update({ approved: !!approved })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    console.error("PATCH failed:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
