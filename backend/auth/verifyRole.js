// Import necessary models

import Admin from "../models/adminModel.js";
import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";

  // Define an authorization middleware that takes an array of roles as input

  const authorize = (roles) => async (req, res, next) => {
  let user;

  // Attempt to find a user with the given ID in each model

  const patient = await Patient.findById(req.user._id);
  const doctor = await Doctor.findById(req.user._id);
  const admin = await Admin.findById(req.user._id);

  // Determine the user based on the model where a match was found

  if (patient) {
    user = patient;
  }
  if (doctor) {
    user = doctor;
  }
  if (admin) {
    user = admin;
  }

  // Check if the user's role is authorized based on the provided roles array

  if (!roles.includes(user.role)) {
    return res
      .status(401)
      .json({ success: false, message: "You are not authorized" });
  }

  // If the user is authorized, call the next middleware in the stack

  next();
};

export { authorize };