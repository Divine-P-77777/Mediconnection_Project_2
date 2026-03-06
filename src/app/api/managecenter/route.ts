import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";
import { requireSuperAdmin } from "@/lib/serverAuth";

/* -------------------- GET: FETCH ALL CENTERS -------------------- */

export async function GET() {
  try {
    await requireSuperAdmin();

    const { data, error } = await serviceSupabase
      .from("health_centers")
      .select("*");

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    const status = err.message === "Forbidden" || err.message === "Unauthorized" ? 403 : 500;
    return NextResponse.json({ error: err.message || "Failed to fetch health centers" }, { status });
  }
}

/* -------------------- DELETE: REMOVE CENTER -------------------- */

export async function DELETE(req: Request) {
  try {
    await requireSuperAdmin();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Health center ID required" }, { status: 400 });
    }

    const { error } = await serviceSupabase
      .from("health_centers")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Health center deleted" }, { status: 200 });
  } catch (err: any) {
    const status = err.message === "Forbidden" || err.message === "Unauthorized" ? 403 : 500;
    return NextResponse.json({ error: err.message || "Failed to delete health center" }, { status });
  }
}
