// Import necessary libraries

import mongoose from "mongoose";

// Define the DoctorSchema for the Doctor model

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  role: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
  },
  bio: {
    type: String,
  },
  about: {
    type: String,
  },
  photo: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
  },
  university: {
    type: String,
  },

  durationStart: {
    type: String,
  },
  durationEnd: {
    type: String,
  },
  position: {
    type: String,
  },
  hospital: {
    type: String,
  },

  tenureStart: {
    type: String,
  },
  tenureEnd: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  days: {
    type: [String],
  },
  price: {
    type: Number,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  startTime1: {
    type: String,
  },
  endTime1: {
    type: String,
  },
  startTime2: {
    type: String,
  },
  endTime2: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiration: {
    type: Date,
    default: null,
  },

  verificationOtp: {
    type: String,
    default: null,
  },
  verificationOtpExpiration: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },

  block: {
    type: Boolean,
    default: false,
  },
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  averageRating: {
    type: Number,
    default: 0,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

export default mongoose.model("Doctor", DoctorSchema);