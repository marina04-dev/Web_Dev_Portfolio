// Utility function to format validation errors from Zod
export const formatValidationErrors = errors => {
  // Check if errors is defined and has issues property
  if (!errors || !errors.issues) return 'Unknown error format';

  // Check if errors.issues is not an array
  if (Array.isArray(errors.issues) === false) {
    // If issues is not an array, return a generic error message
    return errors.issues.map(issue => issue.message).join(', ');
  }

  // return formatted errors as a JSON string
  return JSON.stringify(errors);
};
