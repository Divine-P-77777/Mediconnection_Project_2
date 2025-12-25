// app/api/adminAccess/route.js
import { NextResponse } from "next/server";

import { serviceSupabase } from "@/supabase/serviceClient"

export async function POST(req) {
  try {
    const { email, username, password, addedByHealthCenter } = await req.json();

    const { data, error } = await serviceSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "doctor",
        username,
        health_center_id: addedByHealthCenter,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
