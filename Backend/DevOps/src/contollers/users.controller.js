import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/users.services.js';
import { formatValidationError } from '#utils/validation.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/users.validation.js';

// Controller function to fetch all users
export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Fetching all users from the database');
    // Fetch all users from the database
    const allUsers = await getAllUsers();

    // Send the users as a JSON response
    res.status(200).json({
      message: 'Users fetched successfully',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    logger.error('Error in fetchAllUsers controller:', error);
    // Pass the error to the next middleware (error handler)
    next(error);
  }
};

// Controller function to fetch a user by ID
export const fetchUserById = async (req, res, next) => {
  try {
    // log the incoming request
    logger.info(`Getting user by id: ${req.params.id}`);

    // Validate the user ID parameter
    const validationResult = userIdSchema.safeParse({ id: req.params.id });

    // check validation result
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    // extract id from validation result data
    const { id } = validationResult.data;
    // find user by id
    const user = await getUserById(id);

    // log the successful fetch
    logger.info(`User ${user.email} retrieved successfully`);
    // return response with user
    res.json({
      message: 'User retrieved successfully',
      user,
    });
  } catch (error) {
    logger.error(`Error fetching user by id: ${error.message}`);

    // check message info
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }

    // pass the unknown error to the next middleware
    next(error);
  }
};

// function to update user by id
export const updateUserById = async (req, res, next) => {
  try {
    logger.info(`Updating user: ${req.params.id}`);

    // Validate the user ID parameter
    const idValidationResult = userIdSchema.safeParse({ id: req.params.id });

    // check validation result info
    if (!idValidationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idValidationResult.error),
      });
    }

    // Validate the update data
    const updateValidationResult = updateUserSchema.safeParse(req.body);

    // check validation result info
    if (!updateValidationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(updateValidationResult.error),
      });
    }

    // extract id from validation result data
    const { id } = idValidationResult.data;
    // extract updates
    const updates = updateValidationResult.data;

    // Authorization checks
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to update user information',
      });
    }

    // Allow users to update only their own information (except role)
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own information',
      });
    }

    // Only admin users can change roles
    if (updates.role && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only administrators can change user roles',
      });
    }

    // Remove role from updates if non-admin user is trying to update their own profile
    if (req.user.role !== 'admin') {
      delete updates.role;
    }

    // update user
    const updatedUser = await updateUser(id, updates);

    logger.info(`User ${updatedUser.email} updated successfully`);
    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (e) {
    logger.error(`Error updating user: ${e.message}`);

    // check if error message is user not found
    if (e.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }

    // check if error message is email already exists
    if (e.message === 'Email already exists') {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // pass the unknown error to the next middleware
    next(e);
  }
};

// function to delete user by id
export const deleteUserById = async (req, res, next) => {
  try {
    logger.info(`Deleting user: ${req.params.id}`);

    // Validate the user ID parameter
    const validationResult = userIdSchema.safeParse({ id: req.params.id });

    // check validation result info
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    // extract id from validation result data
    const { id } = validationResult.data;

    // Authorization checks
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to delete users',
      });
    }

    // Only admin users can delete users (prevent self-deletion or user deletion by non-admins)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only administrators can delete users',
      });
    }

    // Prevent admins from deleting themselves
    if (req.user.id === id) {
      return res.status(403).json({
        error: 'Operation denied',
        message: 'You cannot delete your own account',
      });
    }

    // delete user by id
    const deletedUser = await deleteUser(id);

    logger.info(`User ${deletedUser.email} deleted successfully`);
    res.json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (e) {
    logger.error(`Error deleting user: ${e.message}`);

    // check if error message is user not found
    if (e.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }

    // pass the unknown error to the next middleware
    next(e);
  }
};
