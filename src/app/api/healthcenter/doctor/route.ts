import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */

interface DoctorCreateBody {
  name: string;
  email: string;
  password: string;
  specialization: string;
  contact?: string;
  health_center_id: string;
}

interface DoctorForm extends DoctorCreateBody {
  id: string;
}

interface DoctorDeleteBody {
  id: string;
}

/* -------------------- AUTH GUARD -------------------- */

async function requireHealthCenter(req: Request) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Unauthorized");

  return data.user;
}

/* -------------------- GET -------------------- */

export async function GET(req: Request) {
  try {
    const user = await requireHealthCenter(req);

    const { searchParams } = new URL(req.url);
    const health_center_id = searchParams.get("health_center_id");

    if (!health_center_id) {
      return NextResponse.json(
        { error: "Missing health_center_id" },
        { status: 400 }
      );
    }

    /* ownership check */
    const { data: center } = await serviceSupabase
      .from("health_centers")
      .select("id")
      .eq("id", health_center_id)
      .eq("user_id", user.id)
      .single();

    if (!center) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { data, error } = await serviceSupabase
      .from("doctors")
      .select("*")
      .eq("health_center_id", health_center_id);

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}

/* -------------------- POST -------------------- */

export async function POST(req: Request) {
  try {
    const user = await requireHealthCenter(req);
    const body: DoctorCreateBody = await req.json();

    const {
      name,
      email,
      password,
      specialization,
      contact,
      health_center_id,
    } = body;

    if (!name || !email || !password || !specialization) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ownership check */
    const { data: center } = await serviceSupabase
      .from("health_centers")
      .select("id")
      .eq("id", health_center_id)
      .eq("user_id", user.id)
      .single();

    if (!center) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    /* -------- CHECK EXISTING AUTH USER -------- */
    const { data: existingAuth } = await serviceSupabase.auth.admin.listUsers();

    // Filter manually because listUsers email filter is partial match sometimes
    const exactMatch = (existingAuth.users as any[]).find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (exactMatch) {
      // Check if this user is actually linked to a doctor profile
      const { data: existingDoctor } = await serviceSupabase
        .from("doctors")
        .select("id")
        .eq("id", exactMatch.id)
        .single();

      if (existingDoctor) {
        throw new Error("Doctor with this email already registered.");
      }

      console.log(`Cleaning up orphaned auth user: ${exactMatch.id}`);
      // ORPHANED USER -> Delete it so we can remake it cleanly
      await serviceSupabase.auth.admin.deleteUser(exactMatch.id);

      // Wait a bit for propagation to avoid "User exists" race condition
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    /* -------- CREATE AUTH USER -------- */

    const { data: authUser, error: authError } =
      await serviceSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,


        user_metadata: {
          full_name: name,
          role: "doctor",
          approved: false,
        },

        app_metadata: {
          role: "doctor",
        },
      });



    if (authError || !authUser.user) {
      console.error("Auth creation error:", authError);
      throw authError ?? new Error("Auth creation failed");
    }

    /* insert doctor */
    const { error: dbError } = await serviceSupabase
      .from("doctors")
      .insert({
        id: authUser.user.id,
        name,
        email,
        specialization,
        contact,
        health_center_id,
        approved: false,
      });

    if (dbError) {
      console.error("DB insert error, rolling back auth:", dbError);
      /* rollback auth user */
      await serviceSupabase.auth.admin.deleteUser(
        authUser.user.id
      );
      throw dbError;
    }

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Create doctor error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: err.status || 500 }
    );
  }
}

/* -------------------- PUT -------------------- */

export async function PUT(req: Request) {
  try {
    const user = await requireHealthCenter(req);
    const body: DoctorForm = await req.json();
    const { id, name, email, password, specialization, contact, health_center_id } = body;

    if (!id || !health_center_id) {
      return NextResponse.json(
        { error: "Missing doctor ID or health center ID" },
        { status: 400 }
      );
    }

    /* ownership check */
    const { data: center } = await serviceSupabase
      .from("health_centers")
      .select("id")
      .eq("id", health_center_id)
      .eq("user_id", user.id)
      .single();

    if (!center) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    /* Verify doctor belongs to this center */
    const { data: existingDoctor } = await serviceSupabase
      .from("doctors")
      .select("id")
      .eq("id", id)
      .eq("health_center_id", health_center_id)
      .single();

    if (!existingDoctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    /* Update Auth User (Email/Password) */
    const authUpdates: any = {};
    if (email) authUpdates.email = email;
    if (password && password.length >= 6) authUpdates.password = password;

    if (Object.keys(authUpdates).length > 0) {
      const { error: authUpdateError } = await serviceSupabase.auth.admin.updateUserById(
        id.toString(),
        authUpdates
      );
      if (authUpdateError) throw authUpdateError;
    }

    /* Update DB Record */
    const { error: dbError } = await serviceSupabase
      .from("doctors")
      .update({
        name,
        email,
        specialization,
        contact,
      })
      .eq("id", id);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}

/* -------------------- DELETE -------------------- */

export async function DELETE(req: Request) {
  try {
    const user = await requireHealthCenter(req);
    const { id }: DoctorDeleteBody = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing doctor id" },
        { status: 400 }
      );
    }

    /* ownership check */
    const { data: doctor } = await serviceSupabase
      .from("doctors")
      .select("health_center_id")
      .eq("id", id)
      .single();

    const { data: center } = await serviceSupabase
      .from("health_centers")
      .select("id")
      .eq("id", doctor?.health_center_id)
      .eq("user_id", user.id)
      .single();

    if (!center) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await serviceSupabase.auth.admin.deleteUser(id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}
