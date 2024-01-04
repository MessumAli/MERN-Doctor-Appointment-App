// Neccessary imports

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Router from "../routes/Router";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  const location = useLocation();

  // Define an array of routes where the Footer should be hidden

  const hideFooterOnRoutes = [
    "/register",
    "/login",
    "/reset-password",
    "/patient-dashboard",
    "/doctor-dashboard",
    "/doctor-dashboard/appointment",
    "/admin-dashboard",
    "/doctor-dashboard/profile",
    "/patient-dashboard/profile",
    "/admin-dashboard/profile",
    "/admin-dashboard/all-patient",
    "/admin-dashboard/pending-doctor",
    "/admin-dashboard/verified-doctor",
    "/admin-dashboard/rejected-doctor",
    "/admin-dashboard/all-upcoming",
    "/admin-dashboard/all-completed",
    "/doctor-dashboard/doctor-upcoming",
    "/doctor-dashboard/doctor-completed",
    "/patient-dashboard/patient-upcoming",
    "/patient-dashboard/patient-completed",
    "/access-denied",
    "/thank-you",
  ];

  // Define an array of routes where the Header should be hidden

  const hideHeaderOnRoutes = [
    "/patient-dashboard",
    "/doctor-dashboard",
    "/doctor-dashboard/appointment",
    "/admin-dashboard",
    "/doctor-dashboard/profile",
    "/patient-dashboard/profile",
    "/admin-dashboard/profile",
    "/admin-dashboard/all-patient",
    "/admin-dashboard/pending-doctor",
    "/admin-dashboard/verified-doctor",
    "/admin-dashboard/rejected-doctor",
    "/admin-dashboard/all-upcoming",
    "/admin-dashboard/all-completed",
    "/doctor-dashboard/doctor-upcoming",
    "/doctor-dashboard/doctor-completed",
    "/patient-dashboard/patient-upcoming",
    "/patient-dashboard/patient-completed",
    "/access-denied",
    "/thank-you",
  ];

  // Check if the current route should hide the Footer and Header

  const shouldHideFooter = hideFooterOnRoutes.includes(location.pathname);
  const shouldHideHeader = hideHeaderOnRoutes.includes(location.pathname);

  // Check if the current route contains the pending-doctor-detail route

  const hidePendingDoctorDetail = location.pathname.includes("/admin-dashboard/pending-doctor-detail/");


  return (
    <>
      {!shouldHideHeader && !hidePendingDoctorDetail && <Header />}

      <main>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar
          pauseOnHover={false}
          theme="colored"
        />
        <Router />
      </main>
      {!shouldHideFooter && !hidePendingDoctorDetail && <Footer />}
    </>
  );
};

export default Layout;
