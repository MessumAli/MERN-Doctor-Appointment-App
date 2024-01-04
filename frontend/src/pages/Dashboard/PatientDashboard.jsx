// Neccessary imports

import { PatientSidebar } from "../../components/Patient/PatientSidebar";
import { Outlet } from "react-router-dom";

export const PatientDashboard = () => {
  return (
    <div className="flex">
      <div className="w-1/6">
        <PatientSidebar />
      </div>
      <div className="w-5/6">
        <Outlet />
      </div>
    </div>
  );
};
