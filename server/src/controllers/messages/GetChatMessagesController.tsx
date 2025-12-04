import { Route } from '@server/decorators/Route';
import { ChatMessageEntity } from '@server/entities/ChatMessageEntity';
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

  async handler(c: Context) {
    try {
      const sessionId = c.req.param('sessionId');
      if (!sessionId) {
        return c.json(
          {
            success: false,
            message: 'Session ID is required',
          },
          400,
        );
      }

      const chatMessageRepo = await this.database.open(ChatMessageEntity);
      const messages = await chatMessageRepo.find({
        where: { chatSession: { id: sessionId } },
        order: { timestamp: 'ASC' },
      });

      return c.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return c.json(
        {
          success: false,
          message: 'Failed to fetch chat messages',
        },
        500,
      );
    }
  }
}
