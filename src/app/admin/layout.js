import AdminFooter from "./AdminFooter";
import AdminNavbar from "./AdminNavbar";



export default function AdminLayout({ children }) {
    return (
        <>
            <AdminNavbar />
            <div className="">{children}</div>
            <AdminFooter />
        </>
    );
}
