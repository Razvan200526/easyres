import { authService } from '@server/auth/services/AuthService';
import { Route } from '@server/decorators/Route';
import type { Context } from 'hono';

@Route(
  'POST',
  '/api/auth/forget-password/email',
  'Handle email forget password',
)
export class ForgetPasswordEmailController {
  async handler(c: Context) {
    const payload = await c.req.json();
    const result = await authService.sendForgetPasswordEmail(payload.email);
    return c.json({ success: true, data: result ?? null });
  }
}
