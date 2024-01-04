// Neccessary imports

import { HashLoader } from "react-spinners";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../utils/ProtectedRoute";
import PrivateRoute from "../utils/PrivateRoute";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import Home from "../pages/Home/Home";
import Doctor from "../pages/Doctor/Doctor";
import { DoctorDetail } from "../pages/Doctor/DoctorDetail";
import { Review } from "../pages/Doctor/Review";
import { Contact } from "../pages/Contact/Contact";
import { Service } from "../pages/Service/Service";
import { Team } from "../pages/Team/Team";
import { DoctorProfile } from "../components/Doctor/DoctorProfile";
import { PatientProfile } from "../components/Patient/PatientProfile";
import { AdminProfile } from "../components/Admin/AdminProfile";
import { AllPatient } from "../components/Admin/AllPatient";
import { PendingDoctor } from "../components/Admin/PendingDoctor";
import { ApprovedDoctor } from "../components/Admin/ApprovedDoctor";
import { RejectedDoctor } from "../components/Admin/RejectedDoctor";
import { AllUpcoming } from "../components/Admin/AllUpcoming";
import { PendingDoctorDetail } from "../components/Admin/PendingDoctorDetail";
import { AllCompleted } from "../components/Admin/AllCompleted";
import { DoctorUpcoming } from "../components/Doctor/DoctorUpcoming";
import { DoctorCompleted } from "../components/Doctor/DoctorCompleted";
import { PatientCompleted } from "../components/Patient/PatientCompleted";
import { PatientUpcoming } from "../components/Patient/PatientUpcoming";
import { PageNotFound } from "../pages/PageNotFound/PageNotFound";
import { Forbidden } from "../pages/Forbidden/Forbidden";
import { AdminDashboard } from "../pages/Dashboard/AdminDashboard";
import { PatientDashboard } from "../pages/Dashboard/PatientDashboard";
import { DoctorDashboard } from "../pages/Dashboard/DoctorDashboard";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Checkout } from "../pages/Checkout/Checkout";
import { Thankyou } from "../pages/Thankyou/Thankyou";

const Router = () => {

  // Access user information and loading state from the AuthContext

  const { user, loading, showCurrentUser, logoutUser } =
    useContext(AuthContext);

  if (loading) {

    // Display a loading spinner while loading user information

    return (
      <HashLoader
        color="#0066ff"
        size={75}
        className="m-auto"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      />
    );
  }
  return (
    <>
      <Routes>

        {/* Define various routes and their components */}

        <Route
          path="/checkout"
          element={
            <PrivateRoute role={["patient"]}>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/thank-you"
          element={
            <PrivateRoute role={["patient"]}>
              <Thankyou />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/access-denied" element={<Forbidden />} />

        {/* Define admin dashboard routes */}

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute role={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        >
          <Route path="profile" element={<AdminProfile />} />
          <Route path="all-patient" element={<AllPatient />} />
          <Route path="pending-doctor" element={<PendingDoctor />} />
          <Route
            path="pending-doctor-detail/:id"
            element={<PendingDoctorDetail />}
          />
          <Route path="verified-doctor" element={<ApprovedDoctor />} />
          <Route path="rejected-doctor" element={<RejectedDoctor />} />
          <Route path="all-upcoming" element={<AllUpcoming />} />
          <Route path="all-completed" element={<AllCompleted />} />
        </Route>

        {/* Define doctor dashboard routes */}

        <Route
          path="/doctor-dashboard"
          element={
            <PrivateRoute role={["doctor"]}>
              <DoctorDashboard />
            </PrivateRoute>
          }
        >
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="doctor-upcoming" element={<DoctorUpcoming />} />
          <Route path="doctor-completed" element={<DoctorCompleted />} />
        </Route>

        {/* Define patient dashboard routes */}

        <Route
          path="/patient-dashboard"
          element={
            <PrivateRoute role={["patient"]}>
              <PatientDashboard />
            </PrivateRoute>
          }
        >
          <Route path="profile" element={<PatientProfile />} />
          <Route path="patient-upcoming" element={<PatientUpcoming />} />
          <Route path="patient-completed" element={<PatientCompleted />} />
        </Route>

        {/* Define registration, login, and reset password routes */}

        <Route
          path="/register"
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Define other public routes */}

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/doctor/detail/:id" element={<DoctorDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service" element={<Service />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </>
  );
};

export default Router;
