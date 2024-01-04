// Import necessary libraries

import express from 'express';

// Import controller functions

import { register, login, logout, showCurrentUser, sendOTP, resetPassword } from '../controllers/authController.js';

// Import utility functions for OTP verification

import {verifyOTP, verifyUserOTP} from '../utils/verifyOTP.js';

// Import authentication middleware for protecting routes

import { authenticate } from '../auth/verifyToken.js';

// Import middleware for handling file uploads

import  upload from '../middlewares/multer.js';

// Create an instance of the Express router

const router = express.Router();

// Define routes and their associated middleware and controller functions

router.post('/register', upload, register);
router.post('/login', login);
router.delete('/logout', logout);
router.post('/send-OTP', sendOTP)
router.post('/verify-OTP', verifyOTP)
router.post('/verify-user-OTP', verifyUserOTP)
router.post('/reset-password', resetPassword)
router.get('/showCurrentUser', authenticate, showCurrentUser);

export default router;