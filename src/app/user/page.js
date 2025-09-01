"use client";

import { usePathname, useRouter } from "next/navigation";
import UserHome from "./UserHome";
import BookAppointment from "./(pages)/book/page";
import Download from "./(pages)/download/page";
import BooKLiveConsult from "./(pages)/consult/page";
import AboutUs from "./(pages)/about/page";
import Contact from "./(pages)/contact/page";

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
