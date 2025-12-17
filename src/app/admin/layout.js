import AdminFoot from "./AdminFoot";
import AdminNav from "./AdminNav";



export default function AdminLayout({ children }) {
    return (
        <>
            <AdminNav />
            <div className="">{children}</div>
            <AdminFoot />
        </>
    );
}
