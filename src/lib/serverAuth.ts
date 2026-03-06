import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { serviceSupabase } from "@/supabase/serviceClient";
import type { User } from "@supabase/supabase-js";

type Role = "super_admin" | "doctor" | "health_center" | "user";

/**
 * Creates a cookie-based Supabase server client and returns the
 * authenticated user. Throws if unauthenticated.
 */
export async function getAuthUser(): Promise<User> {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name) => cookieStore.get(name)?.value,
                set: (name, value, options) => {
                    try { cookieStore.set({ name, value, ...options }); } catch { }
                },
                remove: (name, options) => {
                    try { cookieStore.set({ name, value: "", ...options }); } catch { }
                },
            },
        }
    );

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw new Error("Unauthorized");
    return data.user;
}

/**
 * Returns the authenticated user only if their `app_metadata.role`
 * matches the required role. Throws otherwise.
 */
export async function requireRole(role: Role): Promise<User> {
    const user = await getAuthUser();

    // Trust app_metadata first, then fall back to profile table
    if (user.app_metadata?.role === role) return user;

    // Fallback: check the profiles table (source of truth for manually set roles)
    const { data: profile } = await serviceSupabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role === role) return user;

    throw new Error("Forbidden");
}

/** Shorthand — ensures caller is a super_admin */
export async function requireSuperAdmin(): Promise<User> {
    return requireRole("super_admin");
}

/** Shorthand — ensures caller is a health_center */
export async function requireHealthCenter(): Promise<User> {
    return requireRole("health_center");
}

/** Shorthand — ensures caller is a doctor */
export async function requireDoctor(): Promise<User> {
    return requireRole("doctor");
}
