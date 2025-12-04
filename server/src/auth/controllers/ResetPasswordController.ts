import { authService } from '@server/auth/services/AuthService';
import { Route } from '@server/decorators/Route';
import type { Context } from 'hono';

@Route('POST', '/api/auth/reset-password', 'Reset user password')
export class ResetPasswordController {
  async handler(c: Context) {
    const payload = await c.req.json();
    const result = await authService.resetPassword(payload);
    return c.json({ success: true, data: result ?? null });
  }
}
