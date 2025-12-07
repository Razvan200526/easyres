import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import type { ApiResponse } from '@server/sdk/types';
import { isEmailValid } from '@shared/validators/isEmailValid';
import { isUserPasswordValid } from '@shared/validators/isUserPasswordValid';
import type { Context } from 'hono';
import { type AuthService, authService } from '../services/AuthService';

@Route(
  'POST',
  '/api/auth/signin/email',
  'Sign in a user with email and password',
)
export class SignInController {
  private authService: AuthService;
  constructor() {
    this.authService = authService;
  }
  async handler(c: Context): Promise<
    ApiResponse<{
      error?: string;
      success: boolean;
      user?: any;
      token?: string;
    }>
  > {
    const { email, password } = await c.req.json();
    if (!isEmailValid(email)) {
      return apiResponse(
        c,
        { data: { error: 'Invalid email', success: false } },
        400,
      );
    }
    if (!isUserPasswordValid(password)) {
      return apiResponse(
        c,
        { data: { error: 'Invalid password', success: false } },
        400,
      );
    }
    try {
      const result = await this.authService.signInEmail(
        { email, password },
        c.req.raw.headers,
      );

      const setCookieHeader = result.headers.get('Set-Cookie');
      if (setCookieHeader) {
        c.header('Set-Cookie', setCookieHeader);
      }

      return apiResponse(
        c,
        {
          data: {
            user: result.response.user,
            token: result.response.token,
            success: true,
          },
        },
        200,
      );
    } catch (e) {
      if (e instanceof Error)
        return apiResponse(
          c,
          { data: { error: e.message, success: false } },
          500,
        );
      return apiResponse(
        c,
        { data: { error: 'Something went wrong', success: false } },
        500,
      );
    }
  }
}
