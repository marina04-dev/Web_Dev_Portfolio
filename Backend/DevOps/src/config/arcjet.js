// Import arcjet features for secirity enhancements
import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';

// Initialize arcjet with the provided key from environment variables
const arcjetInstance = arcjet({
  key: process.env.ARCJECT_KEY,
  // set the security rules
  rules: [
    shield({ mode: 'LIVE' }), // 'LIVE' or 'TEST'
    detectBot({
      mode: 'LIVE', // 'LIVE' or 'TEST'
      allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'], // Allow known good bots
    }),
    slidingWindow({
      mode: 'LIVE', // 'LIVE' or 'TEST'
      interval: '2s', // 2 seconds
      max: 5, // max 5 requests
    }),
  ],
});

// Export the configured arcjet instance for use in other parts of the application
export default arcjetInstance;
