import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { ChatMessageEntity } from '@server/entities/ChatMessageEntity';
import { ChatSessionEntity } from '@server/entities/ChatSessionEntity';
import type { ApiResponse } from '@server/sdk/types';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

@Route('POST', '/api/chat/messages', 'Create a new chat message')
export class CreateChatMessageController {
  private database: PrimaryDatabase;
  constructor() {
    this.database = primaryDatabase;
  }

  async handler(c: Context): Promise<ApiResponse<ChatMessageEntity | null>> {
    try {
      const { sessionId, content, sender } = await c.req.json();

      if (!sessionId || !content || !sender) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Missing required fields: sessionId, content, sender',
            isClientError: true,
          },
          400,
        );
      }

      if (!['user', 'ai'].includes(sender)) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Sender must be either "user" or "ai"',
            isClientError: true,
          },
          400,
        );
      }

      const chatMessageRepo = await this.database.open(ChatMessageEntity);
      const chatSessionRepo = await this.database.open(ChatSessionEntity);

      const newMessage = chatMessageRepo.create({
        chatSession: { id: sessionId },
        content,
        sender,
      });

      const savedMessage = await chatMessageRepo.save(newMessage);

      // Update the session's updatedAt timestamp
      await chatSessionRepo.update(sessionId, { updatedAt: new Date() });

      return apiResponse(c, {
        data: savedMessage,
        message: 'Chat message created successfully',
      });
    } catch (error) {
      console.error('Error creating chat message:', error);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to create chat message',
          isServerError: true,
        },
        500,
      );
    }
  }
}
