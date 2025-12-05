import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { ChatSessionEntity } from '@server/entities/ChatSessionEntity';
import type { ApiResponse } from '@server/sdk/types';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

type ChatSessionWithSummary = ChatSessionEntity & {
  messageCount: number;
  lastMessage: string;
  lastMessageAt: Date | null | undefined;
};

@Route('GET', '/api/chat/sessions/:userId', 'Get all chat sessions for user')
export class GetChatSessionsController {
  private database: PrimaryDatabase;
  constructor() {
    this.database = primaryDatabase;
  }

  async handler(c: Context): Promise<ApiResponse<ChatSessionWithSummary[]>> {
    try {
      const userId = c.req.param('userId');
      if (!userId) {
        return apiResponse(
          c,
          {
            data: [],
            message: 'User ID is required',
            isClientError: true,
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
        return apiResponse(c, {
          data: [],
          message: 'No chat sessions found',
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

      return apiResponse(c, {
        data: sessionsWithSummary,
        message: 'Chat sessions retrieved successfully',
      });
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      return apiResponse(
        c,
        {
          data: [],
          message: 'Failed to fetch chat sessions',
          isServerError: true,
        },
        500,
      );
    }
  }
}
