import UserFoot from "@/app/user/UserFoot";
import UserNav from "@/app/user/UserNav";
import GlobalLoaderWrapper from "@/app/components/GlobalLoaderWrapper";

export default function AdminLayout({ children }) {
    return (
        <>   <GlobalLoaderWrapper>
            <UserNav />
            <div className="">{children}</div>
            <UserFoot />
        </GlobalLoaderWrapper>
        </>
    );
}
