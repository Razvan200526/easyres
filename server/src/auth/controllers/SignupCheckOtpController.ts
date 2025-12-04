import { Route } from '@server/decorators/Route';
import type { Context } from 'hono';
import { authService } from '../services/AuthService';

@Route('POST', '/api/auth/signup/check-otp', 'Check OTP on signup')
export class SignupCheckOtpController {
  async handler(c: Context) {
    const email = c.req.query('email');
    const code = c.req.query('code');

    if (!email || !code) {
      return c.json(
        { success: false, error: 'Email and code are required' },
        400,
      );
    }

    try {
      const result = await authService.verifyEmailOTP(email, code);
      return c.json({ success: result.success, data: result ?? null });
    } catch (error) {
      console.error('Error in SignupCheckOtpController:', error);
      if (error instanceof Error) {
        return c.json({ success: false, error: error.message }, 500);
      }
      return c.json({ success: false, error: 'Invalid OTP' }, 501);
    }
  }
}
