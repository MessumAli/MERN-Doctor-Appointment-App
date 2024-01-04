// Neccessary imports

import { useState, useEffect } from "react";
import starIcon from "../../assets/images/Star.png";
import { useParams } from "react-router-dom";
import axios from "axios";

export const PendingDoctorDetail = () => {

  // Get the 'id' parameter from the current route using useParams hook.

  const { id } = useParams();

  // Initialize a state variable 'doctor' with a default value of null.

  const [doctor, setDoctor] = useState(null);

  // Use the useEffect hook to fetch doctor data when 'id' changes.

  useEffect(() => {

    // Define an asynchronous function to fetch doctor data.

    const getDoctor = async () => {
      try {

        // Send an HTTP GET request to the server to retrieve doctor details.

        const response = await axios.get(
          `http://localhost:8000/api/v1/doctor/pending-doctor-detail/${id}`,
          {
            withCredentials: true,
          }
        );

        // Update the 'doctor' state with the data received from the server.

        setDoctor(response.data.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    // Call the 'getDoctor' function when 'id' changes or on initial component mount.

    getDoctor();
  }, [id]);

  // Check if the 'doctor' data is still loading

  if (doctor === null) {

    // Display a loading message while data is being fetched

    return <p>Loading...</p>;
  }

  // Once the data is loaded, display the doctor's details

  return (
    <section className="w-5/6">
      <div className="max-w-[1170px] px-5 mx-auto">
        <div className="grid md:grid-cols-3 gap-[50px]">
          <div className="md:col-span-2">
            <div className="flex items-center gap-5">
              <figure className="max-w-[200px] max-h-[200px]">
                <img src={doctor.photo} alt="" className="w-full" />
              </figure>
              <div>
                <span className="bg-[#ccf0f3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded">
                  {doctor.specialization}
                </span>
                <h3 className="text-headingColor text-[22px] leading-9 mt-3 font-bold">
                  {doctor.name}
                </h3>
                <div className="flex items-center gap-[6px]">
                  <span className="flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
                    <img src={starIcon} alt="" /> {doctor.averageRating}
                  </span>
                  <span className="text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-[400] text-textColor">
                    ({doctor.totalRating})
                  </span>
                </div>
                <p className="text__para text-[14px] leading-6 md:text-[15px] lg:max-w-[390px] break-words">
                  {doctor.bio}
                </p>
              </div>
            </div>

            <div>
              <div className="mt-10">
                <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold flex items-center gap-2">
                  About Of
                  <span className="text-irisBlueColor font-bold text-[24px] leading-9">
                    {doctor.name}
                  </span>
                </h3>
                <p className="text__para break-words">{doctor.about}</p>
              </div>

              <div className="mt-10">
                <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold flex items-center gap-2">
                  Clinic Location
                </h3>
                <p className="text__para break-words">{doctor.address}</p>
              </div>

              <div className="mt-12 w-3/5">
                <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">
                  Education
                </h3>
                <ul className="pt-4 md:p-5">
                  <li className="flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]">
                    <div>
                      <span className="text-irisBlueColor text-[15px] leading-6 font-semibold">
                        {doctor.durationStart} - {doctor.durationEnd}
                      </span>
                      <p className="text-[16px] leading-6 font-medium text-textColor">
                        {doctor.degree}
                      </p>
                    </div>
                    <p className="text-[14px] leading-5 font-medium text-textColor">
                      {doctor.university}
                    </p>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">
                  Experience
                </h3>
                <ul className="grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5">
                  <li className="p-4 rounded bg-[#fff9ea]">
                    <span className="text-yellowColor text-[15px] leading-6 font-semibold">
                      {doctor.tenureStart} - {doctor.tenureEnd}
                    </span>
                    <p className="text-[16px] leading-6 font-medium text-textColor">
                      {doctor.position}
                    </p>
                    <p className="text-[16px] leading-6 font-medium text-textColor">
                      {doctor.hospital}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};