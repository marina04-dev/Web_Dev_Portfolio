// Import necessary modules
import arcjetInstance from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

// Security middleware to protect routes
const securityMiddleware = async (req, res, next) => {
  try {
    // extract user's role
    const role = req.user?.role || 'guest';

    // declare the limit variable
    let limit;

    // set different limits based on user roles
    switch (role) {
      case 'admin':
        limit = 20; // Admins can make 20 requests per interval
        break;
      case 'user':
        limit = 10; // Regular users can make 10 requests per interval
        break;
      case 'guest':
        limit = 5; // Guests can make 5 requests per interval
        break;
    }

    // Apply sliding window rate limiting based on user role
    const client = arcjetInstance.withRule(
      slidingWindow({
        mode: 'LIVE', // 'LIVE' or 'TEST'
        interval: '1m', // 1 minute interval
        max: limit, // max requests based on role
        name: `${role}-rate-limit`, // unique name for the rule
      })
    );

    // make a decision based on the request
    const decision = await client.protect(req);

    // check if decision is denied and if the reason is bot
    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      // return forbidden response
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Automated requests are not allowed',
      });
    }

    // check if decision is denied and if the reason is shield
    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield blocked request.', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });

      // return forbidden response
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked by security policy',
      });
    }

    // check if decision is denied and if the reason is rate limit
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res
        .status(403)
        .json({ error: 'Forbidden', message: 'Too many requests' });
    }

    // If allowed, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Arcjet middleware error:', e);
    res.status(500).json({
      errro: 'Internal server error',
      message: 'Something went wrong with security middleware',
    });
  }
};

// Export the security middleware
export default securityMiddleware;
