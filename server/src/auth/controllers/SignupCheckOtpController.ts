import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import type { ApiResponse } from '@server/sdk/types';
import type { Context } from 'hono';
import { authService } from '../services/AuthService';

@Route('POST', '/api/auth/signup/check-otp', 'Check OTP on signup')
export class SignupCheckOtpController {
  async handler(
    c: Context,
  ): Promise<ApiResponse<{ error: string; success: boolean }>> {
    const email = c.req.query('email');
    const code = c.req.query('code');

    if (!email || !code) {
      return apiResponse(c, {
        data: { error: 'Email and code are required', success: false },
        message: 'Email and code are required',
      });
    }

    try {
      await authService.verifyEmailOTP(email, code);
      return apiResponse(c, {
        data: { error: '', success: true },
        message: 'OTP verified successfully',
      });
    } catch (error) {
      console.error('Error in SignupCheckOtpController:', error);
      if (error instanceof Error) {
        return apiResponse(c, {
          data: { error: error.message, success: false },
          message: error.message,
        });
      }
      return apiResponse(c, {
        data: { error: 'Invalid OTP', success: false },
        message: 'Invalid OTP',
      });
    }
  }
}
