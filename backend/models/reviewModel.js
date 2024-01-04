// Import necessary libraries and modals

import mongoose from "mongoose";
import Doctor from "./doctorModel.js";

// Define the ReviewSchema for the Review model

const ReviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "patient",
    select: "name photo",
  });

  next();
});

ReviewSchema.statics.calcAverageRatings = async function (doctorId) {
  const stats = await this.aggregate([
    {
      $match: { doctor: doctorId },
    },
    {
      $group: {
        _id: "$doctor",
        numOfRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  const averageRating = stats[0].avgRating.toFixed(1);

  await Doctor.findByIdAndUpdate(doctorId, {
    totalRating: stats[0].numOfRating,
    averageRating: parseFloat(averageRating),
  });
};

ReviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.doctor);
});

export default mongoose.model("Review", ReviewSchema);
