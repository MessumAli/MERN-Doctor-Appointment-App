// Neccessary imports

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SidePanel = ({ doctor }) => {

  // Initialize the navigation utility

  const navigate = useNavigate();

  // Destructure the relevant properties from the 'doctor' object

  const {
    price,
    days,
    startTime,
    endTime,
    startTime1,
    endTime1,
    startTime2,
    endTime2,
    available,
  } = doctor;

  // Get the 'doctorId' from the 'doctor' object

  const doctorId = doctor?._id;

  // State variables for managing selected time slot, day, date, and start flag

  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [start, setStart] = useState(false);

  // Function to handle the start button click

  const handleStart = () => {
    setStart(true);
  };

  // Function to handle time slot change

  const handleTimeSlotChange = (event) => {
    const timeString = event.target.value;
    const [startTime, endTime] = timeString.split(" - ");
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
    setSelectedTimeSlot(event.target.value);
    setSelectedDate(null);
  };

  // Function to handle day change

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
    setSelectedDate(null);
  };

  // Function to get the name of the day based on a date

  const getDayName = (date) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  };

  // Function to generate time slot options

  const generateTimeSlotOption = (start, end) => {
    if (start && end) {
      return (
        <option key={`${start}-${end}`} value={`${start} - ${end}`}>
          {`${start} - ${end}`}
        </option>
      );
    }
    return null;
  };

  // Function to handle date change

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toLocaleDateString("en-GB");
    console.log(formattedDate);
  };

  // Function to handle the submission of the appointment

  const handleSubmit = async () => {
    try {
      const payload = {
        price,
        day: selectedDay,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        doctorId,
        date: selectedDate,
      };
      const response = await axios.post(
        "http://localhost:8000/api/v1/appointment/create",
        {
          payload,
        },
        {
          withCredentials: true,
        }
      );
      navigate("/checkout", {
        state: {
          appointment: response.data.appointment,
          clientSecret: response.data.clientSecret,
        },
      });
      console.log("Appointment created:", response.data);
    } catch (error) {
      toast.error(error.response.data.message);

      console.error("Error creating appointment:", error);
    }
  };

  return (
    <div className="shadow p-3 lg:p-5 rounded-md">
      {available ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text__para mt-0 font-semibold">Price</p>
            <span className="text-[16px] leading-7 lg:text-[18px] lg:leading-8 text-headingColor font-semibold">
              {price} PKR
            </span>
          </div>
          <button
            onClick={handleStart}
            className="btn px-2 w-full rounded-md mt-8 hover:bg-blue-700"
          >
            Start Booking
          </button>
          {start && (
            <>
              <div className="mt-[30px]">
                <p className="text__para mt-0 font-semibold text-headingColor">
                  Select a Day:
                </p>
                <select
                  className="mt-3 block w-full rounded-md border border-gray-300 py-2 px-3 text-base leading-6 text-textColor focus:outline-none focus:ring focus:border-blue-300"
                  onChange={handleDayChange}
                  value={selectedDay}
                >
                  <option value="">Select a day</option>
                  {days.map((day, index) => (
                    <option key={index} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {selectedDay && (
            <div className="mt-[30px]">
              <p className="text__para mt-0 font-semibold text-headingColor">
                Select a Time Slot:
              </p>
              <select
                className="mt-3 block w-full rounded-md border border-gray-300 py-2 px-3 text-base leading-6 text-textColor focus:outline-none focus:ring focus:border-blue-300"
                onChange={handleTimeSlotChange}
                value={selectedTimeSlot}
              >
                <option value="">Select a time slot</option>
                {generateTimeSlotOption(startTime, endTime)}
                {generateTimeSlotOption(startTime1, endTime1)}
                {generateTimeSlotOption(startTime2, endTime2)}
              </select>
            </div>
          )}
          {selectedDay && selectedTimeSlot && (
            <div className="mt-[30px]">
              <p className="text__para mt-0 font-semibold text-headingColor">
                Select a Date:
              </p>
              <DatePicker
                className="mt-3 block w-full rounded-md border border-gray-300 py-2 px-3 text-base leading-6 text-textColor focus:outline-none focus:ring focus:border-blue-300"
                onChange={handleDateChange}
                selected={selectedDate}
                filterDate={(date) => {
                  const dayName = getDayName(date);
                  return date >= new Date() && selectedDay.includes(dayName);
                }}
                disabled={!selectedDay || !selectedTimeSlot}
              />
            </div>
          )}
          {selectedDay && selectedTimeSlot && selectedDate && (
            <button
              onClick={handleSubmit}
              className="btn px-2 w-full rounded-md mt-8 hover:bg-blue-700"
            >
              Book
            </button>
          )}
        </>
      ) : (
        <p className="text__para mt-4 font-semibold text-headingColor">
          I am sorry, but I am not available.
        </p>
      )}
    </div>
  );
};

export default SidePanel;
