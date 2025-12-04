import { Route } from '@server/decorators/Route';
import { userSessionRepository } from '@server/repositories/UserSessionRepository';
import type { Context } from 'hono';

@Route('GET', '/api/auth/user-sessions/:id', 'Retrieve User Sessions')
export class RetrieveUserSessionsControlle {
  private readonly userSessionRepository;
  constructor() {
    this.userSessionRepository = userSessionRepository;
  }
  async handler(c: Context) {
    const id = c.req.param('id');
    const session = await this.userSessionRepository.findOneOrFail(id);

    return c.json(session);
  }
}
