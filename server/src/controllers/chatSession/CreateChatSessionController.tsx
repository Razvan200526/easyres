import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { ChatSessionEntity } from '@server/entities/ChatSessionEntity';
import type { ApiResponse } from '@server/sdk/types';
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

      const { resourceType, resourceId, resourceName } = await c.req.json();

      if (!resourceType || !resourceId || !resourceName) {
        return apiResponse(
          c,
          {
            data: null,
            message:
              'Missing required fields: resourceType, resourceId, resourceName',
            isClientError: true,
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

      return apiResponse(c, {
        data: savedSession,
        message: 'Chat session created successfully',
      });
    } catch (error) {
      console.error('Error creating chat session:', error);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to create chat session',
          isServerError: true,
        },
        500,
      );
    }
  }
}
