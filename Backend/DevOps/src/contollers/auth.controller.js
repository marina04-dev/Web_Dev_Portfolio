import { createUser, authenticateUser } from '#src/services/auth.service.js';
import {
  signUpSchema,
  signInSchema,
} from '#src/validations/auth.validation.js';
import logger from '#config/logger.js';
import { formatValidationErrors } from '#utils/format.js';
import { jwtToken } from '#utils/jwt.js';
import { cookies } from '#utils/cookie.js';

// Controller function to handle user sign-up
export const signUp = (req, res, next) => {
  try {
    // parse and validate the request body against the sign-up schema
    const validationResult = signUpSchema.safeParse(req.body);
    // If validation fails, respond with 400 and error details
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed!',
        details: formatValidationErrors(validationResult.error),
      });
    }

    // If validation succeeds, proceed with user creation logic
    const { name, email, password, role } = validationResult.data;

    // create a new user
    const user = createUser({ name, email, password, role });

    // create a user's token (JWT)
    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // set the cookies with the token
    cookies.set(res, 'token', token);

    logger.info(
      `Creating user: Name=${name}, Email=${email}, Role=${role || 'user'}`
    );
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error in signUp controller:', error);
    // Handle specific known errors
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ message: error.message });
    }
    // For unexpected errors, pass to the next middleware
    next(error);
  }
};

// Controller function to handle user sign-in
export const signIn = (req, res, next) => {
  try {
    // parse and validate the request body against the sign-in schema
    const validationResult = signInSchema.safeParse(req.body);
    // If validation fails, respond with 400 and error details
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed!',
        details: formatValidationErrors(validationResult.error),
      });
    }

    // If validation succeeds, proceed with validating user's credentials logic
    const { email, password } = validationResult.data;

    // authenticate the user
    const user = authenticateUser({ email, password });

    // create a user's token (JWT)
    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // set the cookies with the token
    cookies.set(res, 'token', token);

    // Log the successful sign-in
    logger.info(`User signed in: Email=${email}`);
    res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error in signUp controller:', error);
    // Handle specific known errors
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ message: error.message });
    }
    // For unexpected errors, pass to the next middleware
    next(error);
  }
};

// Controller function to handle user sign-out
export const signOut = (req, res, next) => {
  try {
    // Clear the authentication token cookie
    cookies.clear(res, 'token');

    // Log the successful sign-out
    logger.info('User signed out successfully');
    res.status(200).json({ message: 'User signed out successfully' });
  } catch (error) {
    logger.error('Error in signOut controller:', error);
    next(error);
  }
};
