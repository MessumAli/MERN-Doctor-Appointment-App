// Import necessary libraries

import mongoose from "mongoose";

// Define the AdminSchema for the Admin model

const AdminSchema = new mongoose.Schema({
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
  otp: { type: String, default: null },

  otpExpiration: { type: Date, default: null },

  isVerified: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Admin", AdminSchema);
