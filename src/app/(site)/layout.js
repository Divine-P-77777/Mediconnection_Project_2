"use client";

import { usePathname } from "next/navigation";
import UserNav from "./user/UserNav";
import UserFoot from "./user/UserFoot";
import AdminNav from "./admin/AdminNav";
import AdminFoot from "./admin/AdminFoot";
import DeveloperNav from "./developer/DeveloperNav";
import DeveloperFoot from "./developer/DeveloperFoot";
import DoctorNav from "./doctor/DoctorNav";
import DoctorFoot from "./doctor/DoctorFoot";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Determine which navbar and footer to render based on URL path
  const getNavAndFooter = () => {
    if (pathname.startsWith("/admin")) {
      return { Nav: AdminNav, Foot: AdminFoot };
    } else if (pathname.startsWith("/super_admin")) {
      return { Nav: DeveloperNav, Foot: DeveloperFoot };
    } else if (pathname.startsWith("/doctor")) {
      return { Nav: DoctorNav, Foot: DoctorFoot };
    }
    return { Nav: UserNav, Foot: UserFoot }; // Default: User Site
  };

  const { Nav, Foot } = getNavAndFooter();

  return (
    <div className="relative">
      <Nav />
      <div className="w-full h-[1px] shadow-md shadow-purple-200 bg-purple-200"></div>

      <div className="min-h-screen">{children}</div>

      <Foot />
    </div>
  );
}
