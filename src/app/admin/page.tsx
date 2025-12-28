export const metadata = {
  title: 'Admin Home Page | Mediconnection',
  description: 'Admin dashboard for managing the application',
}


import AdminHome from "./AdminHome";


export default function AdminPage() {
  return (
    <main className="w-full min-h-screen flex flex-col">

      <AdminHome />
    </main>
  );
}
