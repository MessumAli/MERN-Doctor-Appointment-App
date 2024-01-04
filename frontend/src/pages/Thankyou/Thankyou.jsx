// Neccessary imports

import React, { useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Socket } from "../../utils/Socket";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";

export const Thankyou = () => {

  // Access the current location

  const location = useLocation();

  // Use an effect to update the appointment with the paymentIntentId

  useEffect(() => {
    const { appointment, paymentIntentId } = location.state;

    const updatedAppointment = async () => {
      const id = appointment?._id;

      try {
        const response = await axios.patch(
          `http://localhost:8000/api/v1/appointment/update/${id}`,
          { paymentIntentId },
          { withCredentials: true }
        );

        // Emit a socket event to update upcoming appointments

        Socket.emit("onAllUpcoming", response?.data?.data);
      } catch (err) {
        console.log(err);
      }
    };

    // Call the function to update the appointment

    updatedAppointment();
  }, [location.state]);
  return (
    <>
      <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className=" flex justify-center text-green-600 text-9xl">
            <MdVerified />
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Thank You
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Congratulations! you have successfully booked an appointment. Please
            check your dashboard for details.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-primaryColor px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};
