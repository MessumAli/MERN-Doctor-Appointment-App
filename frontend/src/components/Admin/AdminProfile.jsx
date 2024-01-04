// Neccessary imports

import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminProfile = () => {

  // Access user information from the AuthContext

  const { user } = useContext(AuthContext);

  // State for loading indicator

  const [loading, setLoading] = useState(false);

  // State to manage user data

  const [userData, setUserData] = useState({
    name: user.name || "",
    email: user.email || "",
    gender: user.gender || "",
    role: user.role || "",
    photo: user.photo || null,
  });

  // State to manage new password

  const [newPassword, setNewPassword] = useState("");

  // State to control password input visibility

  const [showPasswordInput, setShowPasswordInput] = useState(false);

  // State for error handling

  const [error, setError] = useState({});

  // State for input visibility and button visibility

  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isButtonHidden, setIsButtonHidden] = useState(false);

  // Handle new password input change

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  // Show password input field

  const handleShowPasswordInput = () => {
    setShowPasswordInput(true);
  };

  // Toggle input visibility

  const handleToggleInput = () => {
    setIsInputVisible((prev) => !prev);
    setIsButtonHidden(true);
  };

  // Handle input changes for user data

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  // Handle file input change for user photo

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    setUserData((prevUserData) => ({
      ...prevUserData,
      photo: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = {};

    // Validation for the user's name

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

    // Validation for the user's photo

    if (
      userData.photo &&
      userData.photo.name &&
      !/\.(jpg|jpeg|png)$/.test(userData.photo.name.toLowerCase())
    ) {
      errorMessage.photo =
        "Invalid file type. Please upload a .jpg, .jpeg, or .png file.";
    }

    // Validation for a new password if it's required

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

    // Set the error state based on validation results

    setError(errorMessage);

    // If there are no validation errors, submit the form data to the server

    if (Object.keys(errorMessage).length === 0) {
      const formData = new FormData();
      formData.append("name", userData.name);
      if (newPassword.length > 0) {
        formData.append("password", newPassword);
      }
      formData.append("gender", userData.gender);
      formData.append("photo", userData.photo);

      setLoading(true);

      try {

        // Send a patch request to update the user's profile

        const response = await axios.patch(
          `http://localhost:8000/api/v1/admin/update/${user._id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Update user data and show a success message

        setUserData(response?.data?.data);
        toast.success(response?.data?.message);
        setLoading(false);
      } catch (error) {

        // Show an error message in case of a failed request

        toast.error(error?.response?.data?.message);
        setLoading(false);
      }
    }
  };

  // Render a form for the user's profile information

  return (
    <form className="mx-28 my-20" onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-lg font-semibold leading-7 text-blue-700">
            Profile
          </h2>

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
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
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
                  <option value="male">Male</option>
                  <option value="female">Female</option>
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
                      className="rounded-md bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 text-sm font-semibold outline-none shadow-sm ring-1 ring-inset ring-gray-300"
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
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};