// Neccessary imports

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Function to send OTP to the user's email

export const sendOTP = async (email) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/v1/auth/send-OTP",
      { email }
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    throw error.response ? error.response.data : error.message;
  }
};

// Function to verify the OTP entered by the user

export const verifyOTP = async (otp) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/v1/auth/verify-OTP",
      { otp }
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    throw error.response ? error.response.data : error.message;
  }
};

// Function to reset the user's password

const resetPassword = async (email, newPassword) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/v1/auth/reset-password",
      {
        email,
        newPassword,
      }
    );
    console.log("Password reset:", response);
    toast.success(response.data.message);
  } catch (error) {
    console.error("Failed to reset password:", error);
    toast.error(error.response.data.message);
  }
};

const ResetPassword = () => {
  const [activeForm, setActiveForm] = useState("sendOtp");
  const [userEmail, setUserEmail] = useState("");

  // Function to handle the change of the active form

  const handleFormChange = (form) => {
    setActiveForm(form);
  };

  const SendOtpForm = ({ show, handleFormChange }) => {
    const [email, setEmail] = useState("");

    // Function to handle OTP sending

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await sendOTP(email);
        setUserEmail(email);
        console.log("OTP sent:", response);
        handleFormChange("verifyOtp");
      } catch (error) {
        console.error("Failed to send OTP:", error);
      }
    };

    return (
      <section
        className="px-5 lg:px-0"
        style={{ display: show ? "block" : "none" }}
      >
        <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
          <form onSubmit={handleSubmit} className="py-4 md:py-0">
            <div className="mb-5">
              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                required
              />
            </div>

            <div className="mt-7">
              <button
                type="submit"
                className="w-full bg-primaryColor hover:bg-blue-700 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
              >
                Send OTP Code
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  };

  const VerifyOtpForm = ({ show, handleFormChange }) => {
    const [otp, setOtp] = useState("");
    const [remainingTime, setRemainingTime] = useState(60);

    // Function to handle OTP verification

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await verifyOTP(otp);
        console.log("OTP verified:", response);
        handleFormChange("newPassword");
      } catch (error) {
        console.error("Failed to verify OTP:", error);
      }
    };

    // Function to resend OTP

    const resendOTP = () => {
      handleFormChange("sendOtp");
    };

    // Use a timer to count down remaining time

    useEffect(() => {
      let timer;

      if (show) {
        timer = setInterval(() => {
          setRemainingTime((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(timer);
              return 0;
            } else {
              return prevTime - 1;
            }
          });
        }, 1000);
      }

      return () => clearInterval(timer);
    }, [show]);

    return (
      <section
        className="px-5 lg:px-0"
        style={{ display: show ? "block" : "none" }}
      >
        <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
          <form onSubmit={handleSubmit} className="py-4 md:py-0">
            <div className="mb-5">
              <input
                type="password"
                maxLength="6"
                minLength="6"
                placeholder="Enter Your OTP Verification Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                required
              />
            </div>

            <div className="mt-7">
              <button
                type="submit"
                className="w-full bg-primaryColor hover:bg-blue-700 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
              >
                Verify OTP Code
              </button>
            </div>
            <div className="mt-3 text-center text-gray-600">
              {remainingTime > 0 ? (
                `Time remaining: ${remainingTime} seconds`
              ) : (
                <div>
                  <div style={{ color: "red" }}>OTP Expired</div>
                  <div
                    className="text-blue-600 cursor-pointer ml-2 hover:underline mt-2 text-center"
                    onClick={resendOTP}
                  >
                    Resend OTP
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
    );
  };

  const navigate = useNavigate();

  const NewPasswordForm = ({ show, handleFormChange }) => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState({});
    const email = userEmail;
    const handleSubmit = async (e) => {
      e.preventDefault();

      const errorMessage = {};

      if (!newPassword) {
        errorMessage.newPassword = "Password is required";
      } else if (newPassword.length < 8) {
        errorMessage.newPassword = "Password must be at least 8 characters";
      } else if (newPassword.length > 60) {
        errorMessage.newPassword = "Password cannot exceed 60 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(newPassword)) {
        errorMessage.newPassword =
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character";
      }

      setError(errorMessage);

      if (Object.keys(errorMessage).length === 0) {
        try {
          const response = await resetPassword(email, newPassword);
          console.log("OTP verified:", response);
          navigate("/login");
        } catch (error) {
          console.error("Failed to verify OTP:", error);
        }
      }
    };
    return (
      <section
        className="px-5 lg:px-0"
        style={{ display: show ? "block" : "none" }}
      >
        <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
          <form onSubmit={handleSubmit} className="py-4 md:py-0">
            <div className="mb-5">
              <input
                type="password"
                placeholder="Enter Your New Password"
                name="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
              />
              {error.newPassword && (
                <span className="text-sm font-semibold text-red-500">
                  {error.newPassword}
                </span>
              )}
            </div>

            <div className="mt-7">
              <button className="w-full bg-primaryColor hover:bg-blue-700 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  };

  return (
    <div>
      {activeForm === "sendOtp" && (
        <SendOtpForm show={true} handleFormChange={handleFormChange} />
      )}
      {activeForm === "verifyOtp" && (
        <VerifyOtpForm show={true} handleFormChange={handleFormChange} />
      )}
      {activeForm === "newPassword" && <NewPasswordForm show={true} />}
    </div>
  );
};

export default ResetPassword;
