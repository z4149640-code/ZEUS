import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata = {
  title: "Admin Dashboard | ZEUS",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <AdminDashboardClient />
    </div>
  );
}
