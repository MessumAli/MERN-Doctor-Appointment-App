// Neccessary imports

import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading, showCurrentUser, logoutUser } =
    useContext(AuthContext);
  if (!user) {
    return children;
  }

  return <Navigate to="/access-denied" />;
};
export default PrivateRoute;
