// Import necessary libraries

import express from 'express';

// Import authentication and authorization middleware functions

import { authenticate } from '../auth/verifyToken.js';
import { authorize } from '../auth/verifyRole.js';

// Import middleware for handling file uploads

import  upload from '../middlewares/multer.js';

// Import controller functions

import { getAllPatients, getSinglePatient, updatePatient, sendEmailToAdmin } from '../controllers/patientController.js';

// Create an instance of the Express router

const router = express.Router();

// Define routes and their associated middleware and controller functions

router.get("/", authenticate, authorize(['admin']), getAllPatients);
router.get("/:id", authenticate, authorize(['patient']), getSinglePatient);
router.patch("/update/:id", authenticate, authorize(['patient']), upload, updatePatient);
router.post("/contact", authenticate, authorize(['patient']), sendEmailToAdmin);

export default router;