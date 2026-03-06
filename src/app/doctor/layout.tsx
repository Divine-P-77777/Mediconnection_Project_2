import AdminFoot from "./components/DocFoot";
import AdminNav from "./components/DocNav";
import RoleProtection from "@/components/RoleProtection";

export default function DoctorLayout({ children }) {
    return (
        <>
            <AdminNav />
            <div className="">{children}</div>
            <AdminFoot />
        </>
    );
}
