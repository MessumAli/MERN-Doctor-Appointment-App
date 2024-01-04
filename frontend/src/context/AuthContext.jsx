// Neccessary imports

import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create an authentication context using React's createContext

const AuthContext = createContext();

// Define an authentication provider component

const AuthProvider = ({ children }) => {

  // Access the router's navigation function

  const navigate = useNavigate();

  // Define state variables for user data and loading status

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch and show the current user

  const showCurrentUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/auth/showCurrentUser",
        { withCredentials: true }
      );
      setUser(response.data.user);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // Use an effect to show the current user on component mount

  useEffect(() => {
    if (!user) {
      showCurrentUser();
    }
  }, []);

  // Function to log out the user

  const logoutUser = async () => {
    try {
      const res = await axios.delete(
        "http://localhost:8000/api/v1/auth/logout",
        { withCredentials: true }
      );
      console.log(res);
      setUser(null);
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // Function to update the user data

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  // Function to log in the user

  const loginUser = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/login",
        userData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.user);
      setUser(response.data.user);
      setLoading(false);
      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // Function to delete a user account

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      let endpoint = "";
      if (user.role === "doctor") {
        endpoint = `http://localhost:8000/api/v1/doctor/${id}`;
      } else if (user.role === "patient") {
        endpoint = `http://localhost:8000/api/v1/patient/${id}`;
      }

      // Make an HTTP DELETE request to the appropriate endpoint based on the user's role

      const response = await axios.delete(endpoint, { withCredentials: true });
      setLoading(false);
      setUser(null);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting:", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // Return the AuthProvider with all the context values and functions

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        showCurrentUser,
        logoutUser,
        loginUser,
        deleteUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
