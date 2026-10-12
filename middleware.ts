import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  getRoleFromUser,
  getRoleDashboardUrl,
  isAuthorizedForPath,
} from "./src/lib/role-redirect";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const pathname = req.nextUrl.pathname;

  /* ---------------- 1. Handle Subdomains (if any) ---------------- */
  const host = req.headers.get("host") || "";
  const currentHost = host.replace(/:\d+$/, "");
  const subdomain = currentHost.split(".")[0];

  if (subdomain === "admin" && !pathname.startsWith("/admin")) {
    return NextResponse.rewrite(new URL(`/admin${pathname}`, req.url));
  }
  if (subdomain === "doctors" && !pathname.startsWith("/doctor")) {
    return NextResponse.rewrite(new URL(`/doctor${pathname}`, req.url));
  }
  if (subdomain === "healthcenter" && !pathname.startsWith("/healthcenter")) {
    return NextResponse.rewrite(new URL(`/healthcenter${pathname}`, req.url));
  }

  /* ---------------- 2. Supabase Session Check ---------------- */
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = getRoleFromUser(user);
  const isAuthenticated = Boolean(user);

  /* ---------------- 3. Auth Page Redirection ---------------- */
  // If user is already authenticated and visits any login/signup portal, redirect to their role dashboard
  const authRoutes = ["/auth", "/auth/doctor", "/auth/healthcenter", "/auth/admin"];
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}?`)
  );

  if (isAuthenticated && isAuthRoute) {
    const dashboard = getRoleDashboardUrl(role);
    return NextResponse.redirect(new URL(dashboard, req.url));
  }

  /* ---------------- 4. Role-Based Route Guards ---------------- */

  // Super Admin Portal
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/admin", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAuthorizedForPath(pathname, role)) {
      return NextResponse.redirect(new URL(getRoleDashboardUrl(role), req.url));
    }
  }

  // Doctor Portal
  if (pathname.startsWith("/doctor")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/doctor", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAuthorizedForPath(pathname, role)) {
      return NextResponse.redirect(new URL(getRoleDashboardUrl(role), req.url));
    }
  }

  // Health Center Portal
  if (pathname.startsWith("/healthcenter")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/healthcenter", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAuthorizedForPath(pathname, role)) {
      return NextResponse.redirect(new URL(getRoleDashboardUrl(role), req.url));
    }
  }

  // Protected User Routes (e.g. Booking History, Downloads)
  const protectedUserRoutes = ["/user/book/mybooking", "/user/download"];
  if (protectedUserRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

// Next.js 16 Proxy alias compatibility
export const proxy = middleware;
export default middleware;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (e.g. .svg, .png, .jpg, .webp)
     * - api routes (/api/*) to avoid blocking API calls
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
