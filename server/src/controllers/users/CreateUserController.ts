import { AuthService } from '@server/auth/services/AuthService';
import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import type { CreateUserModel } from '@server/models/CreateUserModel';
import type { ApiResponse } from '@server/sdk/types';
import type { Context } from 'hono';

const authService = new AuthService(process.env.DATABASE_URL || '');

@Route('POST', '/api/auth/signup', 'Creates a new user account')
export class SignUpController {
  async handler(c: Context): Promise<ApiResponse<null>> {
    try {
      const userData = (await c.req.json()) as CreateUserModel;

      const result = await authService.signup({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
      });

      if (!result) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Failed to create user',
            isClientError: true,
          },
          400,
        );
      }

      return apiResponse(c, {
        data: null,
        message: 'User created successfully',
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to create user',
          isServerError: true,
        },
        500,
      );
    }
  }
}
