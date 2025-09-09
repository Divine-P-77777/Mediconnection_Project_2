import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET all services for a health center
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const health_center_id = searchParams.get("health_center_id");

    if (!health_center_id) {
      return NextResponse.json({ success: false, error: "Missing health_center_id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("health_center_services")
      .select("*")
      .eq("health_center_id", health_center_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, services: data });
  } catch (err) {
    console.error("Services fetch error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST a new service
export async function POST(req) {
  try {
    const body = await req.json();
    const { health_center_id, service_name, price, status } = body;

    if (!health_center_id || !service_name) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("health_center_services")
      .insert([{ health_center_id, service_name, price, status: status || "active" }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, service: data });
  } catch (err) {
    console.error("Service creation error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH (update a service)
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, service_name, price, status } = body;

    if (!id) return NextResponse.json({ success: false, error: "Missing service id" }, { status: 400 });

    const { data, error } = await supabase
      .from("health_center_services")
      .update({ service_name, price, status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, service: data });
  } catch (err) {
    console.error("Service update error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE a service
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, error: "Missing service id" }, { status: 400 });

    const { data, error } = await supabase.from("health_center_services").delete().eq("id", id).select().single();
    if (error) throw error;

    return NextResponse.json({ success: true, deleted: data });
  } catch (err) {
    console.error("Service deletion error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
