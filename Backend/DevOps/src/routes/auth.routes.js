// Import necessary modules
import express from 'express';
import { signIn, signUp, signOut } from '#contollers/auth.controller.js';

// Initializing the Express router
const router = express.Router();

// Example route for user sign up
router.post('/sign-up', signUp);

// Example route for user sign in
router.post('/sign-in', signIn);

// Example route for user sign out
router.post('/sign-out', signOut);

// Exporting the router to be used in other parts of the application
export default router;
