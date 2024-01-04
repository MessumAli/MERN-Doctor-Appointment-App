// Neccessary imports

import React, { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ReviewForm = () => {

  // State variables for managing rating, hover, and review text

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Retrieve the 'id' parameter from the route

  const { id } = useParams();

  // Function to handle review submission

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const reviewData = {
      rating,
      reviewText,
    };

    try {

      // Send a POST request to the server to submit the review

      const response = await axios.post(
        `http://localhost:8000/api/v1/doctor/${id}/reviews`,
        reviewData,
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <form action="">
      <div>
        <h3 className="text-headingColor text-[15px] leading-6 font-semibold mb-4 mt-0">
          How would you rate the overall experience ?
        </h3>

        <div>
          {[...Array(5).keys()].map((_, index) => {
            index += 1;

            return (
              <button
                key={index}
                type="button"
                className={`${
                  index <= (rating || hover)
                    ? "text-yellowColor"
                    : "text-gray-400"
                } bg-transparent border-none outline-none text-[22px] cursor-pointer `}
                onClick={() => setRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
                onDoubleClick={() => {
                  setHover(0);
                  setRating(0);
                }}
              >
                <span>
                  <AiFillStar />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-[30px]">
        <h3 className="text-headingColor text-[15px] leading-6 font-semibold mb-4 mt-0">
          Share your review or suggestions
        </h3>
        <textarea
          className="border border-solid border-[#0066ff34] focus:outline outline-primaryColor w-full px-2 py-3 rounded-md resize-none"
          rows={5}
          placeholder="Your Review"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
      </div>
      <button type="submit" className="btn" onClick={handleSubmitReview}>
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
