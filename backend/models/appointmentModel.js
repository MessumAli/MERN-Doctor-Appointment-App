// Import necessary libraries

import mongoose from "mongoose";

// Define the AppointmentSchema for the Appointment model

const AppointmentSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "Patient",
    },
    clientSecret: {
      type: String,
    },
    paymentIntentId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "completed"],
      default: "pending",
    },
    date: {
      type: String,
    },
    appointmentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "completed"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", AppointmentSchema);
