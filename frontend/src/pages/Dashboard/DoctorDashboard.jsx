// Neccessary imports

import { DoctorSidebar } from "../../components/Doctor/DoctorSidebar";
import { Outlet } from "react-router-dom";

export const DoctorDashboard = () => {
  return (
    <div className="flex">
      <div className="w-1/6">
        <DoctorSidebar />
      </div>
      <div className="w-5/6">
        <Outlet />
      </div>
    </div>
  );
};
