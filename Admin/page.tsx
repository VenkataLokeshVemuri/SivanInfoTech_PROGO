import AdminLayout from "./admin-layout";
import Dashboard from "./dashboard";
import UsersPage from "./users/page";
import CoursesPage from "./courses/page";
import SchedulePage from "./schedule/page";

export default function AdminPage() {
  return (
    <AdminLayout>
      <Dashboard />
      <UsersPage />
      <CoursesPage />
      <SchedulePage />
    </AdminLayout>
  );
}


