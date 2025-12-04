import { authService } from '@server/auth/services/AuthService';
import { Route } from '@server/decorators/Route';
import type { Context } from 'hono';
@Route('POST', '/api/auth/signup/email', 'Handle email signup')
export class SignupEmailController {
  async handler(c: Context) {
    const payload = await c.req.json();
    try {
      const response = await authService.signup({
        ...payload,
      });

      return c.json({
        success: true,
        user: response.response.user,
      });
    } catch (e) {
      console.error(e);
      return c.json({ success: false, error: 'Failed to signup' }, 500);
    }
  }
}
