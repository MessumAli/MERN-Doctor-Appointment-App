// Neccessary imports

import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import {Card,Table,TableHead,TableRow,TableHeaderCell,TableBody,TableCell,Text,Title,Button,Badge,} from "@tremor/react";

// Define a constant for the number of items to display per page

const PAGE_SIZE = 8;

export const ApprovedDoctor = () => {

  // Initialize state variables using the useState hook

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Use the useEffect hook to fetch approved doctors when the component mounts

  useEffect(() => {
    const getApprovedDoctor = async () => {
      try {

        // Send an HTTP GET request to retrieve approved doctors

        const response = await axios.get(
          "http://localhost:8000/api/v1/doctor/all-doctor",
          {
            withCredentials: true,
          }
        );

        // Update the doctors state with the fetched data and set loading to false

        setDoctors(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      }
    };

    // Call the getApprovedDoctor function when the component mounts

    getApprovedDoctor();
  }, []);

  // Calculate the total number of doctors

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

  // Calculate the ending index of the current page

  const endIdx = Math.min(startIdx + PAGE_SIZE, totalDoctors);

  // Extract the doctors for the current page

  const currentDoctors = doctors.slice(startIdx, endIdx);

  // Filter the current doctors based on the search term (case-insensitive)

  const filteredDoctors = currentDoctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define a function to toggle the block status of a doctor

  const toggleBlockStatus = async (doctorId) => {
    try {

      // Send an HTTP PATCH request to toggle the block status of a doctor

      const response = await axios.patch(
        `http://localhost:8000/api/v1/admin/blockDoctor/${doctorId}`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update the doctors state to reflect the changed block status

      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor._id === doctorId ? { ...doctor, block: !doctor.block } : doctor
        )
      );
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };


  // Initialize the 'content' variable

  let content;

  // Check if there are no filtered doctors to display

  if (filteredDoctors.length === 0) {
    content = (

      // Display a message indicating that no users were found

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
              <TableHeaderCell>Specialization</TableHeaderCell>
              <TableHeaderCell>Rating</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
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
                  <Text>{doctor.specialization}</Text>
                </TableCell>
                <TableCell>
                  <Text>
                    {doctor.averageRating}({doctor.totalRating})
                  </Text>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-500 text-white rounded">
                    {doctor.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    className={`outline-none ${
                      doctor.block ? "bg-red-600" : "bg-red-500"
                    } rounded text-white hover:bg-red-600`}
                    onClick={() => toggleBlockStatus(doctor._id)}
                  >
                    {doctor.block ? "Unblock" : "Block"}
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
      <Title className="text-blue-600 text-3xl text-center font-semibold">
        All Verified Doctors
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