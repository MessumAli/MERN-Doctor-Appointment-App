// Neccessary imports

import React, { useState, useEffect } from "react";
import axios from "axios";
import {Card,Table,TableHead,TableRow,TableHeaderCell,TableBody,TableCell,Text,Title,Button,} from "@tremor/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

// Define a constant for the number of items to display per page

const PAGE_SIZE = 8;

export const AllPatient = () => {

  // Initialize state variables using the useState hook

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Use the useEffect hook to fetch all patients when the component mounts

  useEffect(() => {

    // Define an asynchronous function to fetch all patients

    const getAllPatient = async () => {
      try {

        // Send an HTTP GET request to retrieve patients

        const response = await axios.get(
          "http://localhost:8000/api/v1/patient",
          {
            withCredentials: true,
          }
        );

        // Update the patients state with the fetched data and set loading to false

        setPatients(response.data.data);
        setLoading(false);
      } catch (error) {

        // Set loading to false even in case of an error

        setLoading(false);
      }
    };

    // Call the getAllPatient function when the component mounts

    getAllPatient();
  }, []);

  // Calculate the total number of patients

  const totalPatients = patients.length;

  // Calculate the total number of pages needed for pagination

  const totalPages = Math.ceil(totalPatients / PAGE_SIZE);

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

  // Calculate the ending index of the current page (limited by the total patients)

  const endIdx = Math.min(startIdx + PAGE_SIZE, totalPatients);

  // Extract the patients for the current page

  const currentPatients = patients.slice(startIdx, endIdx);

  // Filter the current patients based on the search term (case-insensitive)

  const filteredPatients = currentPatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define a function to toggle the block status of a patient

  const toggleBlockStatus = async (patientId) => {
    try {

      // Send an HTTP PATCH request to toggle the block status of a patient

      const response = await axios.patch(
        `http://localhost:8000/api/v1/admin/blockPatient/${patientId}`,
        {},
        { withCredentials: true }
      );

      // Update the patients state to reflect the changed block status

      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient._id === patientId
            ? { ...patient, block: !patient.block }
            : patient
        )
      );

      console.log(response.data.message);
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };

  // Initialize a variable to hold the content that will be displayed

  let content;

  // Check if there are no filtered patients to display

  if (filteredPatients.length === 0) {

    // Display a message indicating that no users were found

    content = (
      <Text className="text-center text-red-600 mt-52 text-3xl">
        No User Found
      </Text>
    );
  } else {

    // If there are filtered patients, display a table with patient information

    content = (
      <>
        <Table className="mt-5">
          <TableHead>
            <TableRow className="bg-blue-500 text-white">
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Photo</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Gender</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient._id}>
                <TableCell>
                  <Text>{patient.name}</Text>
                </TableCell>
                <TableCell>
                  <img
                    src={patient.photo}
                    alt="Photo"
                    className="h-10 w-10 rounded-full border-2 p-1 border-solid border-blue-900"
                  />
                </TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>
                  <Button
                    className={`outline-none ${
                      patient.block ? "bg-red-600" : "bg-red-500"
                    } rounded text-white hover:bg-red-600`}
                    onClick={() => toggleBlockStatus(patient._id)}
                  >
                    {patient.block ? "Unblock" : "Block"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 ">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIdx + 1}</span> to{" "}
                <span className="font-medium">{endIdx}</span> of{" "}
                <span className="font-medium">{totalPatients}</span> results
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
        All Patients
      </Title>
      <div className="max-w-[250px] mt-[30px] bg-blue-100  flex items-center justify-start mb-5 focus:border-none rounded-xl">
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