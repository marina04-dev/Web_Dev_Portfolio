// Utility functions for managing cookies in the application
export const cookies = {
  // Default options for setting cookies
  getOptions: () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'Strict', // Adjust as needed: 'Strict', 'Lax', or 'None'
    maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
  }),
  // Function to set a cookie on the response object
  set: (res, name, value, options = {}) => {
    // Use cookie-parser to set a cookie on the response object with default options merged with any provided options
    res.cookie(name, value, { ...cookies.getOptions(), ...options });
  },
  // Function to clear a cookie from the response object
  clear: (res, name, options = {}) => {
    // Clear a cookie by setting its expiration date to a past date
    res.clearCookie(name, { ...cookies.getOptions(), ...options });
  },
  // Function to retrieve a cookie value from the request object
  get: (req, name) => {
    // Retrieve a cookie value from the request object using cookie-parser
    return req.cookies[name];
  },
};
