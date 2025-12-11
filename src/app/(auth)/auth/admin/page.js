export const metadata = {
  title:"Admin Login Page | Mediconnection",
  description:"Admin Login Portal of Mediconnection"
}

import AdminFoot from "@/app/admin/AdminFoot"
import AdminNav from "@/app/admin/AdminNav"

import AdminAuthPage from "./AdminAuthPage" 

export default function(){
  return (
    <>
    <AdminNav/>
    <AdminAuthPage/>
    <AdminFoot/>
    </>
  )
}