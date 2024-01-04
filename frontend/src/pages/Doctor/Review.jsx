// Neccessary imports

import React, { useState, useEffect } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import axios from "axios";
import avatar from "../../assets/images/avatar-icon.png";
import { HashLoader } from "react-spinners";
import { FormatDate } from "../../utils/FormatDate";
import ReviewForm from "./ReviewForm";

export const Review = () => {

  // Retrieve the 'id' parameter from the route

  const { id } = useParams();

  // State variables for managing reviews and feedback form

  const [reviews, setReviews] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Effect to fetch doctor reviews from the API based on 'id'

  useEffect(() => {
    setLoading(true);
    const fetchDoctorReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/doctor/${id}/reviews`
        );
        setReviews(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctor reviews:", error);
        setLoading(false);
      }
    };

    // Invoke the function to fetch doctor reviews when 'id' changes

    fetchDoctorReviews();
  }, [id]);

  if (loading) {

    // Display a loading spinner while reviews are being fetched

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

  // Function to render star ratings

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <AiFillStar key={i} color="#0067ff" className="text-yellow-500" />
        );
      } else {
        stars.push(
          <AiOutlineStar key={i} color="#0067ff" className="text-gray-400" />
        );
      }
    }
    return stars;
  };

  return (
    <div>
      <div className="mb-[50px]">
        <h4 className="text-[20px] leading-[30px] font-bold text-headingColor mb-[30px]">
          All reviews ({reviews?.length})
        </h4>

        {reviews?.map((review) => (
          <div
            key={review._id}
            className="flex justify-between gap-10 mb-[30px]"
          >
            <div className="flex gap-3">
              <figure className="w-10 h-10 rounded-full">
                <img src={review.patient.photo} alt="" className="w-full" />
              </figure>

              <div>
                <h5 className="text-[16px] leading-6 text-primaryColor font-bold">
                  {review.patient.name}
                </h5>
                <p className="text-[14px] leading-6 text-textColor">
                  {FormatDate(review.createdAt)}
                </p>
                <p className="text__para mt-3 font-medium text-[15px]">
                  {review.reviewText}
                </p>
              </div>
            </div>
            <div className="flex gap-1">{renderStars(review.rating)}</div>
          </div>
        ))}
      </div>

      {!showFeedbackForm && (
        <div className="text-center">
          <button className="btn" onClick={() => setShowFeedbackForm(true)}>
            Give Review
          </button>
        </div>
      )}
      {showFeedbackForm && <ReviewForm />}
    </div>
  );
};
