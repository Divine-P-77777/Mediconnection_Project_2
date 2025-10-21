import HealthCenterLoginForm from "./components/HealthCenterLoginForm";

export const metadata = {
  title: "Health Center Auth - MediConnection",
  description: "Authentication page for health centers to access MediConnection platform."
};

export default function HealthCenterPage() {
  return <HealthCenterLoginForm />;
}