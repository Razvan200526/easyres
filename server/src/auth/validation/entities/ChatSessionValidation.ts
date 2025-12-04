import * as z from 'zod';

// Resource type enum
export const resourceTypeEnum = z.enum(['resume', 'coverletter']);

// Base chat session schema (without relations)
export const chatSessionSchema = z.object({
  id: z.string().length(15, 'Chat session ID must be exactly 15 characters'),
  resourceType: resourceTypeEnum,
  resourceId: z
    .string()
    .length(15, 'Resource ID must be exactly 15 characters'),
  resourceName: z.string().min(1, 'Resource name is required').max(255),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional().nullable(),
});

// Schema for creating a new chat session
export const createChatSessionSchema = z.object({
  resourceType: resourceTypeEnum,
  resourceId: z
    .string()
    .length(15, 'Resource ID must be exactly 15 characters'),
  resourceName: z.string().min(1, 'Resource name is required').max(255),
});

// Schema for updating a chat session
export const updateChatSessionSchema = z.object({
  resourceName: z
    .string()
    .min(1, 'Resource name is required')
    .max(255)
    .optional(),
});

// Schema for chat session ID validation
export const chatSessionIdSchema = z.object({
  id: z.string().length(15, 'Chat session ID must be exactly 15 characters'),
});

// Schema for validating resource reference
export const resourceReferenceSchema = z.object({
  resourceType: resourceTypeEnum,
  resourceId: z
    .string()
    .length(15, 'Resource ID must be exactly 15 characters'),
});

// Type exports
export type ChatSessionSchema = z.infer<typeof chatSessionSchema>;
export type CreateChatSessionSchema = z.infer<typeof createChatSessionSchema>;
export type UpdateChatSessionSchema = z.infer<typeof updateChatSessionSchema>;
export type ChatSessionIdSchema = z.infer<typeof chatSessionIdSchema>;
export type ResourceType = z.infer<typeof resourceTypeEnum>;
export type ResourceReferenceSchema = z.infer<typeof resourceReferenceSchema>;

// SafeParse functions
export const validateChatSession = (data: unknown) => {
  return chatSessionSchema.safeParse(data);
};

export const validateCreateChatSession = (data: unknown) => {
  return createChatSessionSchema.safeParse(data);
};

export const validateUpdateChatSession = (data: unknown) => {
  return updateChatSessionSchema.safeParse(data);
};

export const validateChatSessionId = (data: unknown) => {
  return chatSessionIdSchema.safeParse(data);
};

export const validateResourceReference = (data: unknown) => {
  return resourceReferenceSchema.safeParse(data);
};

// Helper functions
export const isValidChatSession = (
  data: unknown,
): data is ChatSessionSchema => {
  return chatSessionSchema.safeParse(data).success;
};

export const isValidResourceType = (type: unknown): type is ResourceType => {
  return resourceTypeEnum.safeParse(type).success;
};

// Helper to validate if a resource ID matches its type
export const validateResourceMatch = (resourceId: string): boolean => {
  // Both resume and coverletter IDs should be 15 characters
  return resourceId.length === 15;
};
