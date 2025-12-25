import AdminFoot from "./AdminFoot.js";
import AdminNav from "./AdminNav.js";



export default function AdminLayout({ children }) {
    return (
        <>
            <AdminNav />
            <div className="">{children}</div>
            <AdminFoot />
        </>
    );
}
