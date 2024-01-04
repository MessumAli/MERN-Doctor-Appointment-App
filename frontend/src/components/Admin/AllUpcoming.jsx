// Neccessary imports

import React, { useState, useEffect } from "react";
import axios from "axios";
import {Card,Table,TableHead,TableRow,TableHeaderCell,TableBody,TableCell,Text,Title,Badge,} from "@tremor/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Socket } from "../../utils/Socket";

// Define a constant for the number of items to display per page

const PAGE_SIZE = 8;

export const AllUpcoming = () => {

  // Initialize state variables using the useState hook

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPatientName, setSearchPatientName] = useState("");
  const [searchDoctorName, setSearchDoctorName] = useState("");

  // Function to fetch appointments from the server

  const fetchAppointments = async () => {
    try {

      // Send an HTTP GET request to retrieve upcoming appointments

      const response = await axios.get(
        "http://localhost:8000/api/v1/appointment",
        {
          withCredentials: true,
        }
      );

      // Update the appointments state with the fetched data and set loading to false

      setAppointments(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // Use the useEffect hook to fetch appointments when the component mounts

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Use the useEffect hook to listen for real-time updates on upcoming appointments

  useEffect(() => {

    // Set up a socket event listener for "allUpcoming"

    Socket.on("allUpcoming", (data) => {

      // Check if the received appointment exists in the current state

      const appointmentExists = appointments.some(
        (appointment) => appointment._id === data._id
      );

      if (!appointmentExists) {

        // If the appointment is not in the state, add it to the state

        setAppointments((prevAppointments) => [...prevAppointments, data]);
      }
    });

    // Clean up the socket event listener when the component unmounts

    return () => {
      Socket.off("allUpcoming");
    };
  }, [appointments]);

  // Function to format a date in a specific way

  const formatDate = (date) => {
    const formattedDate = new Date(date).toISOString().split("T")[0];
    return formattedDate;
  };

  // Function to format time into a 12-hour format

  const formatTimeTo12Hour = (time) => {
    const [hour, minute] = time.split(":");
    let period = "AM";
    let formattedHour = parseInt(hour, 10);

    if (formattedHour >= 12) {
      period = "PM";
      formattedHour = formattedHour === 12 ? 12 : formattedHour - 12;
    }

    return `${formattedHour}:${minute} ${period}`;
  };


  // Function to calculate the duration between two times

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    const diffInMinutes = Math.round((end - start) / (1000 * 60));

    const formattedStartTime = formatTimeTo12Hour(startTime);
    const formattedEndTime = formatTimeTo12Hour(endTime);

    return `(${diffInMinutes} mins)`;
  };

  // Function to handle moving to the next page

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Function to handle moving to the previous page

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Filter the appointments based on certain conditions, using optional chaining (?.)

  const filteredAppointments = appointments.filter((appointment) => {
    const patientNameMatches = appointment?.patientName
      ?.toLowerCase()
      .includes(searchPatientName.toLowerCase());
    const doctorNameMatches = appointment?.doctorName
      ?.toLowerCase()
      .includes(searchDoctorName.toLowerCase());

    // Return appointments that meet the following conditions:

    return (
      appointment.appointmentStatus === "pending" &&
      (searchPatientName === "" || patientNameMatches) &&
      (searchDoctorName === "" || doctorNameMatches)
    );
  });

  // Calculate the total number of filtered appointments

  const totalAppointments = filteredAppointments.length;

  // Calculate the total number of pages needed for pagination

  const totalPages = Math.ceil(totalAppointments / PAGE_SIZE);

  // Calculate the starting index of the current page

  const startIdx = (currentPage - 1) * PAGE_SIZE;

  // Calculate the ending index of the current page (limited by the total appointments)

  const endIdx = Math.min(startIdx + PAGE_SIZE, totalAppointments);

  // Extract the appointments for the current page

  const currentAppointments = filteredAppointments.slice(startIdx, endIdx);

  return (
    <Card className="w-full h-full">
      <Title className="text-blue-600 text-3xl text-center font-semibold">
        All Upcoming Appointments
      </Title>

      <div className="flex justify-between">
        <div className="mt-[30px] bg-blue-100 flex  justify-start focus:border-none rounded-xl">
          <input
            type="text"
            placeholder="Search by patient name"
            value={searchPatientName}
            onChange={(e) => setSearchPatientName(e.target.value)}
            className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor border-none "
          />
        </div>
        <div className="mt-[30px] bg-blue-100 flex  justify-end focus:border-none rounded-xl">
          <input
            type="text"
            placeholder="Search by doctor name"
            value={searchDoctorName}
            onChange={(e) => setSearchDoctorName(e.target.value)}
            className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor border-none"
          />
        </div>
      </div>

      {totalAppointments === 0 ? (
        <Text className="text-center text-red-600 mt-52 text-3xl">
          No Appointments Found
        </Text>
      ) : (
        <>
          <Table className="mt-5">
            <TableHead>
              <TableRow className="bg-blue-500 text-white">
                <TableHeaderCell>Patient</TableHeaderCell>
                <TableHeaderCell>Doctor</TableHeaderCell>
                <TableHeaderCell>Day</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Start Time</TableHeaderCell>
                <TableHeaderCell>End Time</TableHeaderCell>
                {/* <TableHeaderCell>Time</TableHeaderCell> */}
                <TableHeaderCell>Duration</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>Payment Status</TableHeaderCell>
                <TableHeaderCell>Appointment Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>
                    <Text>{appointment.patientName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{appointment.doctorName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{appointment.day}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{formatDate(appointment.date)}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{formatTimeTo12Hour(appointment.startTime)}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{formatTimeTo12Hour(appointment.endTime)}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>
                      {calculateDuration(
                        appointment.startTime,
                        appointment.endTime
                      )}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text>{appointment.price} PKR</Text>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-500 text-white rounded">
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        appointment.appointmentStatus === "pending"
                          ? "bg-yellow-400"
                          : "bg-green-500"
                      } text-white rounded`}
                    >
                      {appointment.appointmentStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIdx + 1}</span> to{" "}
                  <span className="font-medium">{endIdx}</span> of{" "}
                  <span className="font-medium">{totalAppointments}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ${
                      currentPage === 1
                        ? "cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        index + 1 === currentPage
                          ? "bg-blue-600 hover:bg-blue-700 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ${
                      currentPage === totalPages
                        ? "cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};