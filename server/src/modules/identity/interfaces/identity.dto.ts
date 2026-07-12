import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  isActive: z.boolean().optional(),
  role: z.enum(['admin', 'user']).optional(),
});

export const listUsersSchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  perPage: z.string().optional().default('20').transform(Number),
  role: z.string().optional(),
  isActive: z.string().optional().transform(v => v === undefined ? undefined : v === 'true'),
});
