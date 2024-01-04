// Neccessary imports

import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export const Contact = () => {

  // Define and initialize state variables

  const [userData, setUserData] = useState({
    email: "",
    message: "",
  });

  const [error, setError] = useState({});

  // Event handler for input changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Event handler for form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = {};

    if (!userData.email) {
      errorMessage.email = "Email is required";
    } else if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(userData.email)) {
      errorMessage.email = "Invalid email format";
    }

    if (!userData.message.trim()) {
      errorMessage.message = "Message is required!";
    } else if (userData.message.trim().length < 20) {
      errorMessage.message = "Message must have at least 20 characters";
    } else if (userData.message.trim().length > 150) {
      errorMessage.message = "Message cannot have more than 150 characters";
    } else if (/\s{2,}/.test(userData.message)) {
      errorMessage.message = "Consecutive spaces are not allowed";
    } else if (/[^a-zA-Z0-9\s,\.\/\+\-\&\()]+/.test(userData.message)) {
      errorMessage.message =
        "Special characters other than comma, full stop, +, -, &, /, and () are not allowed in the message";
    }

    // Set error state based on validation results

    setError(errorMessage);

    // If no validation errors, submit the form

    if (Object.keys(errorMessage).length === 0) {
      try {

        // Send a POST request to the server to submit the form data

        const response = await axios.post(
          "http://localhost:8000/api/v1/patient/contact",
          userData,
          { withCredentials: true }
        );
        toast.success(response.data.message);
      } catch (error) {
        console.error("Error sending email:", error);
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <section>
      <div className="px-4 mx-auto max-w-screen-md">
        <h2 className="heading text-center">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text__para">
          Got a technical issue ? Want to send feedback ? Let Us Know
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="email" className="form__label">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="exemple@gmail.com"
              onChange={handleInputChange}
              className="form__input-1 mt-1"
            />
          </div>
          {error.email && (
            <span className="text-sm font-semibold text-red-500">
              {error.email}
            </span>
          )}
          <div className="sm:col-span-2">
            <label htmlFor="message" className="form__label">
              Your Message
            </label>
            <textarea
              rows={5}
              type="text"
              id="message"
              name="message"
              placeholder="Leave your message . . ."
              onChange={handleInputChange}
              className="form__input-1 mt-1 resize-none"
            />

            {error.message && (
              <span className="text-sm font-semibold text-red-500">
                {error.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="btn rounded sm:w-fit hover:bg-blue-600 text-center"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};
