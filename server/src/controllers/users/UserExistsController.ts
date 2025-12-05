import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { userRepository } from '@server/repositories/UserRepository';
import type { ApiResponse } from '@server/sdk/types';
import { isEmailValid } from '@shared/validators/isEmailValid';
import type { Context } from 'hono';

@Route('GET', '/api/user-exists', 'Checks if a user exists')
export class CheckUserExistsController {
  async handler(c: Context): Promise<ApiResponse<{ exists: boolean }>> {
    const email = c.req.query('email');
    if (!email) {
      return apiResponse(
        c,
        {
          data: { exists: false },
          message: 'Invalid email',
          isClientError: true,
        },
        400,
      );
    }
    if (!isEmailValid(email)) {
      return apiResponse(
        c,
        {
          data: { exists: false },
          message: 'Invalid email',
          isClientError: true,
        },
        400,
      );
    }
    let user: any;
    try {
      user = await userRepository.findByEmail(email);
    } catch (e: any) {
      console.error('Error in findByEmail:', e);
      return apiResponse(
        c,
        {
          data: { exists: false },
          message: 'Failed to check user existence',
          isServerError: true,
        },
        500,
      );
    }

    if (user) {
      return apiResponse(
        c,
        {
          data: { exists: true },
          message: 'User exists, try another email',
          isClientError: true,
        },
        400,
      );
    }
    return apiResponse(c, {
      data: { exists: false },
      message: 'User does not exist',
    });
  }
}
