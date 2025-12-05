import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import type { UserSessionEntity } from '@server/entities';
import { userSessionRepository } from '@server/repositories/UserSessionRepository';
import type { ApiResponse } from '@server/sdk/types';
import type { Context } from 'hono';

@Route('GET', '/api/auth/user-sessions/:id', 'Retrieve User Sessions')
export class RetrieveUserSessionsController {
  private readonly userSessionRepository;
  constructor() {
    this.userSessionRepository = userSessionRepository;
  }
  async handler(c: Context): Promise<ApiResponse<UserSessionEntity | null>> {
    const id = c.req.param('id');
    const session = await this.userSessionRepository.findOneOrFail(id);

    return apiResponse(c, { data: session, success: true });
  }
}
