import AdminFooter from "./AdminFooter";
import AdminNavbar from "./AdminNavbar";
import RoleProtection from "@/components/RoleProtection";

export default function AdminLayout({ children }) {
    return (
        <>
            <AdminNavbar />
            <div className="">{children}</div>
            <AdminFooter />
        </>
    );
}
