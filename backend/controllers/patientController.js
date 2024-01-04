// Import necessary models, utilities, and libraries

import Patient from "../models/patientModel.js";
import { v2 as cloudinary } from "cloudinary";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { getEmail } from "../utils/getEmail.js";

// Get all patients from the database

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select("-password");

    res.status(200).json({success: true,message: "Patients Found",data: patients,});
  } catch (error) {
    res.status(500).json({success: false,message: "Failed To Retrieve Patients!",data: error.message,});
  }
};

// Get a single patient by their ID

const getSinglePatient = async (req, res) => {
  const id = req.params.id;

  try {
    const patient = await Patient.findById(id).select("-password");

    if (!patient) {return res.status(404).json({success: false,message: "No Patient Found!",});
    }

    res.status(200).json({success: true,message: "Patient Found",data: patient,});
  } catch (error) {
    res.status(500).json({success: false,message: "Failed To Retrieve Patient!",data: error,});
  }
};

// Update patient information

const updatePatient = async (req, res) => {
  const id = req.params.id;

  if (req.files) {
    let photo = req.files[0];
    if (photo && photo.path) {
      const result = await cloudinary.uploader.upload(photo.path, {use_filename: true,folder: "medicare",});
      req.body.photo = result.secure_url;
    }
  }

  try {
    let updatedPatient;
    updatedPatient = await Patient.findById(id);
    if (req.body.password) {

      // If a new password is provided, hash it before updating

      let hashedPassword = await hashPassword(req.body.password);
      let isMatch = comparePassword(req.body.password, updatedPatient.password);

      if (!isMatch || req.body.password != updatedPatient.password) {
        req.body.password = hashedPassword;
      }
    }

    updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({success: true,message: "Successfully Updated",data: updatedPatient,});
  } catch (error) {
    res.status(500).json({success: false,message: "Failed To Update!",data: error,});
  }
};

// Send an email to the specified recipient

const sendEmailToAdmin = async (req, res) => {
  const { email, message } = req.body;

  try {
    const emailSubject = email;
    const emailText = message;
    const emailHtml = `<p>${message}</p>`;
    getEmail(email, emailSubject, emailText, emailHtml);
    res.status(200).json({success: true,message: "Message sent successfully",});
  } catch (error) {
    res.status(500).json({success: false,message: "Failed to Send Email",});
  }
};

export {getAllPatients, getSinglePatient, updatePatient, sendEmailToAdmin};