import { NextResponse } from "next/server";
import {serviceSupabase} from "@/supabase/serviceClient"


export async function PATCH(req, { params }) {

  if (!params || !params.id) {
    return NextResponse.json({ error: "Health center ID is required" }, { status: 400 });
  }
  return updateHealthCenter(req, params.id);
}

export async function PUT(req, { params }) {
  if (!params || !params.id) {
    return NextResponse.json({ error: "Health center ID is required" }, { status: 400 });
  }
  return updateHealthCenter(req, params.id);
}

// main update function
async function updateHealthCenter(req, id) {
  try {
    const { approved } = await req.json();

    const { data, error } = await serviceSupabase
      .from("health_centers")
      .update({ approved: !!approved })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    console.error("PATCH/PUT failed:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
