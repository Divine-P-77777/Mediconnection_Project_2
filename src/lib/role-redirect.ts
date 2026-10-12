import type { User } from "@supabase/supabase-js";

export type UserRole = "super_admin" | "doctor" | "health_center" | "user" | "guest";

export const ROLE_DASHBOARDS: Record<Exclude<UserRole, "guest">, string> = {
  super_admin: "/admin",
  doctor: "/doctor",
  health_center: "/healthcenter",
  user: "/user",
};

export const ROLE_LOGIN_PATHS: Record<Exclude<UserRole, "guest">, string> = {
  super_admin: "/auth/admin",
  doctor: "/auth/doctor",
  health_center: "/auth/healthcenter",
  user: "/auth",
};

/**
 * Resolves user role from Supabase user object.
 * Checks app_metadata first (JWT claims), then user_metadata.
 */
export function getRoleFromUser(user: User | null | undefined): UserRole {
  if (!user) return "guest";

  const appRole = user.app_metadata?.role as UserRole | undefined;
  if (appRole && ["super_admin", "doctor", "health_center", "user"].includes(appRole)) {
    return appRole;
  }

  const metaRole = user.user_metadata?.role as UserRole | undefined;
  if (metaRole && ["super_admin", "doctor", "health_center", "user"].includes(metaRole)) {
    return metaRole;
  }

  return "user"; // default fallback for standard authenticated users
}

/**
 * Returns destination dashboard for a given role and approval status.
 */
export function getRoleDashboardUrl(
  role: UserRole,
  isApproved: boolean = true
): string {
  if (role === "guest") return "/user";

  // Doctors and health centers must be approved to access full dashboard
  if ((role === "doctor" || role === "health_center") && !isApproved) {
    return "/pending-approval";
  }

  return ROLE_DASHBOARDS[role] ?? "/user";
}

/**
 * Validates whether a given role is allowed to access the specified pathname.
 */
export function isAuthorizedForPath(
  pathname: string,
  role: UserRole
): boolean {
  if (role === "super_admin") {
    return true; // Super admin can access everything
  }

  if (pathname.startsWith("/admin")) {
    return false;
  }

  if (pathname.startsWith("/doctor")) {
    return role === "doctor";
  }

  if (pathname.startsWith("/healthcenter")) {
    return role === "health_center";
  }

  return true;
}
