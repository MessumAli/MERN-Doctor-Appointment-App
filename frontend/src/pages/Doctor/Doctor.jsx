// Neccessary imports

import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorCard from "./../../components/Doctor/DoctorCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { HashLoader } from "react-spinners";

const Doctor = () => {

  // State variables for managing doctor data, search, and pagination

  const [doctors, setDoctors] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Effect to fetch doctor data from the API

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/doctor");
        setDoctors(response.data.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    // Invoke the function to fetch doctor data when the component mounts

    fetchDoctorData();
  }, []);

  if (doctors === null) {

    // Display a loading spinner when data is being fetched

    return (
      <HashLoader
        color="#0066ff"
        size={75}
        className="m-auto"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      />
    );
  }

  // Function to filter doctors based on search query

  const handleSearch = () => {
    const filteredDoctors = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredDoctors;
  };

  // Pagination settings

  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDoctors = searchQuery ? handleSearch() : doctors;

  // Function to update the current page

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate an array of page numbers for pagination

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(currentDoctors.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <section className="bg-[#fff9ea]">
        <div className="container text-center">
          <h2 className="heading">Find A Doctor</h2>
          <div className="max-w-[450px] mt-[30px] mx-auto bg-[#0066ff2c] flex items-center justify-between rounded-xl">
            <input
              type="search"
              placeholder="Search Doctor"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor border-none"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          {currentDoctors.length === 0 ? (
            <p className="text-center my-20 text-3xl text-red-500">
              No doctors found
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {currentDoctors
                  .slice(indexOfFirstItem, indexOfLastItem)
                  .map((doctor) => (
                    <DoctorCard key={doctor._id} doctor={doctor} />
                  ))}
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <a
                    href="#"
                    onClick={() => {
                      if (currentPage > 1) {
                        paginate(currentPage - 1);
                      }
                    }}
                    className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                      currentPage === 1
                        ? "cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    Previous
                  </a>
                  <a
                    href="#"
                    onClick={() => {
                      if (currentPage < pageNumbers.length) {
                        paginate(currentPage + 1);
                      }
                    }}
                    className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                      currentPage === pageNumbers.length
                        ? "cursor-not-allowed"
                        : "hover.bg-gray-50"
                    }`}
                  >
                    Next
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstItem + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {indexOfLastItem > currentDoctors.length
                          ? currentDoctors.length
                          : indexOfLastItem}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {currentDoctors.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <a
                      href="#"
                      onClick={() => {
                        if (currentPage > 1) {
                          paginate(currentPage - 1);
                        }
                      }}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${
                        currentPage === 1
                          ? "cursor-not-allowed"
                          : "focus:outline-offset-0"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </a>
                    {pageNumbers.map((number) => (
                      <a
                        key={number}
                        href="#"
                        className={`relative ${
                          currentPage === number
                            ? "z-10 inline-flex items-center bg-blue-600 text-white"
                            : "inline-flex items-center"
                        } px-4 py-2 text-sm font-semibold ${
                          currentPage === number
                            ? "focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                            : ""
                        } ${
                          currentPage === number
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover.bg-gray-50"
                        }`}
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </a>
                    ))}
                    <a
                      href="#"
                      onClick={() => {
                        if (currentPage < pageNumbers.length) {
                          paginate(currentPage + 1);
                        }
                      }}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                        currentPage === pageNumbers.length
                          ? "cursor-not-allowed"
                          : "hover.bg-gray-50"
                      }`}
                    >
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Next</span>
                    </a>
                  </nav>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Doctor;
