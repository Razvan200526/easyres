import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { ResumeEntity } from '@server/entities';
import type { ApiResponse } from '@server/sdk/types';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

@Route('GET', '/api/resumes/:id', 'Fetches users resumes')
export class GetUserResumeController {
  private database: PrimaryDatabase;
  constructor() {
    this.database = primaryDatabase;
  }

  async handler(c: Context): Promise<ApiResponse<ResumeEntity[] | null>> {
    try {
      const userId = c.req.param('id');
      if (!userId) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Invalid user id',
            isClientError: true,
          },
          400,
        );
      }

      const resumesRepo = await this.database.open(ResumeEntity);
      const allResumes = await resumesRepo.find({
        where: { user: { id: userId } },
      });

      return apiResponse(c, {
        data: allResumes,
        message: 'Resumes retrieved successfully',
      });
    } catch (error: any) {
      return apiResponse(
        c,
        {
          data: null,
          message: error.message || 'Unknown error',
          isServerError: true,
        },
        500,
      );
    }
  }
}
