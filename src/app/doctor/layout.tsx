import AdminFoot from "./components/DocFoot";
import AdminNav from "./components/DocNav";



export default function AdminLayout({ children }) {
    return (
        <>
            <AdminNav />
            <div className="">{children}</div>
            <AdminFoot />
        </>
    );
}
