import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET all centers
export async function GET() {
  try {
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

// DELETE by id
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
