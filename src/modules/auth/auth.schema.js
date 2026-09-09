import { z } from 'zod';
import { zodEmail, zodPassword } from '../../shared/utils/index.js';

export const loginSchema = z.object({
  body: z.object({
    email: zodEmail,
    password: zodPassword
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: zodEmail
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: zodPassword,
    token: z.string().optional()
  })
});

