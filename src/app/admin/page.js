"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminHome from "./AdminHome.js";
// import AboutUs from "./about/page";
// import Contact from "./contact/page";
import Dashboard from "./dashboard/page";
// import { useAuth } from "@/hooks/useAuth";

const routes = {
  "/admin": <AdminHome />,
  "/admin/dashboard": <Dashboard />,
  // "/admin/about": <AboutUs />,
  // "/admin/contact": <Contact />,
};

export default function AdminPage() {
  const pathname = usePathname();
  const router = useRouter();

  // const { isAuthenticated, isLoading } = useAuth();

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.push('/login');
  //   }
  // }, [isAuthenticated, isLoading, router]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!isAuthenticated) {
  //   return null;
  // }

  return (
    <main className="w-full min-h-screen flex flex-col">
      {routes[pathname] || <AdminHome />}
    </main>
  );
}
