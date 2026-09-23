// Import z from 'zod';
import { z } from 'zod';

// Define and export the sign-up validation schema
export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(255, 'Name must be at most 255 characters long')
    .trim(),
  email: z
    .email('Invalid email address')
    .max(255, 'Email must be at most 255 characters long')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password must be at most 128 characters long'),
  role: z.enum(['user', 'admin']).optional(),
});

// Define and export the sign-in validation schema
export const signInSchema = z.object({
  email: z.email('Invalid email address').toLowerCase().trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password must be at most 128 characters long'),
});
