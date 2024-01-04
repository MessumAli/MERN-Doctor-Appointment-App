// Neccessary imports

import React, { useState, useEffect } from "react";
import axios from "axios";
import {Card,Table,TableHead,TableRow,TableHeaderCell,TableBody,TableCell,Text,Title,Button,Badge,} from "@tremor/react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";


// Define a constant for the number of items to display per page

const PAGE_SIZE = 8;

export const PendingDoctor = () => {

  // Initialize state variables using the useState hook

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");


  // Use the useEffect hook to fetch pending doctors when the component mounts

  useEffect(() => {
    const getPendingDoctor = async () => {
      try {

        // Send an HTTP GET request to retrieve pending doctors

        const response = await axios.get(
          "http://localhost:8000/api/v1/admin/pendingDoctor",
          {
            withCredentials: true,
          }
        );

        // Update the doctors state with the fetched data and set loading to false

        setDoctors(
          response.data.data.map((doctor) => ({
            ...doctor,
            isActionTaken: false,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      }
    };

    // Call the getPendingDoctor function when the component mounts

    getPendingDoctor();
  }, []);


  // Calculate the total number of pending doctors

  const totalDoctors = doctors.length;

  // Calculate the total number of pages needed for pagination

  const totalPages = Math.ceil(totalDoctors / PAGE_SIZE);

  // Define a function to handle moving to the next page

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Define a function to handle moving to the previous page

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Calculate the starting index of the current page

  const startIdx = (currentPage - 1) * PAGE_SIZE;

  // Calculate the ending index of the current page (limited by the total pending doctors)

  const endIdx = Math.min(startIdx + PAGE_SIZE, totalDoctors);

  // Extract the pending doctors for the current page

  const currentDoctors = doctors.slice(startIdx, endIdx);

  // Filter the current pending doctors based on the search term (case-insensitive)

  const filteredDoctors = currentDoctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // Define a function to handle approving a doctor

  const handleApprove = async (doctorId, index) => {
    try {

      // Send an HTTP PATCH request to approve the doctor

      await axios.patch(
        `http://localhost:8000/api/v1/admin/approve/${doctorId}`,
        null,
        {
          withCredentials: true,
        }
      );

      // Update the doctors state to reflect the approved status and set isActionTaken to true

      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor, i) =>
          i === index
            ? { ...doctor, status: "approved", isActionTaken: true }
            : doctor
        )
      );
    } catch (error) {
      console.error("Error approving doctor:", error);
    }
  };

  // Define a function to handle rejecting a doctor

  const handleReject = async (doctorId, index) => {
    try {

      // Send an HTTP PATCH request to reject the doctor

      await axios.patch(
        `http://localhost:8000/api/v1/admin/reject/${doctorId}`,
        null,
        {
          withCredentials: true,
        }
      );

      // Update the doctors state to reflect the rejected status and set isActionTaken to true

      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor, i) =>
          i === index
            ? { ...doctor, status: "rejected", isActionTaken: true }
            : doctor
        )
      );
    } catch (error) {
      console.error("Error rejecting doctor:", error);
    }
  };


  // Initialize the 'content' variable

  let content;

  // Check if there are no filtered doctors to display

  if (filteredDoctors.length === 0) {

    // Display a message indicating that no users were found

    content = (
      <Text className="text-center text-red-600 mt-52 text-3xl">
        No User Found
      </Text>
    );
  } else {

    // If there are filtered doctors, display a table with doctor information

    content = (
      <>
        <Table className="mt-5">
          <TableHead>
            <TableRow className="bg-blue-500 text-white">
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Photo</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Gender</TableHeaderCell>
              <TableHeaderCell>Profile</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.map((doctor, index) => (
              <TableRow key={doctor._id}>
                <TableCell>
                  <Text>{doctor.name}</Text>
                </TableCell>
                <TableCell>
                  <img
                    src={doctor.photo}
                    alt="Photo"
                    className="h-10 w-10 rounded-full border-2 p-1 border-solid border-blue-900"
                  />
                </TableCell>
                <TableCell>
                  <Text>{doctor.email}</Text>
                </TableCell>
                <TableCell>
                  <Text>{doctor.gender}</Text>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/admin-dashboard/pending-doctor-detail/${doctor._id}`}
                  >
                    <Badge className="bg-sky-500 hover:bg-sky-600  text-white cursor-pointer rounded">
                      view
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      doctor.status === "approved"
                        ? "bg-green-500"
                        : doctor.status === "rejected"
                        ? "bg-red-500"
                        : "bg-yellow-300"
                    } text-white rounded`}
                  >
                    {doctor.status}
                  </Badge>
                </TableCell>
                <TableCell key={index}>
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white rounded"
                    onClick={() => handleApprove(doctor._id, index)}
                    disabled={doctor.isActionTaken}
                  >
                    Approve
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white rounded"
                    onClick={() => handleReject(doctor._id, index)}
                    disabled={doctor.isActionTaken}
                  >
                    Reject
                  </Button>
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
                <span className="font-medium">{totalDoctors}</span> results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <a
                  href="#"
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
                </a>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      index + 1 === currentPage
                        ? "bg-blue-600 hover:bg-blue-700 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </a>
                ))}
                <a
                  href="#"
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
                </a>
              </nav>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <Card className="w-full h-full">
      <Title className="text-blue-600 font-semibold text-3xl text-center">
        All Pending Doctors
      </Title>
      <div className="max-w-[250px] mt-[30px] bg-blue-100 flex items-center justify-start focus:border-none rounded-xl">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor border-none"
        />
      </div>
      {content}
    </Card>
  );
};