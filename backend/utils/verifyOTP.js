// Import necessary models

import Patient from "../models/patientModel.js";
import Doctor from "../models/doctorModel.js";
import Admin from "../models/adminModel.js";

// Verifies the OTP for user authentication.

const verifyOTP = async (req, res) => {
  const { otp } = req.body;

  try {
    let user = null;

    // Check if the OTP belongs to a patient, doctor, or admin.

    const patient = await Patient.findOne({ otp });
    const doctor = await Doctor.findOne({ otp });
    const admin = await Admin.findOne({ otp });

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }
    if (admin) {
      user = admin;
    }

    // Check if the OTP has expired or is invalid.

    if (!user.otp || Date.now() > new Date(user.otpExpiration)) {
      return res.status(400).json({ message: "OTP has expired or is invalid" });
    }

    // If OTP is valid, clear it and update user information.

    if (otp === user.otp) {
      user.otp = null;
      user.otpExpiration = null;
      await user.save();

      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

// Verifies the user's OTP for registration.

const verifyUserOTP = async (req, res) => {
  const { otp } = req.body;
  try {
    let user = null;

    // Check if the OTP belongs to a patient, doctor, or admin.

    const patient = await Patient.findOne({ verificationOtp: otp });
    const doctor = await Doctor.findOne({ verificationOtp: otp });
    const admin = await Admin.findOne({ verificationOtp: otp });

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }
    if (admin) {
      user = admin;
    }

    // Check if the OTP has expired or is invalid.

    if (
      !user.verificationOtp ||
      Date.now() > new Date(user.verificationOtpExpiration)
    ) {
      return res.status(400).json({ message: "OTP has expired or is invalid" });
    }

    // If OTP is valid, clear it and mark the user as verified.

    if (otp === user.verificationOtp) {
      user.verificationOtp = null;
      user.verificationOtpExpiration = null;
      user.isVerified = true;
      await user.save();

      res.status(200).json({ message: "Registered successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

export { verifyOTP, verifyUserOTP };