import * as z from 'zod';

// Sender enum
export const senderEnum = z.enum(['user', 'ai']);

// Base chat message schema (without relations)
export const chatMessageSchema = z.object({
  id: z.string().length(15, 'Chat message ID must be exactly 15 characters'),
  content: z.string().min(1, 'Message content is required'),
  sender: senderEnum,
  timestamp: z.coerce.date(),
});

// Schema for creating a new chat message
export const createChatMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message content is required')
    .max(10000, 'Message content must not exceed 10000 characters'),
  sender: senderEnum,
  chatSessionId: z
    .string()
    .length(15, 'Chat session ID must be exactly 15 characters'),
});

// Schema for chat message with session reference
export const chatMessageWithSessionSchema = chatMessageSchema.extend({
  chatSessionId: z
    .string()
    .length(15, 'Chat session ID must be exactly 15 characters'),
});

// Schema for chat message ID validation
export const chatMessageIdSchema = z.object({
  id: z.string().length(15, 'Chat message ID must be exactly 15 characters'),
});

// Schema for validating message content only
export const messageContentSchema = z.object({
  content: z
    .string()
    .min(1, 'Message content is required')
    .max(10000, 'Message content must not exceed 10000 characters'),
});

// Schema for bulk message validation
export const bulkChatMessagesSchema = z.array(chatMessageSchema);

// Type exports
export type ChatMessageSchema = z.infer<typeof chatMessageSchema>;
export type CreateChatMessageSchema = z.infer<typeof createChatMessageSchema>;
export type ChatMessageWithSessionSchema = z.infer<
  typeof chatMessageWithSessionSchema
>;
export type ChatMessageIdSchema = z.infer<typeof chatMessageIdSchema>;
export type MessageContentSchema = z.infer<typeof messageContentSchema>;
export type Sender = z.infer<typeof senderEnum>;

// SafeParse functions
export const validateChatMessage = (data: unknown) => {
  return chatMessageSchema.safeParse(data);
};

export const validateCreateChatMessage = (data: unknown) => {
  return createChatMessageSchema.safeParse(data);
};

export const validateChatMessageWithSession = (data: unknown) => {
  return chatMessageWithSessionSchema.safeParse(data);
};

export const validateChatMessageId = (data: unknown) => {
  return chatMessageIdSchema.safeParse(data);
};

export const validateMessageContent = (data: unknown) => {
  return messageContentSchema.safeParse(data);
};

export const validateBulkChatMessages = (data: unknown) => {
  return bulkChatMessagesSchema.safeParse(data);
};

// Helper functions
export const isValidChatMessage = (
  data: unknown,
): data is ChatMessageSchema => {
  return chatMessageSchema.safeParse(data).success;
};

export const isValidSender = (sender: unknown): sender is Sender => {
  return senderEnum.safeParse(sender).success;
};

// Helper to validate message length
export const isValidMessageLength = (content: string): boolean => {
  return content.length > 0 && content.length <= 10000;
};

// Helper to sanitize message content (basic HTML stripping)
export const sanitizeMessageContent = (content: string): string => {
  return content.replace(/<[^>]*>/g, '').trim();
};
