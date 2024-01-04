// Neccessary imports

import { AdminSidebar } from "../../components/Admin/AdminSidebar";
import { Outlet } from "react-router-dom";

export const AdminDashboard = () => {
  return (
    <div className="flex">
      <div className="w-1/6">
        <AdminSidebar />
      </div>
      <div className="w-5/6">
        <Outlet />
      </div>
    </div>
  );
};
