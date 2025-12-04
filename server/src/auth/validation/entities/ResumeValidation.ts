import * as z from 'zod';

// Base resume schema (without relations)
export const resumeSchema = z.object({
  id: z.string().length(15, 'Resume ID must be exactly 15 characters'),
  name: z.string().min(1, 'Resume name is required').nullable(),
  filename: z.string().min(1, 'Filename is required'),
  url: z.string().min(1, 'URL is required'),
  filetype: z.string().optional().nullable(),
  filesize: z
    .number()
    .int()
    .positive('File size must be positive')
    .optional()
    .nullable(),
  uploadedAt: z.coerce.date(),
});

// Schema for creating a new resume
export const createResumeSchema = z.object({
  name: z.string().min(1, 'Resume name is required').nullable(),
  filename: z.string().min(1, 'Filename is required'),
  url: z.string().min(1, 'URL is required'),
  filetype: z.string().optional().nullable(),
  filesize: z
    .number()
    .int()
    .positive('File size must be positive')
    .optional()
    .nullable(),
});

// Schema for updating a resume
export const updateResumeSchema = z.object({
  name: z.string().min(1, 'Resume name is required').optional().nullable(),
  filename: z.string().min(1, 'Filename is required').optional(),
  url: z.string().min(1, 'URL is required').optional(),
  filetype: z.string().optional().nullable(),
  filesize: z
    .number()
    .int()
    .positive('File size must be positive')
    .optional()
    .nullable(),
});

// Schema for resume upload
export const resumeUploadSchema = z.object({
  name: z.string().min(1, 'Resume name is required'),
  file: z.instanceof(File, { message: 'Valid file is required' }),
});

// Schema for resume ID validation
export const resumeIdSchema = z.object({
  id: z.string().length(15, 'Resume ID must be exactly 15 characters'),
});

// Schema for resume file validation
export const resumeFileSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  filetype: z.string().refine(
    (type) => {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];
      return allowedTypes.includes(type);
    },
    { message: 'File type must be PDF, DOC, DOCX, or TXT' },
  ),
  filesize: z
    .number()
    .int()
    .positive()
    .max(10 * 1024 * 1024, 'File size must not exceed 10MB'),
});

// Type exports
export type ResumeSchema = z.infer<typeof resumeSchema>;
export type CreateResumeSchema = z.infer<typeof createResumeSchema>;
export type UpdateResumeSchema = z.infer<typeof updateResumeSchema>;
export type ResumeUploadSchema = z.infer<typeof resumeUploadSchema>;
export type ResumeIdSchema = z.infer<typeof resumeIdSchema>;
export type ResumeFileSchema = z.infer<typeof resumeFileSchema>;

// SafeParse functions
export const validateResume = (data: unknown) => {
  return resumeSchema.safeParse(data);
};

export const validateCreateResume = (data: unknown) => {
  return createResumeSchema.safeParse(data);
};

export const validateUpdateResume = (data: unknown) => {
  return updateResumeSchema.safeParse(data);
};

export const validateResumeUpload = (data: unknown) => {
  return resumeUploadSchema.safeParse(data);
};

export const validateResumeId = (data: unknown) => {
  return resumeIdSchema.safeParse(data);
};

export const validateResumeFile = (data: unknown) => {
  return resumeFileSchema.safeParse(data);
};

// Helper functions
export const isValidResume = (data: unknown): data is ResumeSchema => {
  return resumeSchema.safeParse(data).success;
};

export const isValidResumeFile = (data: unknown): data is ResumeFileSchema => {
  return resumeFileSchema.safeParse(data).success;
};

// Helper to get file extension from filename
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};
