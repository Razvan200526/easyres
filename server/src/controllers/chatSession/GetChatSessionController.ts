import { Route } from '@server/decorators/Route';
import { ChatSessionEntity } from '@server/entities/ChatSessionEntity';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

@Route('GET', '/api/chat/sessions/:userId', 'Get all chat sessions for user')
export class GetChatSessionsController {
  private database: PrimaryDatabase;
  constructor() {
    this.database = primaryDatabase;
  }

  async handler(c: Context) {
    try {
      const userId = c.req.param('userId');
      if (!userId) {
        return c.json(
          {
            success: false,
            message: 'User ID is required',
          },
          400,
        );
      }

      const chatSessionRepo = await this.database.open(ChatSessionEntity);

      // First, try to get sessions without relations to avoid the error
      const sessions = await chatSessionRepo.find({
        where: { user: { id: userId } },
        order: { updatedAt: 'DESC' },
      });

      // If there are no sessions, return empty array
      if (!sessions || sessions.length === 0) {
        return c.json({
          success: true,
          data: [],
        });
      }

      // Now get sessions with messages
      const sessionsWithMessages = await chatSessionRepo.find({
        where: { user: { id: userId } },
        relations: ['messages'],
        order: { updatedAt: 'DESC' },
      });

      // Transform sessions to include summary data
      const sessionsWithSummary = sessionsWithMessages.map((session) => ({
        ...session,
        messageCount: session.messages?.length || 0,
        lastMessage:
          session.messages?.[session.messages.length - 1]?.content || '',
        lastMessageAt:
          session.messages?.[session.messages.length - 1]?.timestamp ||
          session.updatedAt,
      }));

      return c.json({
        success: true,
        data: sessionsWithSummary,
      });
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      return c.json(
        {
          success: false,
          message: 'Failed to fetch chat sessions',
          data: [],
        },
        500,
      );
    }
  }
}
