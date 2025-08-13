'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.slice(1));
      const type = params.get('type');
      const access_token = params.get('access_token');

      if (!access_token) {
        router.push('/auth?error=Invalid or expired token');
        return;
      }

      if (type === 'recovery') {
        router.push('/auth/reset-password');
        return;
      }

      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.push('/auth?error=Session not found');
        return;
      }

      const user = data.session.user;

      // Fetch user details from your own users table
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userError || !userRecord) {
        // Insert a default user if not found (Google login first time)
        const { error: insertError } = await supabase.from('users').insert({
          id: user.id,
          email: user.email,
          role: 'client', // default role
          username: user.user_metadata?.username || user.email?.split('@')[0], // fallback username
        });

        if (insertError) {
          router.push('/auth?error=Could not initialize user');
          return;
        }

        router.push('/client');
        return;
      }

      // Redirect based on existing role
      const role = userRecord.role;

      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'doctor') {
        router.push('/doctor');
      } else {
        router.push('/super_admin');
      }
    };

    handleAuthRedirect();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="mt-2 text-sm text-muted-foreground">Finalizing login...</p>
      </div>
    </div>
  );
}
