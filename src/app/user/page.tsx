import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book , Consult & Download Reports | MediConnection",
  description: "Manage your appointments, consultations, and medical records.",
};


import UserHome from "./UserHome"

export default function Page() {
  return (
    <div>
      <UserHome />
    </div>
  )
}