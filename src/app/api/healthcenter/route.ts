import { NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

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

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: HealthCenterRegisterBody = await req.json();

    const {
      email,
      password,
      username,
      name,
      hcrn_hfc,
      address,
      contact,
      pincode,
    } = body;

    // Validate input
    if (
      !email ||
      !password ||
      !username ||
      !name ||
      !hcrn_hfc ||
      !address ||
      !contact ||
      !pincode
    ) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    /* -------- STEP 1: SIGN UP USER -------- */
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "health_center",
          username,
          full_name: name,
          hcrn_hfc,
          address,
          contact,
          pincode,
          approved: false,
        },
      },
    });

    if (error) {
      throw error;
    }

    const userId: string | undefined = data.user?.id;
    if (!userId) {
      throw new Error("User creation failed");
    }

    /* -------- STEP 2: INSERT HEALTH CENTER -------- */
    const { error: hcError } = await supabase
      .from("health_centers")
      .insert([
        {
          user_id: userId,
          hcrn_hfc,
          name,
          address,
          phone: contact,
          pincode,
          approved: false,
        },
      ]);

    if (hcError) {
      throw hcError;
    }

    return NextResponse.json(
      {
        message:
          "Health Center registered. Waiting for admin approval.",
        user: {
          id: userId,
          email,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Server error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
