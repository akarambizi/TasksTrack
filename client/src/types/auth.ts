import { z } from 'zod';

// Base auth form validation schema (used for login, register, and reset password)
export const authFormSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email is too long'),

  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
});

// Auth data schema
export const authDataSchema = z.object({
  user: z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string().optional(),
  }),
  token: z.string(),
  refreshToken: z.string().optional(),
});

// Auth result schema - updated to match actual API response structure
export const authResultSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  token: z.string().optional(), // Token directly on response for successful login
  refreshToken: z.string().optional(),
  tokenExpiry: z.string().optional(),
  user: z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string().optional(),
  }).optional(),
  data: authDataSchema.optional(), // Include authDataSchema for nested data structure
  errors: z.array(z.string()).optional(),
});

// Export form type
export type IAuthFormData = z.infer<typeof authFormSchema>;

// Export auth types
export type IAuthResult = z.infer<typeof authResultSchema>;
