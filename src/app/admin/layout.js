"use client";

import AdminNav from "./adminNav";
import AdminFoot from "./adminFoot";

export default function AdminLayout({ children }) {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white dark:bg-[#0A192F]">
      <AdminNav />
      <div className="w-full h-[1px] shadow-md shadow-purple-200 bg-purple-200"></div>

      <div className="flex-1 w-full">{children}</div>
      <AdminFoot />
    </div>
  );
}
