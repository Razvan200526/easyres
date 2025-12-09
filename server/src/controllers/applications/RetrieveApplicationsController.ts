import { apiResponse } from '@server/client';
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
import type { ApiResponse } from '@server/sdk/types';
import type { Context } from 'hono';

@Route('GET', '/api/applications/:id', 'Retrieve all applications')
export class RetrieveApplicationsController {
  private readonly userRepo: UserRepository;
  private readonly appRepo: ApplicationRepository;
  constructor() {
    this.userRepo = userRepository;
    this.appRepo = applicationRepository;
  }
  async handler(c: Context): Promise<ApiResponse<ApplicationEntity[] | null>> {
    try {
      const userId = c.req.param('id');

      const user = await this.userRepo.findOne(userId);
      if (!user) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'User not found',
            isNotFound: true,
          },
          404,
        );
      }

      const applications: ApplicationEntity[] =
        await this.appRepo.findByUser(userId);

      return apiResponse(c, {
        data: applications,
        message: 'Applications retrieved successfully',
      });
    } catch (e: any) {
      console.error(e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve applications',
          isServerError: true,
        },
        500,
      );
    }
  }
}
