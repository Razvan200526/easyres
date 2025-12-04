import * as z from 'zod';

// Base session schema (without relations)
export const sessionSchema = z.object({
  id: z.string().length(15, 'Session ID must be exactly 15 characters'),
  token: z.string().max(255, 'Token must not exceed 255 characters'),
  expiresAt: z.coerce.date(),
  ipAddress: z.ipv6().max(45).optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
});

// Schema for creating a new session
export const createSessionSchema = z.object({
  token: z.string().max(255, 'Token must not exceed 255 characters'),
  expiresAt: z.coerce.date(),
  ipAddress: z.ipv6().max(45).optional().nullable(),
  userAgent: z.string().optional().nullable(),
});

// Schema for updating a session
export const updateSessionSchema = z.object({
  expiresAt: z.coerce.date().optional(),
  ipAddress: z.ipv6().max(45).optional().nullable(),
  userAgent: z.string().optional().nullable(),
});

// Schema for validating just the essential fields (e.g., from request)
export const sessionValidationSchema = z.object({
  id: z.string().length(15),
  token: z.string().min(1, 'Token is required'),
});

// Schema for checking if session is valid and not expired
export const isSessionValidSchema = sessionSchema
  .pick({ id: true, expiresAt: true, deletedAt: true })
  .refine(
    (session) => session.deletedAt === null || session.deletedAt === undefined,
    { message: 'Session has been deleted' },
  )
  .refine((session) => session.expiresAt > new Date(), {
    message: 'Session has expired',
  });

// Schema for session ID validation
export const sessionIdSchema = z.object({
  id: z.string().length(15, 'Session ID must be exactly 15 characters'),
});

// Type exports
export type SessionSchema = z.infer<typeof sessionSchema>;
export type CreateSessionSchema = z.infer<typeof createSessionSchema>;
export type UpdateSessionSchema = z.infer<typeof updateSessionSchema>;
export type SessionValidation = z.infer<typeof sessionValidationSchema>;
export type SessionValidCheck = z.infer<typeof isSessionValidSchema>;
export type SessionIdSchema = z.infer<typeof sessionIdSchema>;

// SafeParse functions
export const validateSession = (data: unknown) => {
  return sessionSchema.safeParse(data);
};

export const validateCreateSession = (data: unknown) => {
  return createSessionSchema.safeParse(data);
};

export const validateUpdateSession = (data: unknown) => {
  return updateSessionSchema.safeParse(data);
};

export const validateSessionValidation = (data: unknown) => {
  return sessionValidationSchema.safeParse(data);
};

export const validateSessionIsValid = (data: unknown) => {
  return isSessionValidSchema.safeParse(data);
};

export const validateSessionId = (data: unknown) => {
  return sessionIdSchema.safeParse(data);
};

// Helper functions
export const isValidSession = (data: unknown): data is SessionSchema => {
  return sessionSchema.safeParse(data).success;
};

export const isSessionValid = (data: unknown): boolean => {
  const result = isSessionValidSchema.safeParse(data);
  return result.success;
};

export const isSessionExpired = (expiresAt: Date): boolean => {
  return expiresAt <= new Date();
};

// Helper to calculate session expiry (default: 7 days from now)
export const calculateSessionExpiry = (days = 7): Date => {
  const now = new Date();
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
};

// Helper to extend session expiry
export const extendSessionExpiry = (
  currentExpiresAt: Date,
  extensionDays = 7,
): Date => {
  return new Date(
    currentExpiresAt.getTime() + extensionDays * 24 * 60 * 60 * 1000,
  );
};
