import HCNav from "./components/HCNav";
import HCFoot from "./components/HCFoot";
import RoleProtection from "@/components/RoleProtection";

export default function HealthCenterLayout({ children }) {
    return (
        <>
            <HCNav />
            <div className="">{children}</div>
            <HCFoot />
        </>
    );
}
