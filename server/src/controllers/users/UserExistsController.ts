import { Route } from '@server/decorators/Route';
import { userRepository } from '@server/repositories/UserRepository';
import { env } from '@shared/env';
import { isEmailValid } from '@shared/validators/isEmailValid';

import type { Context } from 'hono';

const url = env.APP_URL;

@Route('GET', '/api/user-exists', 'Checks if a user exists')
export class CheckUserExistsController {
  async handler(c: Context) {
    const email = c.req.query('email');
    if (!email) {
      return c.json({
        data: {
          exists: false,
        },
        message: 'Invalid email',
        success: false,
        status: 400,
        isClientError: true,
        isServerError: false,
        isNotFound: false,
        isUnauthorized: false,
        isForbidden: false,
        app: {
          url,
        },
      });
    }
    if (!isEmailValid(email)) {
      return c.json({
        data: {
          exists: false,
        },
        message: 'Invalid email',
        success: false,
        status: 400,
        isClientError: true,
        isServerError: false,
        isNotFound: false,
        isUnauthorized: false,
        isForbidden: false,
        app: {
          url,
        },
      });
    }
    let user: any;
    try {
      user = await userRepository.findByEmail(email);
    } catch (e: any) {
      console.error('Error in findByEmail:', e);
      return c.json(
        { error: 'Failed to check user existence', details: e.message },
        500,
      );
    }

    if (user) {
      return c.json({
        data: {
          exists: true,
        },
        message: 'User exists,try another email',
        success: true,
        status: 400,
        isClientError: true,
        isServerError: false,
        isNotFound: false,
        isUnauthorized: false,
        isForbidden: false,
        app: {
          url,
        },
      });
    }
    return c.json({
      data: {
        exists: false,
      },
      message: 'User does not exist',
      success: true,
      status: 200,
      isClientError: false,
      isServerError: false,
      isNotFound: false,
      isUnauthorized: false,
      isForbidden: false,
      app: {
        url,
      },
    });
  }
}
