// Import required libraries and models

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";

// Define an authentication middleware using the asyncHandler middleware

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Get the JWT token from the request's cookies

  token = req.cookies.jwt;

  if (token) {
    try {

      // Verify and decode the JWT token using the secret key

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Check the role in the decoded token and set 'req.user' based on the role

      if (decoded.role === "patient") {
        req.user = await Patient.findById(decoded.id);
      } else if (decoded.role === "doctor") {
        req.user = await Doctor.findById(decoded.id);
      } else if (decoded.role === "admin") {
        req.user = await Admin.findById(decoded.id);
      }

      next();
    } catch (error) {

      // Handle errors if JWT verification fails (e.g., token expired or invalid)

      res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
    }
  } else {

    // Handle the case where there is no token in the request

    res
      .status(401)
      .json({ success: false, message: "Please login first" });
  }
});

export { authenticate };