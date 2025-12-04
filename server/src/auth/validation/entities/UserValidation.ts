import * as z from 'zod';

// Base user schema (without relations)
export const userSchema = z.object({
  id: z.string().length(15, 'User ID must be exactly 15 characters'),
  email: z.string().email('Invalid email format').max(255),
  name: z.string().min(1, 'Name is required').max(200),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  isEmailVerified: z.boolean().default(false),
  image: z.string().url('Invalid image URL').optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  lockedAt: z.coerce.date().optional().nullable(),
  blockedAt: z.coerce.date().optional().nullable(),
});

// Schema for creating a new user (minimal required fields)
export const createUserSchema = z
  .object({
    email: z.string().email('Invalid email format').max(255),
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    name: z.string().min(1, 'Name is required').max(200).optional(),
    image: z.string().url('Invalid image URL').optional().nullable(),
  })
  .transform((data) => ({
    ...data,
    name: data.name || `${data.firstName} ${data.lastName}`,
  }));

// Schema for updating a user
export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').max(255).optional(),
  firstName: z.string().min(1, 'First name is required').max(100).optional(),
  lastName: z.string().min(1, 'Last name is required').max(100).optional(),
  name: z.string().min(1, 'Name is required').max(200).optional(),
  image: z.string().url('Invalid image URL').optional().nullable(),
  isEmailVerified: z.boolean().optional(),
});

// Schema for checking if user is active (not deleted, locked, or blocked)
export const isUserActiveSchema = userSchema
  .pick({ id: true, deletedAt: true, lockedAt: true, blockedAt: true })
  .refine((user) => user.deletedAt === null || user.deletedAt === undefined, {
    message: 'User has been deleted',
  })
  .refine((user) => user.lockedAt === null || user.lockedAt === undefined, {
    message: 'User account is locked',
  })
  .refine((user) => user.blockedAt === null || user.blockedAt === undefined, {
    message: 'User account is blocked',
  });

// Schema for user ID validation
export const userIdSchema = z.object({
  id: z.string().length(15, 'User ID must be exactly 15 characters'),
});

// Type exports
export type UserSchema = z.infer<typeof userSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type UserIdSchema = z.infer<typeof userIdSchema>;

// SafeParse functions
export const validateUser = (data: unknown) => {
  return userSchema.safeParse(data);
};

export const validateCreateUser = (data: unknown) => {
  return createUserSchema.safeParse(data);
};

export const validateUpdateUser = (data: unknown) => {
  return updateUserSchema.safeParse(data);
};

export const validateUserId = (data: unknown) => {
  return userIdSchema.safeParse(data);
};

export const validateUserIsActive = (data: unknown) => {
  return isUserActiveSchema.safeParse(data);
};

// Helper function to check if user data is valid
export const isValidUser = (data: unknown): data is UserSchema => {
  return userSchema.safeParse(data).success;
};

export const isUserActive = (data: unknown): boolean => {
  const result = isUserActiveSchema.safeParse(data);
  return result.success;
};
