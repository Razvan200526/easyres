import { Route } from '@server/decorators/Route';
import { ChatSessionEntity } from '@server/entities/ChatSessionEntity';
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

  async handler(c: Context) {
    try {
      const userId = c.get('userId');
      if (!userId) {
        return c.json(
          {
            success: false,
            message: 'Unauthorized',
          },
          401,
        );
      }

      const resourceType = c.req.param('resourceType');
      const resourceId = c.req.param('resourceId');

      if (!resourceType || !resourceId) {
        return c.json(
          {
            success: false,
            message: 'Resource type and ID are required',
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

      return c.json({
        success: true,
        data: session,
      });
    } catch (error) {
      console.error('Error fetching chat session by resource:', error);
      return c.json(
        {
          success: false,
          message: 'Failed to fetch chat session',
        },
        500,
      );
    }
  }
}
