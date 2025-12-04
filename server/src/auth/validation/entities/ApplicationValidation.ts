import * as z from 'zod';

// Application status enum
export const applicationStatusEnum = z.enum([
  'applied',
  'interviewing',
  'accepted',
  'rejected',
]);

// Platform enum
export const platformEnum = z.enum(['linkedin', 'glassdoor', 'other']);

// Base application schema (without relations)
export const applicationSchema = z.object({
  id: z.string().length(15, 'Application ID must be exactly 15 characters'),
  employer: z.string().min(1, 'Employer is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobUrl: z.string().url('Invalid job URL').optional().nullable(),
  salaryRange: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  location: z.string().min(1, 'Location is required'),
  platform: platformEnum.default('other'),
  status: applicationStatusEnum.default('applied'),
  comments: z.array(z.string()).default([]),
  suggestions: z.array(z.string()).default([]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  lockedAt: z.coerce.date().optional().nullable(),
  blockedAt: z.coerce.date().optional().nullable(),
});

// Schema for creating a new application
export const createApplicationSchema = z.object({
  employer: z.string().min(1, 'Employer is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobUrl: z.string().url('Invalid job URL').optional().nullable(),
  salaryRange: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  location: z.string().min(1, 'Location is required'),
  platform: platformEnum.default('other'),
  status: applicationStatusEnum.default('applied'),
  comments: z.array(z.string()).default([]),
  suggestions: z.array(z.string()).default([]),
  resumeId: z.string().length(15).optional().nullable(),
  coverletterId: z.string().length(15).optional().nullable(),
});

// Schema for updating an application
export const updateApplicationSchema = z.object({
  employer: z.string().min(1, 'Employer is required').optional(),
  jobTitle: z.string().min(1, 'Job title is required').optional(),
  jobUrl: z.string().url('Invalid job URL').optional().nullable(),
  salaryRange: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  location: z.string().min(1, 'Location is required').optional(),
  platform: platformEnum.optional(),
  status: applicationStatusEnum.optional(),
  comments: z.array(z.string()).optional(),
  suggestions: z.array(z.string()).optional(),
  resumeId: z.string().length(15).optional().nullable(),
  coverletterId: z.string().length(15).optional().nullable(),
});

// Schema for updating application status
export const updateApplicationStatusSchema = z.object({
  status: applicationStatusEnum,
});

// Schema for checking if application is active
export const isApplicationActiveSchema = applicationSchema
  .pick({ id: true, deletedAt: true, lockedAt: true, blockedAt: true })
  .refine((app) => app.deletedAt === null || app.deletedAt === undefined, {
    message: 'Application has been deleted',
  })
  .refine((app) => app.lockedAt === null || app.lockedAt === undefined, {
    message: 'Application is locked',
  })
  .refine((app) => app.blockedAt === null || app.blockedAt === undefined, {
    message: 'Application is blocked',
  });

// Schema for application ID validation
export const applicationIdSchema = z.object({
  id: z.string().length(15, 'Application ID must be exactly 15 characters'),
});

// Type exports
export type ApplicationSchema = z.infer<typeof applicationSchema>;
export type CreateApplicationSchema = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationSchema = z.infer<typeof updateApplicationSchema>;
export type UpdateApplicationStatusSchema = z.infer<
  typeof updateApplicationStatusSchema
>;
export type ApplicationIdSchema = z.infer<typeof applicationIdSchema>;
export type ApplicationStatus = z.infer<typeof applicationStatusEnum>;
export type Platform = z.infer<typeof platformEnum>;

// SafeParse functions
export const validateApplication = (data: unknown) => {
  return applicationSchema.safeParse(data);
};

export const validateCreateApplication = (data: unknown) => {
  return createApplicationSchema.safeParse(data);
};

export const validateUpdateApplication = (data: unknown) => {
  return updateApplicationSchema.safeParse(data);
};

export const validateUpdateApplicationStatus = (data: unknown) => {
  return updateApplicationStatusSchema.safeParse(data);
};

export const validateApplicationId = (data: unknown) => {
  return applicationIdSchema.safeParse(data);
};

export const validateApplicationIsActive = (data: unknown) => {
  return isApplicationActiveSchema.safeParse(data);
};

// Helper functions
export const isValidApplication = (
  data: unknown,
): data is ApplicationSchema => {
  return applicationSchema.safeParse(data).success;
};

export const isApplicationActive = (data: unknown): boolean => {
  const result = isApplicationActiveSchema.safeParse(data);
  return result.success;
};

// Helper to check if status transition is valid
export const isValidStatusTransition = (
  currentStatus: ApplicationStatus,
  newStatus: ApplicationStatus,
): boolean => {
  // Define valid transitions
  const validTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
    applied: ['interviewing', 'rejected'],
    interviewing: ['accepted', 'rejected'],
    accepted: [],
    rejected: [],
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
};
