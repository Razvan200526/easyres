import { Route } from '@server/decorators/Route';
import type { Context } from 'hono';
import { retrieveCurrentUserService } from '../services/RetrieveCurrentUserService';

@Route('GET', '/api/auth/session', 'Retrieve the current session')
export class RetrieveSessionController {
  async handler(c: Context) {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    var u: any;
    try {
      const user = await retrieveCurrentUserService.retrieve(userId);
      u = user;
    } catch (e) {
      console.error(e);
      return c.json({ error: 'Failed to retrieve session' }, 500);
    }

    return c.json({ data: u, success: true });
  }
}
