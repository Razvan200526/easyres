import { Route } from '@server/decorators/Route';
import type { Context } from 'hono';
import { authService } from '../services/AuthService';

@Route('GET', '/api/auth/signout', 'Logout the current user')
export class SignoutController {
  async handler(c: Context) {
    try {
      const result = await authService.signOut(c.req.raw.headers);

      const setCookieHeader = result.headers.get('Set-Cookie');
      if (setCookieHeader) {
        c.header('Set-Cookie', setCookieHeader);
      }

      return c.json({ success: result.response.success, data: null });
    } catch (e) {
      console.error('Signout error:', e);
      return c.json({ success: false, error: 'Signout failed' }, 500);
    }
  }
}
