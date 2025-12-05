import { authService } from '@server/auth/services/AuthService';
import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import type { ApiResponse } from '@server/sdk/types';
import type { Context } from 'hono';

@Route('POST', '/api/auth/reset-password', 'Reset user password')
export class ResetPasswordController {
  async handler(
    c: Context,
  ): Promise<ApiResponse<{ success: boolean; data: string | null }>> {
    const payload = await c.req.json();
    const result = await authService.resetPassword(payload);
    return apiResponse(
      c,
      { data: { success: true, data: result ?? null } },
      201,
    );
  }
}
