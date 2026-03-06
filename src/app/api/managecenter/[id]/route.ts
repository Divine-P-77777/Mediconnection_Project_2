import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- ADMIN GUARD -------------------- */

async function requireSuperAdmin(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("Missing Authorization header");

  const token = authHeader.replace("Bearer ", "");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new Error("Invalid token");

  if (data.user.app_metadata?.role !== "super_admin") {
    throw new Error("Forbidden");
  }

  return data.user;
}

/* -------------------- PATCH -------------------- */

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; // ✅ REQUIRED
  return updateApproval(req, id);
}

/* -------------------- PUT -------------------- */

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  return updateApproval(req, id);
}

/* -------------------- UPDATE LOGIC -------------------- */

async function updateApproval(req: Request, id: string) {
  try {
    await requireSuperAdmin(req);

    const { approved } = await req.json();
    if (typeof approved !== "boolean") {
      return NextResponse.json(
        { error: "approved must be boolean" },
        { status: 400 }
      );
    }

    const { data, error } = await serviceSupabase
      .from("health_centers")
      .update({ approved })
      .eq("id", id)
      .select("id, approved")
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}
