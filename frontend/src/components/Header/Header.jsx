// Neccessary imports

import { useEffect, useRef, useContext, useState } from "react";
import logo from "../../assets/images/logo.png";
import userImg from "../../assets/images/avatar-icon.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { AuthContext } from "../../context/AuthContext";
import { Modal } from "../Modal/Modal";
import { HiOutlineLogout } from "react-icons/hi";

// Define an array of navigation links with 'path' and 'display' properties

const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/doctor",
    display: "Find a Doctor",
  },
  {
    path: "/service",
    display: "Services",
  },
  {
    path: "/team",
    display: "Team",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];

const Header = () => {

  // Import necessary hooks and functions from React and React Router

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [modal, setModal] = useState(false);

  // Define a useRef for the header and menu elements

  const headerRef = useRef(null);
  const menuRef = useRef(null);

  // Function to handle sticky header on scroll

  const handleStickyHeader = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    });
  };

  // Use the useEffect hook to add and remove sticky header functionality

  useEffect(() => {
    handleStickyHeader();

    return () => window.removeEventListener("scroll", handleStickyHeader);
  });

  // Function to toggle the menu visibility

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  // Function to handle a click event

  const handleClick = () => {
    setModal(true);
  };

  // Function to close the modal

  const handleModalClose = () => {
    setModal(false);
  };

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <img src={logo} alt="" />
          </div>
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-[16px] leading-7 font-[600]"
                        : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden">
              <Link to="/">
                <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                  <img src={userImg} className="w-full rounded-full" alt="" />
                </figure>
              </Link>
            </div>
            {user && (
              <>
                <h3 className=" text-lg text-textColor font-medium">
                  {user.name}
                </h3>
                {user.role === "patient" && (
                  <Link to="/patient-dashboard/profile">
                    <img
                      src={user.photo}
                      alt="Profile"
                      className="w-12 h-12 rounded-full mr-4 border-2 p-1 border-solid border-blue-900"
                    />
                  </Link>
                )}
                {user.role === "doctor" && (
                  <Link to="/doctor-dashboard/profile">
                    <img
                      src={user.photo}
                      alt="Profile"
                      className="w-12 h-12 rounded-full mr-4 border-2 p-1 border-solid border-blue-900"
                    />
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link to="/admin-dashboard/profile">
                    <img
                      src={user.photo}
                      alt="Profile"
                      className="w-12 h-12 rounded-full mr-4 border-2 p-1 border-solid border-blue-900"
                    />
                  </Link>
                )}
                <button
                  onClick={handleClick}
                  className="bg-red-500 hover:bg-red-600 py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]"
                >
                  <HiOutlineLogout className="mr-1" /> Logout
                </button>
                {modal && <Modal handleModalClose={handleModalClose} />}
              </>
            )}
            {!user && (
              <Link to="/login">
                <button className="bg-primaryColor hover:bg-blue-600 py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  <HiOutlineLogout className="mr-1" /> Login
                </button>
              </Link>
            )}
            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
