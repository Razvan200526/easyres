import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { ChatMessageEntity } from '@server/entities/ChatMessageEntity';
import type { ApiResponse } from '@server/sdk/types';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

@Route(
  'GET',
  '/api/chat/messages/:sessionId',
  'Get all messages for a chat session',
)
export class GetChatMessagesController {
  private database: PrimaryDatabase;
  constructor() {
    this.database = primaryDatabase;
  }

  async handler(c: Context): Promise<ApiResponse<ChatMessageEntity[]>> {
    try {
      const sessionId = c.req.param('sessionId');
      if (!sessionId) {
        return apiResponse(
          c,
          {
            data: [],
            message: 'Session ID is required',
            isClientError: true,
          },
          400,
        );
      }

      const chatMessageRepo = await this.database.open(ChatMessageEntity);
      const messages = await chatMessageRepo.find({
        where: { chatSession: { id: sessionId } },
        order: { timestamp: 'ASC' },
      });

      return apiResponse(c, {
        data: messages,
        message: 'Chat messages retrieved successfully',
      });
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return apiResponse(
        c,
        {
          data: [],
          message: 'Failed to fetch chat messages',
          isServerError: true,
        },
        500,
      );
    }
  }
}
