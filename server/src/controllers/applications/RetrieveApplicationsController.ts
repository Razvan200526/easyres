import { Route } from '@server/decorators/Route';
import type { ApplicationEntity } from '@server/entities';
import {
  type ApplicationRepository,
  applicationRepository,
} from '@server/repositories/ApplicationRepository';
import {
  type UserRepository,
  userRepository,
} from '@server/repositories/UserRepository';
import { env } from '@shared/env';
import type { Context } from 'hono';

@Route('GET', '/api/applications/:id', 'Retrieve all applications')
export class RetrieveApplicationsController {
  private readonly userRepo: UserRepository;
  private readonly appRepo: ApplicationRepository;
  constructor() {
    this.userRepo = userRepository;
    this.appRepo = applicationRepository;
  }
  async handler(c: Context) {
    const userId = c.req.param('id');

    const user = await this.userRepo.findOne(userId);
    if (!user) {
      return c.json({
        success: false,
        data: null,
        message: 'User not found',
        status: 404,
        isClientError: false,
        isServerError: true,
        isNotFound: true,
        isForbidden: true,
        isUnauthorized: true,
        debug: false,
        app: {
          url: env.APP_URL,
        },
      });
    }

    const applications: ApplicationEntity[] =
      await this.appRepo.findByUser(userId);

    return c.json({
      success: true,
      data: applications,
      message: 'Applications retrieved successfully',
      status: 200,
      isServerError: false,
      isClientError: false,
      debug: false,
      isNotFound: false,
      isForbidden: false,
      isUnauthorized: false,
      app: {
        url: env.APP_URL,
      },
    });
  }
}
