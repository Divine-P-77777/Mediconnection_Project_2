import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface UpdateHealthCenterBody {
  approved?: boolean;
}

/* -------------------- PATCH -------------------- */

export async function PATCH(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Health center ID is required" },
      { status: 400 }
    );
  }

  return updateHealthCenter(req, id);
}

/* -------------------- PUT -------------------- */

export async function PUT(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Health center ID is required" },
      { status: 400 }
    );
  }

  return updateHealthCenter(req, id);
}

/* -------------------- SHARED UPDATE LOGIC -------------------- */

async function updateHealthCenter(
  req: Request,
  id: string
): Promise<NextResponse> {
  try {
    const body: UpdateHealthCenterBody = await req.json();
    const { approved } = body;

    const { data, error } = await serviceSupabase
      .from("health_centers")
      .update({ approved: Boolean(approved) })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Server error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
