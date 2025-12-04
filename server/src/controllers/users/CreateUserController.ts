import { AuthService } from '@server/auth/services/AuthService';
import { Route } from '@server/decorators/Route';
import type { CreateUserModel } from '@server/models/CreateUserModel';
import type { Context } from 'hono';

const authService = new AuthService(process.env.DATABASE_URL || '');

@Route('POST', '/api/auth/signup', 'Creates a new user account')
export class SignUpController {
  async handler(c: Context) {
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
        return c.json(
          { message: 'Failed to create user', success: false },
          400,
        );
      }

      return c.json({ success: true });
    } catch (error) {
      console.error('Error creating user:', error);
      return c.json({ message: 'Failed to create user' }, 500);
    }
  }
}
