// Neccessary imports

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdManageHistory } from "react-icons/md";
import { BiSolidUser } from "react-icons/bi";
import { AiFillContacts } from "react-icons/ai";
import "../../App.css";

export const PatientSidebar = () => {

  // Access user, logoutUser, and deleteUser from the AuthContext

  const { user, logoutUser, deleteUser } = useContext(AuthContext);

  // Extract the user's _id

  const { _id } = user;

  // Define a function to handle user logout

  const handleLogout = async () => {
    await logoutUser();
  };

  // Define a function to handle user deletion with a specified ID

  const handleDelete = async (id) => {
    await deleteUser(id);
  };

  return (
    <div className="h-screen w-full bg-zinc-800 px-4 py-8">
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
          to="/patient-dashboard/profile"
          className="py-4 px-4 text-white hover:bg-blue-500 rounded flex items-center my-10 focus-tab"
        >
          <BiSolidUser className="mr-2 text-xl" />
          Profile
        </Link>
        <Link
          to='/patient-dashboard/patient-upcoming'
          className="py-4 px-4  text-white hover:bg-blue-500 rounded flex items-center my-10 focus-tab"
        >
          <AiFillContacts className="mr-2 text-xl" />
          Upcoming Appointments
        </Link>
        <Link
          to='/patient-dashboard/patient-completed'
          className="py-4 px-4 text-white hover:bg-blue-500 rounded flex items-center mt-10 mb-1 focus-tab"
        >
          <MdManageHistory className="mr-2 text-xl" />
          Completed Appointments
        </Link>
      </nav>
    </div>
  );
};
