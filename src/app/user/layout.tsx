"use client";

import { usePathname } from "next/navigation";
import UserNav from "./UserNav";
import UserFoot from "./UserFoot";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavFoot = pathname === "/user/chat";

  return (
    <div className="w-full min-h-screen flex flex-col bg-white dark:bg-[#0A192F]">
      {!hideNavFoot && <UserNav />}

      {!hideNavFoot && (
        <div className="w-full h-[1px] shadow-md shadow-purple-200 bg-purple-200" />
      )}

      <div className="flex-1 w-full">{children}</div>

      {!hideNavFoot && <UserFoot />}
    </div>
  );
}
