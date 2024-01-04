// Neccessary imports

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdManageHistory } from "react-icons/md";
import { BiSolidUser } from "react-icons/bi";
import { AiFillContacts } from "react-icons/ai";
import "../../App.css";

export const DoctorSidebar = () => {

  // Access the user and logoutUser from the AuthContext

  const { user, logoutUser } = useContext(AuthContext);

  // Extract the user's _id

  const { _id } = user;

  // Define a function to handle the logout process

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <div
      className={`h-${
        window.location.pathname.includes("profile") ? "full" : "screen"
      } w-full bg-zinc-800 px-4 py-8`}
    >
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
          className=" py-4 px-4 text-white hover:bg-blue-500 rounded flex items-center my-10"
        >
          <FaHome className="mr-2 text-xl" />
          Home
        </Link>
        <Link
          to="/doctor-dashboard/profile"
          className="py-4 px-4 text-white hover:bg-blue-500 rounded flex items-center my-10 focus-tab"
        >
          <BiSolidUser className="mr-2 text-xl" />
          Profile
        </Link>
        <Link
          to="/doctor-dashboard/doctor-upcoming"
          className="py-4 px-4 text-white hover:bg-blue-500 rounded flex items-center my-10 focus-tab"
        >
          <AiFillContacts className="mr-2 text-xl" />
          Upcoming Appointments
        </Link>
        <Link
          to="/doctor-dashboard/doctor-completed"
          className="py-4 px-4 text-white hover:bg-blue-500 rounded flex items-center mt-10 mb-1 focus-tab"
        >
          <MdManageHistory className="mr-2 text-xl" />
          Completed Appointments
        </Link>
      </nav>
    </div>
  );
};
