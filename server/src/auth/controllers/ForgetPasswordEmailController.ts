import { authService } from '@server/auth/services/AuthService';
import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import type { ApiResponse } from '@server/sdk/types';
import type { Context } from 'hono';

@Route(
  'POST',
  '/api/auth/forget-password/email',
  'Handle email forget password',
)
export class ForgetPasswordEmailController {
  async handler(
    c: Context,
  ): Promise<ApiResponse<{ success: boolean; data: string | null }>> {
    const payload = await c.req.json();
    const result = await authService.sendForgetPasswordEmail(payload.email);
    return apiResponse(
      c,
      { data: { success: true, data: result ?? null } },
      201,
    );
  }
}
