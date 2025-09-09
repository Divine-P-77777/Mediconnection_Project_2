import { NextResponse } from 'next/server';
import {supabase} from "@/supabase/client";

export async function POST(req) {
  try {
    const {
      email,
      password,
      username,
      name,
      hcrn_hfc,
      address,
      contact,
      pincode,
    } = await req.json();

    // Validate input (all required)
    if (!email || !password || !username || !name || !hcrn_hfc || !address || !contact || !pincode) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    // 1️⃣ Sign up user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'health_center',
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
    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error('User creation failed');

    // 2️⃣ Insert into health_centers table
    const { error: hcError } = await supabase
      .from('health_centers')
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

    if (hcError) throw hcError;

    return NextResponse.json({
      message: 'Health Center registered. Waiting for admin approval.',
      user: { id: userId, email },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
