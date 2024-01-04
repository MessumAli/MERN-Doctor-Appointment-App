// Import necessary models, utilities, and libraries

import Doctor from "../models/doctorModel.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { v2 as cloudinary } from "cloudinary";

// Function to get all approved doctors

const getAllDoctors = async (req, res) => {
  try {

    const approvedDoctors = await Doctor.find({ status: "approved" }).select("-password");

    res.status(200).json({success: true,message: "Approved Doctors Found",data: approvedDoctors,});
  } catch (error) {
    res.status(500).json({success: false,message: "Failed to Retrieve Approved Doctors!",data: error.message,});
  }
};
// Function to get all approved and unblocked doctors

const getAllApprovedDoctors = async (req, res) => {
  try {
    const approvedDoctors = await Doctor.find({status: "approved",block: false,}).select("-password");

    res.status(200).json({success: true,message: "Approved Doctors Found",data: approvedDoctors,});
  } catch (error) {
    res.status(500).json({success: false,message: "Failed to Retrieve Approved Doctors!",data: error.message,});
  }
};

// Function to get a single doctor by their ID

const getSingleDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id).select("-password");

    if (!doctor) {return res.status(404).json({success: false,message: "No Doctor Found!",});
    }

    res.status(200).json({success: true,message: "Doctor Found",data: doctor,});
  } catch (error) {
    res.status(500).json({success: false,message: "Failed to Retrieve Doctor!",data: error,});
  }
};

// Function to get a single pending doctor by their ID

const getSinglePendingDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id).select("-password");

    if (!doctor) {return res.status(404).json({success: false,message: "No Doctor Found!",});
    }

    res.status(200).json({success: true,message: "Doctor Found",data: doctor,});
  } catch (error) {
    res.status(500).json({success: false,message: "Failed to Retrieve Doctor!",data: error,});
  }
};

// Function to update a doctor's information

const updateDoctor = async (req, res) => {
  const id = req.params.id;
  if (req.files) {
    let photo = req.files[0];
    if (photo && photo.path) {

      // Upload the doctor's photo to the cloudinary storage

      const result = await cloudinary.uploader.upload(photo.path, {use_filename: true,folder: "medicare"});
      req.body.photo = result.secure_url;
    }
  }
  try {
    let updatedDoctor;
    updatedDoctor = await Doctor.findById(id);
    if (req.body.password) {

      // If a new password is provided, hash it and check if it matches the old password

      let hashedPassword = await hashPassword(req.body.password);
      let isMatch = comparePassword(req.body.password, updatedDoctor.password);

      if (!isMatch || req.body.password != updatedDoctor.password) {req.body.password = hashedPassword;}
    }

    // Update the doctor's information

    updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({success: true,message: "Successfully Updated",data: updatedDoctor,});
  } catch (error) {
    res.status(500).json({success: false,message: "Failed To Update!",data: error,});
  }
};

export {getAllApprovedDoctors, getSingleDoctor, updateDoctor, getAllDoctors, getSinglePendingDoctor};