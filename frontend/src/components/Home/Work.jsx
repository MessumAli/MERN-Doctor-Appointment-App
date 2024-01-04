// Neccessary imports

import icon01 from "../../assets/images/icon01.png";
import icon02 from "../../assets/images/icon02.png";
import icon03 from "../../assets/images/icon03.png";
import { Link } from "react-router-dom";
import { BsArrowRight} from 'react-icons/bs'

export const Work = () => {
  return (
    <section>
      <div className="container">
        <div className="lg:w-[470px] mx-auto">
          <h2 className="heading text-center">
            Providing The Best Medical Services
          </h2>
          <p className="text__para text-center">
            World-Class Care For Everyone. Our health System Offers Unmatched,
            Expert Health Care.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] 
  mt-[30px] lg:mt-[55px]"
        >
          <div className="py-[30px] px-5">
            <div className="flex items-center justify-center">
              <img src={icon01} alt="" />
            </div>

            <div className="mt-[30px]">
              <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                Find A Doctor
              </h2>
              <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                World-Class Care For Everyone. Our Health System Offers
                Unmatched, Expert Health Care. From The Lab To The Clinic.
              </p>

              <Link
                to="/doctor"
                className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center group
           hover:bg-primaryColor hover:border-none justify-center"
              >
                <BsArrowRight className="group-hover:text-white w-6 h-5" />
              </Link>
            </div>
          </div>

          <div className="py-[30px] px-5">
            <div className="flex items-center justify-center">
              <img src={icon02} alt="" />
            </div>

            <div className="mt-[30px]">
              <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                Find A Location
              </h2>
              <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                World-Class Care For Everyone. Our Health System Offers
                Unmatched, Expert Health Care. From The Lab To The Clinic.
              </p>

              <Link
                to="/doctor"
                className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center group
           hover:bg-primaryColor hover:border-none justify-center"
              >
                <BsArrowRight className="group-hover:text-white w-6 h-5" />
              </Link>
            </div>
          </div>

          <div className="py-[30px] px-5">
            <div className="flex items-center justify-center">
              <img src={icon03} alt="" />
            </div>

            <div className="mt-[30px]">
              <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                Book Appointment
              </h2>
              <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                World-Class Care For Everyone. Our Health System Offers
                Unmatched, Expert Health Care. From The Lab To The Clinic.
              </p>

              <Link
                to="/doctor"
                className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center group
           hover:bg-primaryColor hover:border-none justify-center"
              >
                <BsArrowRight className="group-hover:text-white w-6 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
