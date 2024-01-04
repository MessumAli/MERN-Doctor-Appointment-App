// Import necessary models, utilities, and libraries

import Admin from "../models/adminModel.js";
import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";
import { generateToken } from "../utils/generateToken.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOTP } from "../utils/generateOTP.js";
import { v2 as cloudinary } from "cloudinary";

// Function to handle user registration

export const register = async (req, res) => {
  const { email, password, name, role, gender } = req.body;
  let photo;

  // Check if a photo is included in the request

  if (req.files) {
    photo = req.files[0];
  }
  if (!photo) {

    // Return an error response if no photo is uploaded

    return res.status(400).json({ message: "Please upload a picture" });
  }

  try {

    // Upload the user's photo to Cloudinary

    const result = await cloudinary.uploader.upload(photo.path, {use_filename: true,folder: "medicare"});

    let user = null;
    let isDoctor = null;
    let isPatient = null;

    // Check if the email already exists for a verified patient or doctor

    isPatient = await Patient.findOne({ email, isVerified: true });
    isDoctor = await Doctor.findOne({ email, isVerified: true });

    if (isDoctor || isPatient) {return res.status(400).json({ message: "Email already exists" });}
    if (role === "admin") {user = await Admin.findOne({ email, isVerified: false });}
    if (role === "doctor") {user = await Doctor.findOne({ email, isVerified: false });}
    if (role === "patient") {user = await Patient.findOne({ email, isVerified: false });}

    // Delete any existing user with the same email

    if (user) {await user.deleteOne()}

    // Hash the user's password

    const hashedPassword = await hashPassword(password);

    // Create a new user object based on their role

    if (role === "patient") {
      user = new Patient({name,email,password: hashedPassword,gender,role,isVerified: false,});
    }
    if (role === "doctor") {
      user = new Doctor({name,email,password: hashedPassword,gender,role,isVerified: false,});
    }
    if (role === "admin") {
      user = new Admin({name,email,password: hashedPassword,gender,role,isVerified: false,});
    }
    user.photo = result.secure_url;

    // Generate an OTP for email verification

    const { otp, expirationTime } = generateOTP();
    user.verificationOtp = otp;
    user.verificationOtpExpiration = expirationTime;

    // Save the user in the database

    await user.save();

    // Send an email with the OTP for verification

    const emailSubject = "OTP Verification For Registration";
    const emailText = `Hello, your OTP verification code for registration is ${user.verificationOtp}.`;
    const emailHtml = `<p>Hello, your OTP verification code for registration is <strong>${user.verificationOtp}</strong>.</p>`;
    sendEmail(email, emailSubject, emailText, emailHtml);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to register" });
  }
};

// Function to handle user login

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = null;

    // Check if the user is a patient, doctor, or admin

    const patient = await Patient.findOne({ email, isVerified: true });
    const doctor = await Doctor.findOne({ email, isVerified: true });
    const admin = await Admin.findOne({ email });

    // Assign the user object based on their role

    if (patient) {user = patient;}
    if (doctor) {user = doctor;}
    if (admin) {user = admin;}

    // Return an error response if the user is not found

    if (!user) {return res.status(404).json({ message: "User not found" });}

    // Compare the provided password with the stored hashed password

    const comparedPassword = await comparePassword(password, user.password);

    // Return an error response if the password is invalid

    if (!comparedPassword) {return res.status(400).json({ status: false, message: "Invalid password" });}

    // Check if the user is verified and not blocked

    if (!user.isVerified) {return res.status(401).json({ status: false, message: "You have not verified your account" });
    }
    if (user.block) {return res.status(401).json({ status: false, message: "You are blocked" });}

    // Generate a JWT token and set it in a cookie

    generateToken(user, res);

    res.status(201).json({ success: true, message: "Logged in successfully", user });
  } catch (error) {
    res.status(500).json({ status: false, message: "Failed to login" });
  }
};

// Function to handle user logout

export const logout = (req, res) => {

  // Clear the JWT cookie

  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// Function to retrieve the current user

export const showCurrentUser = (req, res) => {
  const user = req.user;
  if (user) {

    // Respond with the current user's information

    res.status(200).json({ user });
  } else {

    // Return an error response if the user is not found

    res.status(401).json({ message: "User not found" });
  }
};

// Function to send an OTP for password reset

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    let user = null;

    // Check if the user is a patient, doctor, or admin

    const patient = await Patient.findOne({ email });
    const doctor = await Doctor.findOne({ email });
    const admin = await Admin.findOne({ email });

    // Assign the user object based on their role

    if (patient) {user = patient;}
    if (doctor) {user = doctor;}
    if (admin) {user = admin;}

    // Return an error response if the user is not found

    if (!user) {return res.status(401).json({ status: false, message: "User not found" });}

    // Check if the user is verified and not blocked

    if (!user.isVerified) {return res.status(401).json({ status: false, message: "You have not verified your account" });}
    if (user.block) {return res.status(401).json({ status: false, message: "You are blocked" });}

    if (user) {

      // Generate an OTP for password reset

      const { otp, expirationTime } = generateOTP();
      user.otp = otp;
      user.otpExpiration = expirationTime;
      await user.save();

      // Send an email with the OTP for password reset

      const emailSubject = "OTP Verification For Password Reset";
      const emailText = `Hello, your OTP Verification code for password reset is ${otp}.`;
      const emailHtml = `<p>Hello, your OTP verification code for password reset is <strong>${otp}</strong>.</p>`;
      sendEmail(email, emailSubject, emailText, emailHtml);
    } else {
      return res.status(401).json({ status: false, message: "User not found" });
    }
    res.status(200).json({ status: true, message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to send OTP" });
  }
};

// Function to reset the user's password

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const hashedPassword = await hashPassword(newPassword);

  try {
    let user = null;

    // Check if the user is a patient, doctor, or admin

    const patient = await Patient.findOne({ email });
    const doctor = await Doctor.findOne({ email });
    const admin = await Admin.findOne({ email });

    // Assign the user object based on their role

    if (patient) {user = patient;}
    if (doctor) {user = doctor;}
    if (admin) {user = admin;}

    if (user) {

      // Update the user's password with the new hashed password

      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};