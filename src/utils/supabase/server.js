import { createServerClient, CookieOptions } from '@supabase/ssr' 
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.warn("Failed to set cookie. Ensure it's not called in a Server Component.", error)
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            console.warn("Failed to remove cookie. Ensure it's not called in a Server Component.", error)
          }
        },
      },
    }
  )
}
