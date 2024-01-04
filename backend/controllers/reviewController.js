// Import necessary models

import Doctor from "../models/doctorModel.js";
import Review from "../models/reviewModel.js";
import Appointment from "../models/appointmentModel.js";


// Get all reviews for a specific doctor

const getAllReviews = async (req, res) => {
  try {

    // Extract the doctor's ID from the request parameters

    const id = req.params.doctorId;

    // Find all reviews associated with the specified doctor

    const reviews = await Review.find({ doctor: id }).populate("patient", "photo");

    res.status(200).json({ success: true, message: "Successful", data: reviews });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
};

// Create a new review for a specific doctor

const createReview = async (req, res) => {

  // Extract the doctor's ID from the request parameters

  const { doctorId } = req.params;

  // Extract the patient's ID from the authenticated user

  const { _id: patientId } = req.user;

  try {

    // Check if there is an appointment between the patient and the doctor

    const isAppointment = await Appointment.findOne({
      doctorId,
      patient: patientId,
    });

    if (!isAppointment) {return res.status(400).json({success: false,message: "You do not have an appointment with this doctor",});
    }

    // Check if the patient has already submitted a review for this doctor

    const isSubmitted = await Review.findOne({
      doctor: doctorId,
      patient: patientId,
    });

    if (isSubmitted) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review for this doctor",
      });
    }

    // Check if the appointment is marked as completed

    const isAppointmentCompleted = await Appointment.findOne({
      doctorId,
      patient: patientId,
      appointmentStatus: "completed",
    });

    if (!isAppointmentCompleted) {
      return res.status(400).json({
        success: false,
        message: "Appointment is not completed yet!",
      });
    }

    // Create a new review with the provided rating and review text

    const newReview = new Review({
      doctor: doctorId,
      patient: patientId,
      rating: req.body.rating,
      reviewText: req.body.reviewText,
    });

    // Save the new review

    const savedReview = await newReview.save();

    // Update the doctor's reviews array with the new review's ID

    await Doctor.findByIdAndUpdate(doctorId, {
      $push: { reviews: savedReview._id },
    });

    res.status(200).json({ success: true, message: "Review Submitted", data: savedReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all reviews for a specific doctor

const getDoctorReview = async (req, res) => {

  // Extract the doctor's ID from the request parameters

  const id = req.params.doctorId;

  // Find all reviews associated with the specified doctor
  
  const reviews = await Review.find({ doctor: id });
};

export { getAllReviews, createReview, getDoctorReview };
