// Neccessary imports

import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorProfile = () => {

  // Access the user and updateUser from the AuthContext

  const { user, updateUser } = useContext(AuthContext);

  // Initialize state variables

  const [loading, setLoading] = useState(false);

  // Initialize the userData object with user data from context or default values

  const [userData, setUserData] = useState({
    name: user.name || "",
    email: user.email || "",
    gender: user.gender || "",
    role: user.role || "",
    specialization: user.specialization || "",
    bio: user.bio || "",
    about: user.about || "",
    photo: user.photo || null,
    degree: user.degree || "",
    university: user.university || "",
    durationStart: user.durationStart || "",
    durationEnd: user.durationEnd || "",
    position: user.position || "",
    hospital: user.hospital || "",
    tenureStart: user.tenureStart || "",
    tenureEnd: user.tenureEnd || "",
    address: user.address || "",
    city: user.city || "",
    country: user.country || "",
    days: user.days || [],
    price: user.price || 0,
    startTime: user.startTime || "",
    endTime: user.endTime || "",
    startTime1: user.startTime1 || "",
    endTime1: user.endTime1 || "",
    startTime2: user.startTime2 || "",
    endTime2: user.endTime2 || "",
    available: user.available !== undefined ? user.available : true,
  });

  // Initialize state variables for managing password change

  const [newPassword, setNewPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  // Initialize error state for handling errors

  const [error, setError] = useState({});

  // Initialize state variables for UI interactions

  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isButtonHidden, setIsButtonHidden] = useState(false);

  // Define a function to handle changes in the new password input

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    console.log(newPassword);
  };

  // Define a function to show the password input field

  const handleShowPasswordInput = () => {
    setShowPasswordInput(true);
  };

  // Define a function to toggle the availability status

  const handleAvailability = () => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      available: !prevUserData.available,
    }));
  };
    
  // Define a function to toggle input visibility and hide buttons

  const handleToggleInput = () => {
    setIsInputVisible((prev) => !prev);
    setIsButtonHidden(true);
  };

  // Define a function to handle changes in form inputs

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  // Define a function to handle changes in the photo input field

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    setUserData((prevUserData) => ({
      ...prevUserData,
      photo: file,
    }));
  };

  // Define a function to handle changes in the day input checkboxes

  const handleDayChange = (e) => {
    const day = e.target.name;

    setUserData((prevUserData) => {
      let updatedDays;

      if (day === "empty") {
        updatedDays = prevUserData.days.filter(
          (selectedDay) => selectedDay !== ""
        );
      } else {
        updatedDays = prevUserData.days.includes(day)
          ? prevUserData.days.filter((selectedDay) => selectedDay !== day)
          : [...prevUserData.days, day];
      }

      return {
        ...prevUserData,
        days: updatedDays,
      };
    });
  };

  // Define a function to handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Initialize an error message object

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

    if (!newPassword && showPasswordInput) {
      errorMessage.newPassword = "Password is required";
    } else if (newPassword.length < 8 && showPasswordInput) {
      errorMessage.newPassword = "Password must be at least 8 characters";
    } else if (newPassword.length > 60 && showPasswordInput) {
      errorMessage.newPassword = "Password cannot exceed 60 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(newPassword) &&
      showPasswordInput
    ) {
      errorMessage.newPassword =
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character";
    }

    if (!userData.specialization.trim()) {
      errorMessage.specialization = "Specialization is required!";
    } else if (userData.specialization.trim().length < 8) {
      errorMessage.specialization =
        "Specialization must have at least 8 characters";
    } else if (userData.specialization.trim().length > 25) {
      errorMessage.specialization =
        "Specialization cannot have more than 25 characters";
    } else if (!/^[A-Za-z\s]+$/.test(userData.specialization.trim())) {
      errorMessage.specialization = "Specialization can only contain alphabets";
    } else if (/\s{2,}/.test(userData.specialization)) {
      errorMessage.specialization = "Consecutive spaces are not allowed";
    }

    if (!userData.bio.trim()) {
      errorMessage.bio = "Bio is required!";
    } else if (userData.bio.trim().length < 30) {
      errorMessage.bio = "Bio must have at least 30 characters";
    } else if (userData.bio.trim().length > 100) {
      errorMessage.bio = "Bio cannot have more than 100 characters";
    } else if (/\s{2,}/.test(userData.bio)) {
      errorMessage.bio = "Consecutive spaces are not allowed";
    } else if (/[^a-zA-Z0-9\s,\.\/\+\-\&\()]+/.test(userData.bio)) {
      errorMessage.bio =
        "Special characters other than comma, full stop, +, -, &, /, and () are not allowed in the bio";
    }

    if (!userData.about.trim()) {
      errorMessage.about = "About is required!";
    } else if (userData.about.trim().length < 100) {
      errorMessage.about = "About must have at least 100 characters";
    } else if (userData.about.trim().length > 300) {
      errorMessage.about = "About cannot have more than 300 characters";
    } else if (/\s{2,}/.test(userData.about)) {
      errorMessage.about = "Consecutive spaces are not allowed";
    } else if (/[^a-zA-Z0-9\s,\.\/\+\-\&\()]+/.test(userData.about)) {
      errorMessage.about =
        "Special characters other than comma, full stop, +, -, &, /, and () are not allowed in the About";
    }

    if (
      userData.photo &&
      userData.photo.name &&
      !/\.(jpg|jpeg|png)$/.test(userData.photo.name.toLowerCase())
    ) {
      errorMessage.photo =
        "Invalid file type. Please upload a .jpg, .jpeg, or .png file.";
    }

    if (!userData.degree.trim()) {
      errorMessage.degree = "Degree is required!";
    } else if (userData.degree.trim().length < 2) {
      errorMessage.degree = "Degree must have at least 2 characters";
    } else if (userData.degree.trim().length > 60) {
      errorMessage.degree = "Degree cannot have more than 60 characters";
    } else if (/\s{2,}/.test(userData.degree)) {
      errorMessage.degree = "Consecutive spaces are not allowed";
    } else if (/[^a-zA-Z0-9\s,\.\&\/\-\()]+/.test(userData.degree)) {
      errorMessage.degree =
        "Special characters other than comma, full stop, &, /, -, and () are not allowed in the Degree";
    }

    if (!userData.university.trim()) {
      errorMessage.university = "University is required!";
    } else if (userData.university.trim().length < 2) {
      errorMessage.university = "University must have at least 2 characters";
    } else if (userData.university.trim().length > 70) {
      errorMessage.university =
        "University cannot have more than 70 characters";
    } else if (/\s{2,}/.test(userData.university)) {
      errorMessage.university = "Consecutive spaces are not allowed";
    } else if (/[^a-zA-Z0-9\s,\.\&\/\-\()]+/.test(userData.university)) {
      errorMessage.university =
        "Special characters other than comma, full stop, &, /, -, and () are not allowed in the University";
    }

    if (!userData.position.trim()) {
      errorMessage.position = "Position is required!";
    } else if (userData.position.trim().length < 2) {
      errorMessage.position = "Position must have at least 2 characters";
    } else if (userData.position.trim().length > 60) {
      errorMessage.position = "Position cannot have more than 60 characters";
    } else if (/\s{2,}/.test(userData.position)) {
      errorMessage.position = "Consecutive spaces are not allowed";
    } else if (/[^a-zA-Z0-9\s,\.\&\/\-\()]+/.test(userData.position)) {
      errorMessage.position =
        "Special characters other than comma, full stop, &, /, -, and () are not allowed in the Position";
    }

    if (!userData.hospital.trim()) {
      errorMessage.hospital = "Hospital is required!";
    } else if (userData.hospital.trim().length < 2) {
      errorMessage.hospital = "Hospital must have at least 2 characters";
    } else if (userData.hospital.trim().length > 70) {
      errorMessage.hospital = "Hospital cannot have more than 70 characters";
    } else if (/\s{2,}/.test(userData.hospital)) {
      errorMessage.hospital = "Consecutive spaces are not allowed";
    } else if (/[^a-zA-Z0-9\s,\.\&\/\-\()]+/.test(userData.hospital)) {
      errorMessage.hospital =
        "Special characters other than comma, full stop, &, /, -, and () are not allowed in the Hospital";
    }

    const now = Date.now();

    if (!userData.durationStart.trim()) {
      errorMessage.durationStart = "Start Date is required!";
    } else if (new Date(userData.durationStart).getTime() > now) {
      errorMessage.durationStart = "Start Date cannot be in the future";
    }

    if (!userData.durationEnd.trim()) {
      errorMessage.durationEnd = "End Date is required!";
    } else if (new Date(userData.durationEnd).getTime() > now) {
      errorMessage.durationEnd = "End Date cannot be in the future";
    } else if (
      userData.durationStart.trim() &&
      userData.durationStart.trim() >= userData.durationEnd.trim()
    ) {
      errorMessage.durationEnd = "End Date must be later than Start Date";
    }

    if (!userData.tenureStart.trim()) {
      errorMessage.tenureStart = "Start Date is required!";
    } else if (new Date(userData.tenureStart).getTime() > now) {
      errorMessage.tenureStart = "Start Date cannot be in the future";
    }

    if (!userData.tenureEnd.trim()) {
      errorMessage.tenureEnd = "End Date is required!";
    } else if (new Date(userData.tenureEnd).getTime() > now) {
      errorMessage.tenureEnd = "End Date cannot be in the future";
    } else if (
      userData.tenureStart.trim() &&
      userData.tenureStart.trim() >= userData.tenureEnd.trim()
    ) {
      errorMessage.tenureEnd = "End Date must be later than Start Date";
    }

    if (!userData.address.trim()) {
      errorMessage.address = "Address is required!";
    } else if (userData.address.trim().length < 30) {
      errorMessage.address = "Address must have at least 30 characters";
    } else if (userData.address.trim().length > 100) {
      errorMessage.address = "Address cannot have more than 100 characters";
    } else if (/\s{2,}/.test(userData.address)) {
      errorMessage.address = "Consecutive spaces are not allowed";
    } else if (/[^a-zA-Z0-9\s,\.\/\#\-\&\()]+/.test(userData.address)) {
      errorMessage.address =
        "Special characters other than comma, full stop, #, -, &, /, and () are not allowed in the Address";
    }

    if (!userData.city.trim()) {
      errorMessage.city = "City is required!";
    } else if (userData.city.trim().length < 3) {
      errorMessage.city = "City must have at least 3 characters";
    } else if (userData.city.trim().length > 25) {
      errorMessage.city = "City cannot have more than 25 characters";
    } else if (!/^[A-Za-z\s]+$/.test(userData.city.trim())) {
      errorMessage.city = "City can only contain alphabets";
    } else if (/\s{2,}/.test(userData.city)) {
      errorMessage.city = "Consecutive spaces are not allowed";
    }

    if (!userData.country.trim()) {
      errorMessage.country = "Country is required!";
    } else if (userData.country.trim().length < 3) {
      errorMessage.country = "Country must have at least 3 characters";
    } else if (userData.country.trim().length > 25) {
      errorMessage.country = "Country cannot have more than 25 characters";
    } else if (!/^[A-Za-z\s]+$/.test(userData.country.trim())) {
      errorMessage.country = "Country can only contain alphabets";
    } else if (/\s{2,}/.test(userData.country)) {
      errorMessage.country = "Consecutive spaces are not allowed";
    }

    if (!userData.days || userData.days.length === 0) {
      errorMessage.days = "Select at least one day";
    }

    if (
      !userData.price ||
      isNaN(parseFloat(userData.price)) ||
      parseFloat(userData.price) < 1000
    ) {
      errorMessage.price = "Price is required and should be at least 1000";
    }

    if (!userData.startTime) {
      errorMessage.startTime = "Start Time is required";
    }
    if (!userData.endTime) {
      errorMessage.endTime = "End Time is required";
    }
    if (userData.startTime && userData.endTime) {
      const startTime = new Date(`2000-01-01T${userData.startTime}`);
      const endTime = new Date(`2000-01-01T${userData.endTime}`);
      const timeDiff = (endTime - startTime) / 1000 / 60;
      if (timeDiff < 15) {
        errorMessage.endTime =
          "End Time should be at least 15 minutes greater than Start Time";
      }
      if (timeDiff > 60) {
        errorMessage.endTime =
          "End Time should not be more than 60 minutes greater than Start Time";
      }
      if (
        userData.startTime === userData.startTime1 ||
        userData.startTime === userData.startTime2
      ) {
        errorMessage.startTime =
          "Start Time cannot be the same as other time slots";
      }
      if (
        userData.endTime === userData.endTime1 ||
        userData.endTime === userData.endTime2
      ) {
        errorMessage.endTime =
          "End Time cannot be the same as other time slots";
      }
    }

    if (userData.startTime1) {
      if (!userData.endTime1) {
        errorMessage.endTime1 =
          "End Time is required when Start Time is provided";
      }
    } else if (userData.endTime1) {
      if (!userData.startTime1) {
        errorMessage.startTime1 =
          "Start Time is required when End Time is provided";
      }
    }
    if (userData.startTime1 && userData.endTime1) {
      const startTime1 = new Date(`2000-01-01T${userData.startTime1}`);
      const endTime1 = new Date(`2000-01-01T${userData.endTime1}`);
      const timeDiff = (endTime1 - startTime1) / 1000 / 60;
      if (timeDiff < 15) {
        errorMessage.endTime1 =
          "End Time should be at least 15 minutes greater than Start Time";
      }
      if (timeDiff > 60) {
        errorMessage.endTime1 =
          "End Time should not be more than 60 minutes greater than Start Time";
      }
      if (
        userData.startTime1 === userData.startTime ||
        userData.startTime1 === userData.startTime2
      ) {
        errorMessage.startTime1 =
          "Start Time cannot be the same as other time slots";
      }
      if (
        userData.endTime1 === userData.endTime ||
        userData.endTime1 === userData.endTime2
      ) {
        errorMessage.endTime1 =
          "End Time cannot be the same as other time slots";
      }
    }

    if (userData.startTime2) {
      if (!userData.endTime2) {
        errorMessage.endTime2 =
          "End Time is required when Start Time is provided";
      }
    } else if (userData.endTime2) {
      if (!userData.startTime2) {
        errorMessage.startTime2 =
          "Start Time is required when End Time is provided";
      }
    }
    if (userData.startTime2 && userData.endTime2) {
      const startTime2 = new Date(`2000-01-01T${userData.startTime2}`);
      const endTime2 = new Date(`2000-01-01T${userData.endTime2}`);
      const timeDiff = (endTime2 - startTime2) / 1000 / 60;
      if (timeDiff < 15) {
        errorMessage.endTime2 =
          "End Time should be at least 15 minutes greater than Start Time";
      }
      if (timeDiff > 60) {
        errorMessage.endTime2 =
          "End Time should not be more than 60 minutes greater than Start Time";
      }
      if (
        userData.startTime2 === userData.startTime ||
        userData.startTime2 === userData.startTime1
      ) {
        errorMessage.startTime2 =
          "Start Time cannot be the same as other time slots";
      }
      if (
        userData.endTime2 === userData.endTime ||
        userData.endTime2 === userData.endTime1
      ) {
        errorMessage.endTime2 =
          "End Time cannot be the same as other time slots";
      }
    }

    setError(errorMessage);

    if (Object.keys(errorMessage).length === 0) {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      if (newPassword.length > 0) {
        formData.append("password", newPassword);
      }
      formData.append("gender", userData.gender);
      formData.append("role", userData.role);
      formData.append("specialization", userData.specialization);
      formData.append("bio", userData.bio);
      formData.append("about", userData.about);
      formData.append("photo", userData.photo);
      formData.append("degree", userData.degree);
      formData.append("university", userData.university);
      formData.append("durationStart", userData.durationStart);
      formData.append("durationEnd", userData.durationEnd);
      formData.append("position", userData.position);
      formData.append("hospital", userData.hospital);
      formData.append("tenureStart", userData.tenureStart);
      formData.append("tenureEnd", userData.tenureEnd);
      formData.append("address", userData.address);
      formData.append("city", userData.city);
      formData.append("country", userData.country);
      userData.days.forEach((day, index) => {
        formData.append(`days[${index}]`, day);
      });
      formData.append("price", userData.price);
      formData.append("startTime", userData.startTime);
      formData.append("endTime", userData.endTime);
      formData.append("startTime1", userData.startTime1);
      formData.append("endTime1", userData.endTime1);
      formData.append("startTime2", userData.startTime2);
      formData.append("endTime2", userData.endTime2);
      formData.append("available", userData.available);

      setLoading(true);

      try {
        const response = await axios.patch(
          `http://localhost:8000/api/v1/doctor/update/${user._id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUserData(response?.data?.data);
        updateUser(response?.data?.data);
        toast.success(response?.data?.message);
        setLoading(false);
      } catch (error) {
        toast.error(error?.response?.data?.message);
        setLoading(false);
      }
    }
  };
  console.log(userData.days);

  return (
    <form className="mx-28 my-20" onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder={user?.name}
                    value={userData?.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {error.name && (
                <span className="text-sm font-semibold text-red-500">
                  {error.name}
                </span>
              )}
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email Address
              </label>
              <div className="mt-2">
                <input
                  disabled
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.email}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <>
                {showPasswordInput ? (
                  <>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      New Password
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          autoComplete="password"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          value={newPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                    </div>
                    {error.newPassword && (
                      <span className="text-sm font-semibold text-red-500">
                        {error.newPassword}
                      </span>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    className="rounded-md bg-blue-500 text-white px-2.5 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600"
                    onClick={handleShowPasswordInput}
                  >
                    Change Password
                  </button>
                )}
              </>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="gender"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Gender
              </label>
              <div className="mt-2">
                <select
                  id="gender"
                  name="gender"
                  autoComplete="gender"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  placeholder={user?.gender}
                  value={userData?.gender}
                  onChange={handleInputChange}
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="role"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Role
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                  <input
                    disabled
                    type="text"
                    name="role"
                    id="role"
                    autoComplete="role"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder={user?.role}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="specialization"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Specialized In
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                  <input
                    type="text"
                    name="specialization"
                    id="specialization"
                    autoComplete="specialization"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder={user?.specialization}
                    value={userData?.specialization}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {error.specialization && (
                <span className="text-sm font-semibold text-red-500">
                  {error.specialization}
                </span>
              )}
            </div>

            <div className="col-span-full">
              <label
                htmlFor="bio"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Bio
              </label>
              <div className="mt-2">
                <textarea
                  id="bio"
                  name="bio"
                  rows={1}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.bio}
                  value={userData?.bio}
                  onChange={handleInputChange}
                />
              </div>
              {error.bio && (
                <span className="text-sm font-semibold text-red-500">
                  {error.bio}
                </span>
              )}

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Write a few words about yourself.
              </p>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.about}
                  value={userData?.about}
                  onChange={handleInputChange}
                />
              </div>
              {error.about && (
                <span className="text-sm font-semibold text-red-500">
                  {error.about}
                </span>
              )}
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Write a few sentences about yourself.
              </p>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Photo
              </label>
              <div className="mt-8 flex items-center gap-x-3">
                <img
                  src={user?.photo}
                  alt="Profile"
                  className="w-16 h-16 rounded-full mr-4 border-2 p-1 border-solid border-blue-900"
                />
                <div>
                  {!isButtonHidden && (
                    <button
                      type="button"
                      className="rounded-md text-white px-2.5 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600 bg-blue-500"
                      onClick={handleToggleInput}
                    >
                      Change
                    </button>
                  )}
                  {isInputVisible && (
                    <input
                      type="file"
                      name="photo"
                      onChange={handleFileInputChange}
                    />
                  )}
                </div>
              </div>
              {error.photo && (
                <span className="text-sm font-semibold text-red-500">
                  {error.photo}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <legend className="text-sm font-semibold leading-6 text-gray-900">
              Professional Details
            </legend>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="degree"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Degree
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="degree"
                  id="degree"
                  autoComplete="degree"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.degree}
                  value={userData?.degree}
                  onChange={handleInputChange}
                />
              </div>
              {error.degree && (
                <span className="text-sm font-semibold text-red-500">
                  {error.degree}
                </span>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="university"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                University
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="university"
                  id="university"
                  autoComplete="university"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.university}
                  value={userData?.university}
                  onChange={handleInputChange}
                />
              </div>
              {error.university && (
                <span className="text-sm font-semibold text-red-500">
                  {error.university}
                </span>
              )}
            </div>

            <br />

            <div className="sm:col-span-2">
              <label
                htmlFor="durationStart"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Start Date
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="durationStart"
                  id="durationStart"
                  autoComplete="durationStart"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.durationStart}
                  value={userData?.durationStart}
                  onChange={handleInputChange}
                />
              </div>
              {error.durationStart && (
                <span className="text-sm font-semibold text-red-500">
                  {error.durationStart}
                </span>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="durationEnd"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                End Date
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="durationEnd"
                  id="durationEnd"
                  autoComplete="durationEnd"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.durationEnd}
                  value={userData?.durationEnd}
                  onChange={handleInputChange}
                />
              </div>
              {error.durationEnd && (
                <span className="text-sm font-semibold text-red-500">
                  {error.durationEnd}
                </span>
              )}
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="position"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Position
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="position"
                  id="position"
                  autoComplete="position"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.position}
                  value={userData?.position}
                  onChange={handleInputChange}
                />
              </div>
              {error.position && (
                <span className="text-sm font-semibold text-red-500">
                  {error.position}
                </span>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="hospital"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Hospital
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="hospital"
                  id="hospital"
                  autoComplete="hospital"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.hospital}
                  value={userData?.hospital}
                  onChange={handleInputChange}
                />
              </div>
              {error.hospital && (
                <span className="text-sm font-semibold text-red-500">
                  {error.hospital}
                </span>
              )}
            </div>

            <br />

            <div className="sm:col-span-2">
              <label
                htmlFor="tenureStart"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Start Date
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="tenureStart"
                  id="tenureStart"
                  autoComplete="tenureStart"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.tenureStart}
                  value={userData?.tenureStart}
                  onChange={handleInputChange}
                />
              </div>
              {error.tenureStart && (
                <span className="text-sm font-semibold text-red-500">
                  {error.tenureStart}
                </span>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="tenureEnd"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                End Date
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="tenureEnd"
                  id="tenureEnd"
                  autoComplete="tenureEnd"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.tenureEnd}
                  value={userData?.tenureEnd}
                  onChange={handleInputChange}
                />
              </div>
              {error.tenureEnd && (
                <span className="text-sm font-semibold text-red-500">
                  {error.tenureEnd}
                </span>
              )}
            </div>

            <div className="col-span-full">
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="address"
                  id="address"
                  autoComplete="address"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.address}
                  value={userData?.address}
                  onChange={handleInputChange}
                />
              </div>
              {error.address && (
                <span className="text-sm font-semibold text-red-500">
                  {error.address}
                </span>
              )}
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="city"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.city}
                  value={userData?.city}
                  onChange={handleInputChange}
                />
              </div>
              {error.city && (
                <span className="text-sm font-semibold text-red-500">
                  {error.city}
                </span>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Country
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="country"
                  id="country"
                  autoComplete="country"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.country}
                  value={userData?.country}
                  onChange={handleInputChange}
                />
              </div>
              {error.country && (
                <span className="text-sm font-semibold text-red-500">
                  {error.country}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">
                Days
              </legend>
              <div className="mt-6 space-y-6">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                  (day) => {
                    const isSelected =
                      userData.days && userData.days.includes(day);
                    {
                      console.log(isSelected);
                    }
                    return (
                      <div key={day} className="relative flex gap-x-3">
                        <div className="flex h-6 items-center">
                          <input
                            id={day}
                            name={day === "" ? "empty" : day}
                            onChange={handleDayChange}
                            type="checkbox"
                            checked={isSelected}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                          />
                        </div>
                        <div className="text-sm leading-6">
                          <label
                            htmlFor={day}
                            className="font-medium text-gray-900"
                          >
                            {day}
                          </label>
                        </div>
                      </div>
                    );
                  }
                )}
                {error.days && (
                  <span className="text-sm font-semibold text-red-500">
                    {error.days}
                  </span>
                )}
              </div>
            </fieldset>

            <div className="sm:col-span-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Price
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                  <input
                    type="Number"
                    name="price"
                    id="price"
                    autoComplete="price"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder={user?.price}
                    value={userData?.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {error.price && (
                <span className="text-sm font-semibold text-red-500">
                  {error.price}
                </span>
              )}
            </div>

            <legend className="text-sm font-semibold leading-6 text-gray-900">
              Time Slot 1
            </legend>

            <div className="flex">
              <div className="sm:col-span-4 mr-20">
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Start Time
                </label>
                <div className="mt-2 ">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                    <input
                      type="time"
                      name="startTime"
                      id="startTime"
                      autoComplete="startTime"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder={user?.startTime}
                      value={userData?.startTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {error.startTime && (
                  <span className="text-sm font-semibold text-red-500">
                    {error.startTime}
                  </span>
                )}
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  End Time
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                    <input
                      type="time"
                      name="endTime"
                      id="endTime"
                      autoComplete="endTime"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder={user?.endTime}
                      value={userData?.endTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {error.endTime && (
                  <span className="text-sm font-semibold text-red-500">
                    {error.endTime}
                  </span>
                )}
              </div>
            </div>

            <legend className="text-sm font-semibold leading-6 text-gray-900">
              Time Slot 2
            </legend>

            <div className="flex">
              <div className="sm:col-span-4 mr-20">
                <label
                  htmlFor="startTime1"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Start Time
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                    <input
                      type="time"
                      name="startTime1"
                      id="startTime1"
                      autoComplete="startTime1"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder={user?.startTime1}
                      value={userData?.startTime1}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {error.startTime1 && (
                  <span className="text-sm font-semibold text-red-500">
                    {error.startTime1}
                  </span>
                )}
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="endTime1"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  End Time
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                    <input
                      type="time"
                      name="endTime1"
                      id="endTime1"
                      autoComplete="endTime1"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder={user?.endTime1}
                      value={userData?.endTime1}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {error.endTime1 && (
                  <span className="text-sm font-semibold text-red-500">
                    {error.endTime1}
                  </span>
                )}
              </div>
            </div>

            <legend className="text-sm font-semibold leading-6 text-gray-900">
              Time Slot 3
            </legend>

            <div className="flex">
              <div className="sm:col-span-4 mr-20">
                <label
                  htmlFor="startTime2"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Start Time
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                    <input
                      type="time"
                      name="startTime2"
                      id="startTime2"
                      autoComplete="startTime2"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder={user?.startTime2}
                      value={userData?.startTime2}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {error.startTime2 && (
                  <span className="text-sm font-semibold text-red-500">
                    {error.startTime2}
                  </span>
                )}
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="endTime2"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  End Time
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                    <input
                      type="time"
                      name="endTime2"
                      id="endTime2"
                      autoComplete="endTime2"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder={user?.endTime2}
                      value={userData?.endTime2}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {error.endTime2 && (
                  <span className="text-sm font-semibold text-red-500">
                    {error.endTime2}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAvailability}
              type="button"
              className={`py-2 px-4 rounded-md font-semibold text-white ${
                userData?.available
                  ? "bg-green-500  hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {userData?.available ? "I am available" : "I am unavailable"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};