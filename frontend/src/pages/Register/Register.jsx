// Neccessary imports

import React, { useState, useEffect } from "react";
import signupImg from "../../assets/images/signup.gif";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  // State variables for managing OTP verification

  const [remainingTime, setRemainingTime] = useState(60);
  const [otp, setOtp] = useState();
  const [show, setShow] = useState(false);

  // State variables for user registration

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    photo: null,
    gender: "male",
    role: "patient",
  });

  // State variables for handling user profile photo

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State variable for handling form validation errors

  const [error, setError] = useState({});

  // Function to handle input changes in the registration form

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Function to handle user profile photo selection

  const handleFileInputChange = async (event) => {
    const file = await event.target.files[0];
    setUserData({ ...userData, photo: file });
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  // Function to handle the submission of OTP verification

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/verify-user-OTP",
        { otp },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      navigate("/login");
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Function to handle the submission of user registration

  const submitHandler = async (event) => {
    event.preventDefault();

    // Object to store validation error messages

    const errorMessage = {};

    if (!userData.name.trim()) {
      errorMessage.name = "Name is required!";
    } else if (userData.name.trim().length < 3) {
      errorMessage.name = "Name must have at least 3 characters";
    } else if (userData.name.trim().length > 20) {
      errorMessage.name = "Name cannot have more than 20 characters";
    } else if (!/^[A-Za-z\s]+$/.test(userData.name.trim())) {
      errorMessage.name = "Name can only contain alphabets";
    } else if (/\s{2,}/.test(userData.name)) {
      errorMessage.name = "Consecutive spaces are not allowed";
    }

    if (!userData.email) {
      errorMessage.email = "Email is required";
    } else if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(userData.email)) {
      errorMessage.email = "Invalid email format";
    }

    if (!userData.password) {
      errorMessage.password = "Password is required";
    } else if (userData.password.length < 8) {
      errorMessage.password = "Password must be at least 8 characters";
    } else if (userData.password.length > 60) {
      errorMessage.password = "Password cannot exceed 60 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(userData.password)
    ) {
      errorMessage.password =
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character";
    }

    if (
      userData.photo &&
      userData.photo.name &&
      !/\.(jpg|jpeg|png)$/.test(userData.photo.name.toLowerCase())
    ) {
      errorMessage.photo =
        "Invalid file type. Please upload a .jpg, .jpeg, or .png file.";
    }
    if (!userData.photo) {
      errorMessage.photo = "Please upload photo.";
    }

    setError(errorMessage);

    if (Object.keys(errorMessage).length === 0) {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("gender", userData.gender);
      formData.append("role", userData.role);
      if (userData.photo) {
        console.log(userData.photo);

        formData.append("photo", userData.photo);
      }
      try {
        console.log(formData);
        const response = await axios.post(
          "http://localhost:8000/api/v1/auth/register",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log(response);
        setShow(true);
        setOtp("");
        toast.success(response.data.message);
        setRemainingTime(60);
      } catch (error) {
        console.error("Error registering:", error);
        setShow(false);
        toast.error(error.response.data.message);
      }
    }
  };

  const resendOTP = () => {
    setShow(false);
  };
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
  }, [submitHandler]);

  return (
    <>
      <section className="px-5 xl:px-0">
        <div className="max-w-[1170px] mx-auto">
          {!show ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="hidden lg:block bg-primaryColor rounded-l-lg">
                  <figure className="rounded-l-lg">
                    <img
                      src={signupImg}
                      alt=""
                      className="w-full rounded-l-lg"
                    />
                  </figure>
                </div>
                <div className="rounded-l-lg lg:pl-16 py-10">
                  <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
                    Create An <span className="text-primaryColor">Account</span>
                  </h3>

                  <form onSubmit={submitHandler}>
                    <div className="mb-5">
                      <input
                        type="text"
                        placeholder="Full Name"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                      />
                      {error.name && (
                        <span className="text-sm font-semibold text-red-500">
                          {error.name}
                        </span>
                      )}
                    </div>
                    <div className="mb-5">
                      <input
                        type="email"
                        placeholder="Enter Your Email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                      />
                      {error.email && (
                        <span className="text-sm font-semibold text-red-500">
                          {error.email}
                        </span>
                      )}
                    </div>
                    <div className="mb-5">
                      <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={userData.password}
                        onChange={handleInputChange}
                        className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                      />
                      {error.password && (
                        <span className="text-sm font-semibold text-red-500">
                          {error.password}
                        </span>
                      )}
                    </div>
                    <div className="mb-5 flex items-center justify-between">
                      <label className="text-headingColor font-bold text-[16px] leading-7">
                        Are You A:
                        <select
                          name="role"
                          value={userData.role}
                          onChange={handleInputChange}
                          className="text-textColor font-semibold text-[15px] leading-7  focus:outline-none border-none mx-2"
                        >
                          <option value="patient">Patient</option>
                          <option value="doctor">Doctor</option>
                        </select>
                      </label>
                      <label className="text-headingColor font-bold text-[16px] leading-7">
                        Gender:
                        <select
                          name="gender"
                          value={userData.gender}
                          onChange={handleInputChange}
                          className="text-textColor font-semibold text-[15px] leading-7 border-none focus:outline-none mx-2"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </label>
                    </div>
                    <div className="mb-5 flex items-center gap-3">
                      <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Image Preview"
                            className="w-full rounded-full"
                          />
                        )}
                      </figure>
                      <div className="relative w-[130px] h-[50px]">
                        <input
                          type="file"
                          name="photo"
                          id="customFile"
                          onChange={handleFileInputChange}
                          accept=".jpg, .png, .jpeg"
                          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <label
                          htmlFor="customFile"
                          className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem]
                 text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                        >
                          Upload Photo
                        </label>
                      </div>
                      {error.photo && (
                        <span className="text-sm font-semibold text-red-500">
                          {error.photo}
                        </span>
                      )}
                    </div>
                    <div className="mt-7">
                      <button
                        type="submit"
                        className="w-full bg-primaryColor hover:bg-blue-600 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                      >
                        Register
                      </button>
                    </div>
                    <p className="mt-5 text-textColor text-center">
                      Already have an account?
                      <Link
                        to="/login"
                        className="text-primaryColor font-medium ml-1 hover:underline"
                      >
                        Login
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
              {console.log("otp form")}
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
                      <div style={{ color: "red" }}>OTP Expired!</div>
                      <div
                        className="text-blue-600 cursor-pointer ml-2 hover:underline mt-2 text-center"
                        onClick={submitHandler}
                      >
                        Resend OTP
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Register;
