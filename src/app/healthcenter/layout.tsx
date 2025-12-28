import HCNav from "./components/HCNav";
import HCFoot from "./components/HCFoot";



export default function AdminLayout({ children }) {
    return (
        <>
            <HCNav />
            <div className="">{children}</div>
            <HCFoot />
        </>
    );
}
