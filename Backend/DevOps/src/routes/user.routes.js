// Import necessary modules
import {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from '#contollers/users.controller.js';
import {
  authenticateToken,
  requireRole,
} from '#middlewares/auth.middleware.js';
import express from 'express';

// Initializing the Express router
const router = express.Router();

// Example route to get all users
router.get('/', authenticateToken, fetchAllUsers);
// Example route to get a user by ID
router.get('/:id', authenticateToken, fetchUserById);
// Example route to update a user by ID
router.put('/:id', authenticateToken, updateUserById);
// Example route to delete a user by ID
router.delete('/:id', requireRole(['admin']), deleteUserById);

// Exporting the router to be used in other parts of the application
export default router;
