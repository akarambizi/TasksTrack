import { z } from 'zod';

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

// Auth result schema
export const authResultSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: authDataSchema.optional(),
  errors: z.array(z.string()).optional(),
});

// Export types
export type IAuthData = z.infer<typeof authDataSchema>;
export type IAuthResult = z.infer<typeof authResultSchema>;
