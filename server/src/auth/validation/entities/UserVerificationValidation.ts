import * as z from 'zod';

// Base user verification schema (without relations)
export const userVerificationSchema = z.object({
  id: z.string().length(15, 'Verification ID must be exactly 15 characters'),
  identifier: z
    .string()
    .max(255, 'Identifier must not exceed 255 characters')
    .min(1, 'Identifier is required'),
  value: z
    .string()
    .max(255, 'Verification value must not exceed 255 characters')
    .min(1, 'Verification value is required'),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
});

// Schema for creating a new verification
export const createUserVerificationSchema = z.object({
  identifier: z
    .string()
    .max(255, 'Identifier must not exceed 255 characters')
    .min(1, 'Identifier is required'),
  value: z
    .string()
    .max(255, 'Verification value must not exceed 255 characters')
    .min(1, 'Verification value is required'),
  expiresAt: z.coerce.date(),
});

// Schema for email verification
export const createEmailVerificationSchema = z.object({
  identifier: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must not exceed 255 characters'),
  value: z
    .string()
    .length(6, 'Verification code must be exactly 6 characters')
    .regex(/^\d{6}$/, 'Verification code must be 6 digits'),
  expiresAt: z.coerce.date(),
});

// Schema for verifying a code
export const verifyCodeSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  code: z
    .string()
    .length(6, 'Verification code must be exactly 6 characters')
    .regex(/^\d{6}$/, 'Verification code must be 6 digits'),
});

// Schema for checking if verification is expired
export const isVerificationValidSchema = userVerificationSchema
  .pick({ id: true, expiresAt: true, deletedAt: true })
  .refine(
    (verification) =>
      verification.deletedAt === null || verification.deletedAt === undefined,
    {
      message: 'Verification has been deleted',
    },
  )
  .refine((verification) => verification.expiresAt > new Date(), {
    message: 'Verification has expired',
  });

// Schema for user verification ID validation
export const userVerificationIdSchema = z.object({
  id: z.string().length(15, 'Verification ID must be exactly 15 characters'),
});

// Schema for resending verification
export const resendVerificationSchema = z.object({
  identifier: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must not exceed 255 characters'),
});

// Type exports
export type UserVerificationSchema = z.infer<typeof userVerificationSchema>;
export type CreateUserVerificationSchema = z.infer<
  typeof createUserVerificationSchema
>;
export type CreateEmailVerificationSchema = z.infer<
  typeof createEmailVerificationSchema
>;
export type VerifyCodeSchema = z.infer<typeof verifyCodeSchema>;
export type UserVerificationIdSchema = z.infer<typeof userVerificationIdSchema>;
export type ResendVerificationSchema = z.infer<typeof resendVerificationSchema>;

// SafeParse functions
export const validateUserVerification = (data: unknown) => {
  return userVerificationSchema.safeParse(data);
};

export const validateCreateUserVerification = (data: unknown) => {
  return createUserVerificationSchema.safeParse(data);
};

export const validateCreateEmailVerification = (data: unknown) => {
  return createEmailVerificationSchema.safeParse(data);
};

export const validateVerifyCode = (data: unknown) => {
  return verifyCodeSchema.safeParse(data);
};

export const validateUserVerificationId = (data: unknown) => {
  return userVerificationIdSchema.safeParse(data);
};

export const validateVerificationIsValid = (data: unknown) => {
  return isVerificationValidSchema.safeParse(data);
};

export const validateResendVerification = (data: unknown) => {
  return resendVerificationSchema.safeParse(data);
};

// Helper functions
export const isValidUserVerification = (
  data: unknown,
): data is UserVerificationSchema => {
  return userVerificationSchema.safeParse(data).success;
};

export const isVerificationValid = (data: unknown): boolean => {
  const result = isVerificationValidSchema.safeParse(data);
  return result.success;
};

export const isVerificationExpired = (expiresAt: Date): boolean => {
  return expiresAt <= new Date();
};

// Helper to generate a random 6-digit code
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper to calculate expiry time (default: 1 hour from now)
export const calculateExpiryTime = (minutes = 60): Date => {
  const now = new Date();
  return new Date(now.getTime() + minutes * 60000);
};

// Helper to check if verification can be resent (rate limiting)
export const canResendVerification = (
  lastSentAt: Date,
  cooldownMinutes = 1,
): boolean => {
  const now = new Date();
  const timeSinceLastSent = now.getTime() - lastSentAt.getTime();
  const cooldownMs = cooldownMinutes * 60000;
  return timeSinceLastSent >= cooldownMs;
};

// Helper to validate verification code format
export const isValidVerificationCodeFormat = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};
