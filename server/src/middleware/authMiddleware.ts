import type { Context, Next } from 'hono';
import { authService } from '../auth/services/AuthService';

export async function authMiddleware(c: Context, next: Next) {
  const session = await authService.getSession(c.req.raw.headers);

  if (session?.user) {
    c.set('userId', session.user.id);
  }

  await next();
}
