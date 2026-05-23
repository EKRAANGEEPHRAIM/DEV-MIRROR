import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email('Invalid email'),
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and _ only'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  fullName: z.string().optional(),
});



export const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});


export const profilSchema = z.object({
  fullName: z.string().max(50).optional(),
  bio: z.string().max(160 , 'Bio max 160 characters').optional(),
  github: z.url('Invalid github url').or(z.literal('')).optional(),
  website: z.url('Invalid website url').or(z.literal('')).optional(),
  skills: z.array(z.string()).optional(),
})

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProfilFormData = z.infer<typeof profilSchema>;