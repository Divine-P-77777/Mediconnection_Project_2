import HealthCenterAuthPage from "./components/HealthCenterAuthPage";
import  HCNav from "@/app/healthcenter/components/HCNav"
import  HCFoot from "@/app/healthcenter/components/HCFoot"

export const metadata = {
  title: "Health Center Auth - MediConnection",
  description: "Authentication page for health centers to access MediConnection platform."
};

export default function HealthCenterPage() {
  return (
    <>
      <HCNav />
      <HealthCenterAuthPage />
      <HCFoot />
    </>
  );
}