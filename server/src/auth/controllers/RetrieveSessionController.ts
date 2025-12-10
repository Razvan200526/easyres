import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import type { ApiResponse, UserType } from '@server/sdk/types';
import type { Context } from 'hono';
import { retrieveCurrentUserService } from '../services/RetrieveCurrentUserService';

@Route('GET', '/api/auth/session', 'Retrieve the current session')
export class RetrieveSessionController {
  async handler(c: Context): Promise<ApiResponse<{ user: UserType | null }>> {
    const userId = c.get('userId');
    if (!userId) {
      return apiResponse(c, { data: { user: null }, success: true }, 200);
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
          data: { user: null },
          message: 'Failed to retrieve session',
        },
        500,
      );
    }

    return apiResponse(c, { data: u, success: true });
  }
}
