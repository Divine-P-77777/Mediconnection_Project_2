// /pages/api/add-doctor.js
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, username, password, addedByHealthCenter } = req.body;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: 'doctor',
      username,
      health_center_id: addedByHealthCenter
    }
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ data });
}
