import { Route } from '@server/decorators/Route';
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
  async handler(c: Context) {
    const { email, password } = await c.req.json();
    if (!isEmailValid(email)) {
      return c.json({ data: { error: 'Invalid email', success: false } });
    }
    if (!isUserPasswordValid(password)) {
      return c.json({ data: { error: 'Invalid password', success: false } });
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

      return c.json({
        data: { user: result.response.user, token: result.response.token },
        success: true,
        user: result.response.user,
      });
    } catch (e: any) {
      return c.json({ data: { error: e.message, success: false } });
    }
  }
}
