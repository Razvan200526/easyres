import { Route } from '@server/decorators/Route';
import { ChatSessionEntity } from '@server/entities/ChatSessionEntity';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

@Route('POST', '/api/chat/sessions', 'Create a new chat session')
export class CreateChatSessionController {
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

      const { resourceType, resourceId, resourceName } = await c.req.json();

      if (!resourceType || !resourceId || !resourceName) {
        return c.json(
          {
            success: false,
            message:
              'Missing required fields: resourceType, resourceId, resourceName',
          },
          400,
        );
      }

      const chatSessionRepo = await this.database.open(ChatSessionEntity);

      const newSession = chatSessionRepo.create({
        user: { id: userId },
        resourceType,
        resourceId,
        resourceName,
      });

      const savedSession = await chatSessionRepo.save(newSession);

      return c.json({
        success: true,
        data: savedSession,
      });
    } catch (error) {
      console.error('Error creating chat session:', error);
      return c.json(
        {
          success: false,
          message: 'Failed to create chat session',
        },
        500,
      );
    }
  }
}
