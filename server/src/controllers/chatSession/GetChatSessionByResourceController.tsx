import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { ChatSessionEntity } from '@server/entities/ChatSessionEntity';
import type { ApiResponse } from '@server/sdk/types';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

@Route(
  'GET',
  '/api/chat/sessions/resource/:resourceType/:resourceId',
  'Get chat session by resource',
)
export class GetChatSessionByResourceController {
  private database: PrimaryDatabase;
  constructor() {
    this.database = primaryDatabase;
  }

  async handler(c: Context): Promise<ApiResponse<ChatSessionEntity | null>> {
    try {
      const userId = c.get('userId');
      if (!userId) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Unauthorized',
            isUnauthorized: true,
          },
          401,
        );
      }

      const resourceType = c.req.param('resourceType');
      const resourceId = c.req.param('resourceId');

      if (!resourceType || !resourceId) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Resource type and ID are required',
            isClientError: true,
          },
          400,
        );
      }

      const chatSessionRepo = await this.database.open(ChatSessionEntity);
      const session = await chatSessionRepo.findOne({
        where: {
          user: { id: userId },
          resourceType: resourceType as 'resume' | 'coverletter',
          resourceId,
        },
        relations: ['messages'],
        order: { updatedAt: 'DESC' },
      });

      return apiResponse(c, {
        data: session,
        message: session ? 'Chat session found' : 'No chat session found',
      });
    } catch (error) {
      console.error('Error fetching chat session by resource:', error);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to fetch chat session',
          isServerError: true,
        },
        500,
      );
    }
  }
}
