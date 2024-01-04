// Neccessary imports

import { useState, useEffect } from "react";
import starIcon from "../../assets/images/Star.png";
import DoctorAbout from "./DoctorAbout";
import { Review } from "./Review";
import SidePanel from "./SidePanel";
import { useParams } from "react-router-dom";
import axios from "axios";

export const DoctorDetail = () => {

  // Retrieve the 'id' parameter from the route

  const { id } = useParams();

  // State variable to store doctor data

  const [doctor, setDoctor] = useState(null);

  // State variable to manage the currently selected tab

  const [tab, setTab] = useState("about");

  // Effect to fetch doctor data from the API based on 'id'

  useEffect(() => {
    const getDoctor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/doctor/detail/${id}`
        );
        setDoctor(response.data.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    // Invoke the function to fetch doctor data when 'id' changes

    getDoctor();
  }, [id]);

  if (doctor === null) {

    // Display a loading message until the doctor data is available

    return <p>Loading...</p>;
  }

  return (
    <section>
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

            <div className="mt-[50px] border-b border-solid border-[#0066ff34]">
              <button
                onClick={() => setTab("about")}
                className={`${
                  tab === "about" && "border-b border-solid border-primaryColor"
                } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                About
              </button>
              <button
                onClick={() => setTab("review")}
                className={`${
                  tab === "review" &&
                  "border-b border-solid border-primaryColor"
                } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                Reviews
              </button>
            </div>

            <div className="mt-[50px]">
              {tab === "about" && <DoctorAbout doctor={doctor} />}
              {tab === "review" && <Review doctor={doctor} />}
            </div>
          </div>

          <div>
            <SidePanel doctor={doctor} />
          </div>
        </div>
      </div>
    </section>
  );
};
