// Import necessary libraries

import mongoose from "mongoose";

// Define the PatientSchema for the Patient model

const PatientSchema = new mongoose.Schema({
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
  photo: {
    type: String,
    required: true,
  },
  block: {
    type: Boolean,
    default: false,
  },
  otp: { type: String, default: null },
  otpExpiration: { type: Date, default: null },
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
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
});

export default mongoose.model("Patient", PatientSchema);
