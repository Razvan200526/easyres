import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import type { ApiResponse } from '@server/sdk/types';
import type { Context } from 'hono';
import { retrieveCurrentUserService } from '../services/RetrieveCurrentUserService';

@Route('GET', '/api/auth/session', 'Retrieve the current session')
export class RetrieveSessionController {
  async handler(
    c: Context,
  ): Promise<ApiResponse<{ success: boolean; data: any }>> {
    const userId = c.get('userId');
    if (!userId) {
      return apiResponse(
        c,
        { data: { success: false, data: null }, message: 'Unauthorized' },
        401,
      );
    }

    var u: any;
    try {
      const user = await retrieveCurrentUserService.retrieve(userId);
      u = user;
    } catch (e) {
      console.error(e);
      return apiResponse(
        c,
        {
          data: { success: false, data: null },
          message: 'Failed to retrieve session',
        },
        500,
      );
    }

    return apiResponse(c, { data: u, success: true });
  }
}
