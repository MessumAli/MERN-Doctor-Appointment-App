// Import necessary models and libraries

import Admin from "../models/adminModel.js";
import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";
import { v2 as cloudinary } from "cloudinary";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import asyncHandler from "express-async-handler";

// Define a function to update an admin's profile

const updateAdmin = async (req, res) => {
  const id = req.params.id;

  // Check if there are files in the request (e.g., photo upload)

  if (req.files) {
    let photo = req.files[0];
    if (photo && photo.path) {

      // Upload the photo to Cloudinary and update 'req.body.photo'

      const result = await cloudinary.uploader.upload(photo.path, { use_filename: true, folder: "medicare" });
      req.body.photo = result.secure_url;
    }
  }
  try {

    // Find the admin by ID

    let updatedAdmin;
    updatedAdmin = await Admin.findById(id);
    if (req.body.password) {

      // If a new password is provided, hash it and check if it's a match with the existing password

      let hashedPassword = await hashPassword(req.body.password);
      let isMatch = comparePassword(req.body.password, updatedAdmin.password);

      if (!isMatch || req.body.password != updatedAdmin.password) {req.body.password = hashedPassword}
    }

    // Update the admin's data and return the updated profile

    updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    // Respond with a success message and the updated data

    res.status(200).json({success: true, message: "Profile updated successfully", data: updatedAdmin});
  } catch (error) {

    // Handle errors and respond with an error message

    res.status(500).json({success: false, message: "Failed to update", data: error});
  }
};

// Function to get all pending doctors

const getAllPendingDoctors = async (req, res) => {
  try {

    // Find doctors with "pending" status and exclude the password field

    const pendingDoctors = await Doctor.find({ status: "pending" }).select( "-password" );

    // Respond with a success message and the list of pending doctors

    res.status(200).json({success: true, message: "Pending doctors found", data: pendingDoctors});
  } catch (error) {

    // Handle errors and respond with an error message

    res.status(500).json({success: false, message: "Failed to retrieve pending doctors!", data: error.message});
  }
};

// Function to get all rejected doctors

const getAllRejectedDoctors = async (req, res) => {
  try {

    // Find doctors with "rejected" status and exclude the password field

    const rejectedDoctors = await Doctor.find({ status: "rejected" }).select("-password");

    // Respond with a success message and the list of rejected doctors

    res.status(200).json({ success: true, message: "Rejected doctors found", data: rejectedDoctors});
  } catch (error) {

    // Handle errors and respond with an error message

    res.status(500).json({ success: false, message: "Failed to retrieve rejected doctors!", data: error.message});
  }
};

// Function to approve a doctor's status

const approveDoctor = async (req, res) => {
  const doctorId = req.params.id;

  try {

    // Find the doctor by ID

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) { return res.status(404).json({ success: false, message: "Doctor not found"});
    }

    doctor.status = "approved";
    await doctor.save();

    // Change the doctor's status to "approved" and save the update

    res.status(200).json({ success: true, message: "Doctor status changed to approved", data: doctor});
  } catch (error) {

    // Handle errors and respond with an error message

    res.status(500).json({ success: false, message: "Failed to update doctor status", error: error.message });
  }
};

// Function to reject a doctor's status

const rejectDoctor = async (req, res) => {
  const doctorId = req.params.id;

  try {

    // Find the doctor by ID

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Change the doctor's status to "rejected" and save the update

    doctor.status = "rejected";
    await doctor.save();

    // Respond with a success message and the updated doctor's data

    res.status(200).json({ success: true, message: "Doctor status changed to rejected", data: doctor});
  } catch (error) {

    // Handle errors and respond with an error message

    res.status(500).json({ success: false, message: "Failed to update doctor status", error: error.message });
  }
};

// Function to toggle the block status of a patient

const blockPatient = asyncHandler(async (req, res) => {
  const patientId = req.params.id;

  // Find the patient by ID

  const patient = await Patient.findById(patientId);

  // Check if the patient is not found and return a 404 response

  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  // Toggle the 'block' status of the patient and save the update

  patient.block = !patient.block;
  await patient.save();

  // Respond with a message indicating that the block status was toggled

  res.json({ message: `Block status toggled for patient ${patientId}` });
});

// Function to toggle the block status of a doctor

const blockDoctor = asyncHandler(async (req, res) => {
  const doctorId = req.params.id;

  // Find the doctor by ID

  const doctor = await Doctor.findById(doctorId);

  // Check if the doctor is not found and return a 404 response

  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  // Toggle the 'block' status of the doctor and save the update

  doctor.block = !doctor.block;
  await doctor.save();

  // Respond with a message indicating that the block status was toggled

  res.json({ message: `Block status toggled for doctor ${doctorId}` });
});

export {updateAdmin, getAllPendingDoctors, getAllRejectedDoctors, approveDoctor, rejectDoctor, blockPatient, blockDoctor};