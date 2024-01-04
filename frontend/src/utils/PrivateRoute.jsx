// Neccessary imports

import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/access-denied" />;
  }
  if (role && !role.includes(user?.role)) {
    return <Navigate to="/access-denied" />;
  }

  return children;
};
export default PrivateRoute;
