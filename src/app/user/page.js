"use client";

import { usePathname, useRouter } from "next/navigation";
import UserHome from "./UserHome";
import BookAppointment from "./book/page";
import Download from "./download/page";
import BooKLiveConsult from "./consult/page";
import AboutUs from "./about/page";
import Contact from "./contact/page";

const routes = {
  "/user": <UserHome />,
  "/user/book": <BookAppointment />,
  "/user/download": <Download />,
  "/user/consult": <BooKLiveConsult />,
  "/user/about": <AboutUs />,
  "/user/contact": <Contact />,
};

export default function UserPage() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <main className="w-full min-h-screen flex flex-col ">
      {routes[pathname] || <UserHome />}
    </main>
  );
}
