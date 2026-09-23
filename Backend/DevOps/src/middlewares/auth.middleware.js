import logger from '#config/logger.js';
import { jwtToken } from '#utils/jwt.js';

// function to authenticate token
export const authenticateToken = (req, res, next) => {
  try {
    // extract token from request's token
    const token = req.cookies.token;

    // check if token exists
    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No access token provided',
      });
    }

    // decode the token
    const decoded = jwtToken.verify(token);
    // set the user property as the token decoded
    req.user = decoded;

    logger.info(`User authenticated: ${decoded.email} (${decoded.role})`);
    // continue to the next middleware
    next();
  } catch (error) {
    logger.error('Authentication error:', error);

    if (error.message === 'Failed to authenticate token') {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid or expired token',
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Error during authentication',
    });
  }
};

// function to require a roles
export const requireRole = allowedRoles => {
  return (req, res, next) => {
    try {
      // check if user exists
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated',
        });
      }

      // check if the role is not in the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(
          `Access denied for user ${req.user.email} with role ${req.user.role}. Required: ${allowedRoles.join(', ')}`
        );
        return res.status(403).json({
          error: 'Access denied',
          message: 'Insufficient permissions',
        });
      }

      // continue to the next middleware
      next();
    } catch (e) {
      logger.error('Role verification error:', e);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Error during role verification',
      });
    }
  };
};
