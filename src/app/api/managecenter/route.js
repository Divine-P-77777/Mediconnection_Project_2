import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ GET all centers only if user is super_admin
export async function GET(req) {
  try {
    // Get user from the request (Next.js App Router)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract token
    const token = authHeader.replace("Bearer ", "");

    // Create a client with the user's JWT to check role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // ✅ Get user info
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Get role from profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 403 });
    }

    if (profile.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ Only super_admin gets the list
    const { data, error } = await supabaseAdmin
      .from('health_centers')
      .select('*');

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch health centers' },
      { status: 500 }
    );
  }
}

// DELETE by id (optional, also restrict here the same way)
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: 'Health center ID required' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('health_centers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Health center deleted' });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete health center' },
      { status: 500 }
    );
  }
}
