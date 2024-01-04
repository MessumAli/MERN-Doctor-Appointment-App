// Import necessary libraries

import express from 'express';

// Import authentication and authorization middleware functions

import { authenticate } from '../auth/verifyToken.js';
import { authorize } from '../auth/verifyRole.js';

// Import controller functions

import { getAllReviews, createReview } from '../controllers/reviewController.js';

// Create an instance of the Express router with the 'mergeParams' option set to true

const router = express.Router({ mergeParams: true });

// Define routes and their associated middleware and controller functions

router.post("/", authenticate, authorize(['patient']), createReview);
router.get("/", getAllReviews);

export default router;