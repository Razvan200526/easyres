import * as z from 'zod';

// Provider ID enum
export const providerIdEnum = z.enum([
  'credential',
  'google',
  'github',
  'discord',
  'facebook',
  'twitter',
]);

// Base user account schema (without relations)
export const userAccountSchema = z.object({
  id: z.string().length(15, 'User account ID must be exactly 15 characters'),
  providerId: z.string().max(50, 'Provider ID must not exceed 50 characters'),
  accountId: z.string().max(255, 'Account ID must not exceed 255 characters'),
  password: z.string().max(255).optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
});

// Schema for creating a new user account with credentials
export const createCredentialAccountSchema = z.object({
  providerId: z.literal('credential'),
  accountId: z.string().email('Account ID must be a valid email').max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(255, 'Password must not exceed 255 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
});

// Schema for creating OAuth account
export const createOAuthAccountSchema = z.object({
  providerId: providerIdEnum.exclude(['credential']),
  accountId: z.string().max(255),
  refreshToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
});

// Schema for updating user account
export const updateUserAccountSchema = z.object({
  refreshToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
});

// Schema for updating password
export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(255, 'Password must not exceed 255 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Schema for checking if account is active
export const isAccountActiveSchema = userAccountSchema
  .pick({ id: true, deletedAt: true })
  .refine(
    (account) => account.deletedAt === null || account.deletedAt === undefined,
    {
      message: 'Account has been deleted',
    },
  );

// Schema for validating OAuth token expiry
export const isTokenValidSchema = userAccountSchema
  .pick({ expiresAt: true, refreshToken: true })
  .refine(
    (account) => {
      if (!account.expiresAt) return true; // No expiry means token doesn't expire
      return account.expiresAt > new Date();
    },
    {
      message: 'OAuth token has expired',
    },
  );

// Schema for user account ID validation
export const userAccountIdSchema = z.object({
  id: z.string().length(15, 'User account ID must be exactly 15 characters'),
});

// Schema for provider validation
export const providerSchema = z.object({
  providerId: providerIdEnum,
});

// Type exports
export type UserAccountSchema = z.infer<typeof userAccountSchema>;
export type CreateCredentialAccountSchema = z.infer<
  typeof createCredentialAccountSchema
>;
export type CreateOAuthAccountSchema = z.infer<typeof createOAuthAccountSchema>;
export type UpdateUserAccountSchema = z.infer<typeof updateUserAccountSchema>;
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
export type UserAccountIdSchema = z.infer<typeof userAccountIdSchema>;
export type ProviderId = z.infer<typeof providerIdEnum>;

// SafeParse functions
export const validateUserAccount = (data: unknown) => {
  return userAccountSchema.safeParse(data);
};

export const validateCreateCredentialAccount = (data: unknown) => {
  return createCredentialAccountSchema.safeParse(data);
};

export const validateCreateOAuthAccount = (data: unknown) => {
  return createOAuthAccountSchema.safeParse(data);
};

export const validateUpdateUserAccount = (data: unknown) => {
  return updateUserAccountSchema.safeParse(data);
};

export const validateUpdatePassword = (data: unknown) => {
  return updatePasswordSchema.safeParse(data);
};

export const validateUserAccountId = (data: unknown) => {
  return userAccountIdSchema.safeParse(data);
};

export const validateAccountIsActive = (data: unknown) => {
  return isAccountActiveSchema.safeParse(data);
};

export const validateTokenIsValid = (data: unknown) => {
  return isTokenValidSchema.safeParse(data);
};

export const validateProvider = (data: unknown) => {
  return providerSchema.safeParse(data);
};

// Helper functions
export const isValidUserAccount = (
  data: unknown,
): data is UserAccountSchema => {
  return userAccountSchema.safeParse(data).success;
};

export const isAccountActive = (data: unknown): boolean => {
  const result = isAccountActiveSchema.safeParse(data);
  return result.success;
};

export const isTokenValid = (data: unknown): boolean => {
  const result = isTokenValidSchema.safeParse(data);
  return result.success;
};

export const isCredentialProvider = (providerId: string): boolean => {
  return providerId === 'credential';
};

export const isOAuthProvider = (providerId: string): boolean => {
  const oauthProviders: ProviderId[] = [
    'google',
    'github',
    'discord',
    'facebook',
    'twitter',
  ];
  return oauthProviders.includes(providerId as ProviderId);
};

// Password strength validator
export const validatePasswordStrength = (
  password: string,
): {
  isStrong: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  if (password.length < 8)
    feedback.push('Password should be at least 8 characters');
  if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters');
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
  if (!/\d/.test(password)) feedback.push('Add numbers');
  if (!/[^a-zA-Z\d]/.test(password))
    feedback.push('Add special characters for extra security');

  return {
    isStrong: score >= 4,
    score,
    feedback,
  };
};
