import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */

interface HealthCenterRegisterBody {
  email: string;
  password: string;
  username: string;
  name: string;
  hcrn_hfc: string;
  address: string;
  contact: string;
  pincode: string | number;
}

/* -------------------- POST: REGISTER HEALTH CENTER -------------------- */

export async function POST(req: Request) {
  try {
    const body: HealthCenterRegisterBody = await req.json();

    const {
      email, password, username, name,
      hcrn_hfc, address, contact, pincode,
    } = body;

    if (!email || !password || !username || !name || !hcrn_hfc || !address || !contact || !pincode) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    /* -------- 1. Create Auth User (Service Role) -------- */
    const { data, error } = await serviceSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username, full_name: name },
      app_metadata: { role: "health_center" },
    });

    if (error) throw error;

    const userId = data.user.id;

    /* -------- 2. Insert Profile -------- */
    const { error: profileError } = await serviceSupabase
      .from("profiles")
      .upsert({
        id: userId,
        role: "health_center",
        username,
        health_center_name: name,
        hcrn_hfc,
        address,
        contact_number: contact,
        pincode,
      }, { onConflict: "id" });

    if (profileError) {
      console.error("Profile insert error:", profileError);
      // Don't rollback — profile trigger might have already created it
    }

    /* -------- 3. Insert Health Center -------- */
    const { error: hcError } = await serviceSupabase
      .from("health_centers")
      .insert({
        user_id: userId,
        hcrn_hfc,
        name,
        address,
        phone: contact,
        pincode,
        approved: false,
      });

    if (hcError) {
      console.error("Health center insert error:", hcError);
      // Rollback auth user if HC insert fails
      await serviceSupabase.auth.admin.deleteUser(userId);
      throw hcError;
    }

    return NextResponse.json(
      { message: "Health Center registered. Waiting for admin approval.", user: { id: userId, email } },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("HC Registration error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
