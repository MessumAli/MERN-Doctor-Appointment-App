// Import necessary libraries

import express from 'express';

// Import authentication and authorization middleware functions

import { authenticate } from '../auth/verifyToken.js';
import { authorize } from '../auth/verifyRole.js';

// Import middleware for handling file uploads

import  upload from '../middlewares/multer.js';

// Import controller functions

import { updateAdmin, getAllPendingDoctors, getAllRejectedDoctors, approveDoctor, rejectDoctor, blockPatient, blockDoctor } from '../controllers/adminController.js';

// Create an instance of the Express router

const router = express.Router();

// Define routes and their associated middleware and controller functions

router.patch("/update/:id", authenticate, authorize(['admin']), upload, updateAdmin);
router.patch("/blockPatient/:id", authenticate, authorize(['admin']), blockPatient);
router.patch("/blockDoctor/:id", authenticate, authorize(['admin']), blockDoctor);
router.get("/pendingDoctor", authenticate, authorize(['admin']), getAllPendingDoctors);
router.get("/rejectedDoctor", authenticate, authorize(['admin']), getAllRejectedDoctors);
router.patch("/approve/:id", authenticate, authorize(['admin']), approveDoctor);
router.patch("/reject/:id", authenticate, authorize(['admin']), rejectDoctor);

export default router;