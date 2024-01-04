// Import necessary libraries

import express from 'express';

// Import authentication and authorization middleware functions

import { authenticate } from '../auth/verifyToken.js';
import { authorize } from '../auth/verifyRole.js';

// Import controller functions

import { createAppointment, updateAppointment, getAllAppointment, getDoctorAppointment, getPatientAppointment } from '../controllers/appointmentController.js';

// Create an instance of the Express router

const router = express.Router();

// Define routes and their associated middleware and controller functions

router.post("/create", authenticate, authorize(['patient']), createAppointment);
router.get("/", authenticate, authorize(['admin']), getAllAppointment);
router.get("/doctor-appointment/:id", authenticate, authorize(['doctor']), getDoctorAppointment);
router.get("/patient-appointment/:id", authenticate, authorize(['patient']), getPatientAppointment);
router.patch("/update/:id", authenticate, authorize(['patient']), updateAppointment);


export default router;