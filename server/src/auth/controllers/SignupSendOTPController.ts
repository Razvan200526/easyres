import { authService } from '@server/auth/services/AuthService';
import { Route } from '@server/decorators/Route';
import { isEmailValid } from '@shared/validators/isEmailValid';
import type { Context } from 'hono';

@Route('POST', '/api/auth/email-otp/send-verification-otp', 'Sends OTP on mail')
export class SignupSendOTPController {
  async handler(c: Context) {
    try {
      const { email } = await c.req.json();
      if (!isEmailValid(email)) {
        return c.json({ error: 'Invalid email', success: false }, 400);
      }

      //@ts-ignore
      const res = await authService.getAuth().api.sendVerificationOTP({
        body: { email, type: 'email-verification' },
      });

      return c.json({ success: res.success }, res.success ? 200 : 400);
    } catch (e) {
      console.error('Error in email-otp/send-verification-otp:', e);
      return c.json({ success: false, error: 'Failed to send OTP' }, 500);
    }
  }
}
