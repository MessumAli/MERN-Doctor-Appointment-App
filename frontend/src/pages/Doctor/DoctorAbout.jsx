// Neccessary imports

import { FormatDate } from "../../utils/FormatDate";

const DoctorAbout = ({ doctor }) => {
  const {
    name,
    about,
    degree,
    university,
    durationStart,
    durationEnd,
    position,
    hospital,
    tenureStart,
    tenureEnd,
    address,
  } = doctor;

  return (
    <div>
      <div>
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold flex items-center gap-2">
          About Of
          <span className="text-irisBlueColor font-bold text-[24px] leading-9">
            {name}
          </span>
        </h3>
        <p className="text__para break-words">{about}</p>
      </div>

      <div className="mt-10">
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold flex items-center gap-2">
          Clinic Location
        </h3>
        <p className="text__para break-words">{address}</p>
      </div>

      <div className="mt-12">
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">
          Education
        </h3>
        <ul className="pt-4 md:p-5">
          <li className="flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]">
            <div>
              <span className="text-irisBlueColor text-[15px] leading-6 font-semibold">
                {durationStart} - {durationEnd}
              </span>
              <p className="text-[16px] leading-6 font-medium text-textColor">
                {degree}
              </p>
            </div>
            <p className="text-[14px] leading-5 font-medium text-textColor">
              {university}
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
              {tenureStart} - {tenureEnd}
            </span>
            <p className="text-[16px] leading-6 font-medium text-textColor">
              {position}
            </p>
            <p className="text-[16px] leading-6 font-medium text-textColor">
              {hospital}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DoctorAbout;
