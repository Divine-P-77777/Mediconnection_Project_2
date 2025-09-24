import { supabase } from "@/supabase/client";
import { NextResponse } from "next/server";

// GET Doctor profile
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



export async function PATCH(req) {
  try {
    const body = await req.json();
    // Removed account_number
    const { userId, name, specialization, contact, profile } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Removed account_number
    const updates = { name, specialization, contact, profile };

    const { data, error } = await supabase
      .from("doctors")
      .update(updates)
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

