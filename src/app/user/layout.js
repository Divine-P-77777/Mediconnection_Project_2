"use client";
import UserNav from "./UserNav";
import UserFoot from "./UserFoot";

export default function Layout({ children }) {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white dark:bg-[#0A192F]">  
      <UserNav />
      <div className="w-full h-[1px] shadow-md shadow-purple-200 bg-purple-200"></div>

      {/* Center Content */}
      <div className="flex-1 w-full">{children}</div>

      <UserFoot />
    </div>
  );
}
