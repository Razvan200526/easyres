import * as z from 'zod';

// Base coverletter schema (without relations)
export const coverletterSchema = z.object({
  id: z.string().length(15, 'Coverletter ID must be exactly 15 characters'),
  name: z.string().min(1, 'Coverletter name is required'),
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

// Schema for creating a new coverletter
export const createCoverletterSchema = z.object({
  name: z.string().min(1, 'Coverletter name is required'),
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

// Schema for updating a coverletter
export const updateCoverletterSchema = z.object({
  name: z.string().min(1, 'Coverletter name is required').optional(),
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

// Schema for coverletter upload
export const coverletterUploadSchema = z.object({
  name: z.string().min(1, 'Coverletter name is required'),
  file: z.instanceof(File, { message: 'Valid file is required' }),
});

// Schema for coverletter ID validation
export const coverletterIdSchema = z.object({
  id: z.string().length(15, 'Coverletter ID must be exactly 15 characters'),
});

// Schema for coverletter file validation
export const coverletterFileSchema = z.object({
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
export type CoverletterSchema = z.infer<typeof coverletterSchema>;
export type CreateCoverletterSchema = z.infer<typeof createCoverletterSchema>;
export type UpdateCoverletterSchema = z.infer<typeof updateCoverletterSchema>;
export type CoverletterUploadSchema = z.infer<typeof coverletterUploadSchema>;
export type CoverletterIdSchema = z.infer<typeof coverletterIdSchema>;
export type CoverletterFileSchema = z.infer<typeof coverletterFileSchema>;

// SafeParse functions
export const validateCoverletter = (data: unknown) => {
  return coverletterSchema.safeParse(data);
};

export const validateCreateCoverletter = (data: unknown) => {
  return createCoverletterSchema.safeParse(data);
};

export const validateUpdateCoverletter = (data: unknown) => {
  return updateCoverletterSchema.safeParse(data);
};

export const validateCoverletterUpload = (data: unknown) => {
  return coverletterUploadSchema.safeParse(data);
};

export const validateCoverletterId = (data: unknown) => {
  return coverletterIdSchema.safeParse(data);
};

export const validateCoverletterFile = (data: unknown) => {
  return coverletterFileSchema.safeParse(data);
};

// Helper functions
export const isValidCoverletter = (
  data: unknown,
): data is CoverletterSchema => {
  return coverletterSchema.safeParse(data).success;
};

export const isValidCoverletterFile = (
  data: unknown,
): data is CoverletterFileSchema => {
  return coverletterFileSchema.safeParse(data).success;
};

// Helper to get file extension from filename
export const getCoverletterFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Helper to validate file extension
export const isValidCoverletterFileExtension = (filename: string): boolean => {
  const validExtensions = ['pdf', 'doc', 'docx', 'txt'];
  const extension = getCoverletterFileExtension(filename);
  return validExtensions.includes(extension);
};
