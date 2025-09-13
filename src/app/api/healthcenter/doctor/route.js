import { NextResponse } from "next/server";
import {serviceSupabase} from "@/supabase/serviceClient"
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const health_center_id = searchParams.get("health_center_id");

    if (!health_center_id) {
      throw new Error("Missing health_center_id");
    }

    const { data, error } = await serviceSupabase
      .from("doctors")
      .select("*")
      .eq("health_center_id", health_center_id);

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// ✅ POST: signup doctor + insert into doctors table
export async function POST(req) {
  try {
    console.log("POST request received");
    const body = await req.json();
    const { name, email, password, specialization, contact, health_center_id } = body;

    if (!email || !password || !name || !specialization || !health_center_id) {
      throw new Error("Missing required fields");
    }

    // 1. Check if doctor already exists
    const { data: existingDoctor, error: checkError } = await supabase
      .from("doctors")
      .select("id, health_center_id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingDoctor) {
      if (existingDoctor.health_center_id === health_center_id) {
        throw new Error("Doctor is already registered in this health center");
      } else {
        throw new Error("Doctor is already registered in another health center");
      }
    }

    // 2. Create auth user (with anon key → signUp)
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: "doctor" }, // metadata
      },
    });
    if (signupError) throw signupError;

    const doctorId = signupData?.user?.id;
    if (!doctorId) throw new Error("Failed to create doctor user");

    // 3. Insert into doctors table
    const { error: dbError } = await supabase
      .from("doctors")
      .insert({
        id: doctorId,
        name,
        email,
        specialization,
        contact,
        health_center_id,
        approved: false, // must be approved manually
      });

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, id: doctorId });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// ✅ DELETE: remove doctor (only from doctors table, not auth)
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) throw new Error("Missing doctor id");

    const { error: dbError } = await supabase
      .from("doctors")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}


