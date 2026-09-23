// Import jwt library
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

// Jwt secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Jwt expiration time
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'; // Token valid for 1 day

// Function to sign and verify JWT tokens
export const jwtToken = {
  // Function to sign a payload and generate a JWT token
  sign: payload => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      logger.error('Error signing JWT:', error);
      throw new Error('Could not sign JWT');
    }
  },
  // Function to verify JWT tokens
  verify: token => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('Error verifying JWT:', error);
      throw new Error('Invalid or expired JWT');
    }
  },
};
