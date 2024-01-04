// Import necessary libraries

import express from 'express';

// Import authentication and authorization middleware functions

import { authenticate } from '../auth/verifyToken.js';
import { authorize } from '../auth/verifyRole.js';

// Import middleware for handling file uploads

import  upload from '../middlewares/multer.js';

// Import controller functions

import { getAllApprovedDoctors, getSingleDoctor, updateDoctor, getAllDoctors,  getSinglePendingDoctor } from '../controllers/doctorController.js';

// Import sub-route for handling doctor reviews

import reviewRoute from './reviewRoute.js';

// Create an instance of the Express router

const router = express.Router();

// Define routes and their associated middleware and controller functions

router.get("/all-doctor", authenticate, authorize(['admin']), getAllDoctors);
router.get("/", getAllApprovedDoctors);
router.get("/detail/:id", getSingleDoctor);
router.get("/pending-doctor-detail/:id", authenticate, authorize(['admin']), getSinglePendingDoctor);
router.patch("/update/:id", authenticate, authorize(['doctor']), upload, updateDoctor);
router.use("/:doctorId/reviews", reviewRoute);

export default router;