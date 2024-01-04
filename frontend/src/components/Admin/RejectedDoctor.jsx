// Neccessary imports

import React, { useState, useEffect } from "react";
import axios from "axios";
import {Card,Table,TableHead,TableRow,TableHeaderCell,TableBody,TableCell,Text,Title,Badge,} from "@tremor/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

// Define a constant for the number of items to display per page.

const PAGE_SIZE = 8;

export const RejectedDoctor = () => {

  // Initialize state variables for doctors, loading status, current page, and search term.

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Use the useEffect hook to fetch rejected doctor data on component mount.

  useEffect(() => {

    // Define an asynchronous function to fetch rejected doctor data.

    const getRejectedDoctor = async () => {
      try {

        // Send an HTTP GET request to retrieve rejected doctor data from the server.

        const response = await axios.get(
          "http://localhost:8000/api/v1/admin/rejectedDoctor",
          {
            withCredentials: true,
          }
        );

        // Update the 'doctors' state with the data received from the server and set loading to false.

        setDoctors(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rejected doctors:", error);
        setLoading(false);
      }
    };

    // Call the 'getRejectedDoctor' function on initial component mount.

    getRejectedDoctor();
  }, []);

  // Calculate the total number of doctors and the total number of pages.

  const totalDoctors = doctors.length;
  const totalPages = Math.ceil(totalDoctors / PAGE_SIZE);

  // Define functions to handle next and previous page navigation.

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Calculate the start and end index for the currently displayed doctors.

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, totalDoctors);
  const currentDoctors = doctors.slice(startIdx, endIdx);

  // Filter the current doctors based on the search term.

  const filteredDoctors = currentDoctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define the 'content' variable to render based on the filtered doctors.

  let content;

  if (filteredDoctors.length === 0) {

    // Display a message when no user is found.

    content = (
      <Text className="text-center text-red-600 mt-52 text-3xl">
        No User Found
      </Text>
    );
  } else {

    // If there are filtered doctors, render the following content:

    content = (
      <div>
        <Table className="mt-5">
          <TableHead>
            <TableRow className="bg-blue-500 text-white">
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Photo</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Gender</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.map((doctor) => (
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
                  <Badge className="bg-red-500 text-white rounded">
                    {doctor.status}
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
                <span className="font-medium">{totalDoctors}</span> results
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
      </div>
    );
  }

  return (
    <Card className="w-full h-full">
      <Title className="text-blue-600 text-3xl text-center font-semibold">
        All Rejected Doctors
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