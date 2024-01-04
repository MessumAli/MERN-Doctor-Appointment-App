// Neccessary imports

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdManageHistory } from "react-icons/md";
import { BiSolidUser } from "react-icons/bi";
import { AiFillContacts } from "react-icons/ai";
import { PiUsersThreeFill } from "react-icons/pi";
import { MdPendingActions, MdVerified } from "react-icons/md";
import { GoBlocked } from "react-icons/go";
import "../../App.css";

export const AdminSidebar = () => {

  // Access user information from the context

  const { user } = useContext(AuthContext);

  return (
    <div className="h-auto w-full bg-zinc-800 px-4 py-8">
      <div className="flex justify-center">
        <img
          src={user.photo}
          alt="Profile"
          className="w-16 h-16 rounded-full mb-4"
        />
      </div>
      <div className="flex items-center  justify-center">
        <div className="text-white text-lg font-semibold">{user?.name}</div>
      </div>

      <nav>
        <Link
          to="/"
          className=" py-4 px-4 text-white hover:bg-blue-500 rounded flex items-center my-10 focus-tab"
        >
          <FaHome className="mr-2 text-xl" />
          Home
        </Link>
        <Link
          to="/admin-dashboard/profile"
          className="py-4 px-4 text-white hover:bg-blue-500 rounded flex items-center my-10 focus-tab"
        >
          <BiSolidUser className="mr-2 text-xl" />
          Profile
        </Link>
        <Link
          to="/admin-dashboard/all-patient"
          className="py-4 px-4 text-white hover:bg-blue-500 rounded flex items-center my-10 focus-tab"
        >
          <PiUsersThreeFill className="mr-2 text-xl" />
          All Patients
        </Link>
        <Link
          to="/admin-dashboard/pending-doctor"
          className="py-4 px-4 text-white hover:bg-blue-500 rounded flex items-center my-10 focus-tab"
        >
          <MdPendingActions className="mr-2 text-xl" />
          Pending Doctors
        </Link>
        <Link
          to="/admin-dashboard/verified-doctor"
          className="py-4 px-4 text-white hover:bg-blue-500 rounded flex items-center my-10 focus-tab"
        >
          <MdVerified className="mr-2 text-xl" />
          Verified Doctors
        </Link>
        <Link
          to="/admin-dashboard/rejected-doctor"
          className="py-4 px-4 text-white hover:bg-blue-500 rounded flex items-center my-10 focus-tab"
        >
          <GoBlocked className="mr-2 text-xl" />
          Rejected Doctors
        </Link>
        <Link
          to="/admin-dashboard/all-upcoming"
          className="py-4 px-4  text-white hover:bg-blue-500 rounded flex items-center my-10 focus-tab"
        >
          <AiFillContacts className="mr-2 text-xl" />
          Upcoming Appointments
        </Link>
        <Link
          to="/admin-dashboard/all-completed"
          className="py-4 px-4 text-white hover:bg-blue-500 rounded flex items-center mt-10 mb-1 focus-tab"
        >
          <MdManageHistory className="mr-2 text-xl" />
          Completed Appointments
        </Link>
      </nav>
    </div>
  );
};