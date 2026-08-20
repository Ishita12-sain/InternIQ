import { z } from 'zod';
import { UserRole } from '../types/user.types';

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(100, { message: 'Name cannot exceed 100 characters' }),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Please provide a valid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter (A-Z)' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter (a-z)' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number (0-9)' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one special character (e.g. @, #, $, %, !)',
    }),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({
      message: 'Invalid role. Allowed roles are: STUDENT, COMPANY, FACULTY, TNP, ADMIN',
    }),
  }),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Please provide a valid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, { message: 'Password is required' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
