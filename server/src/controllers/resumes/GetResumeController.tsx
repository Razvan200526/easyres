import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { ResumeEntity } from '@server/entities';
import type { ApiResponse } from '@server/sdk/types';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

@Route('GET', '/api/resume/:id', 'Get resume by id')
export class GetResumeController {
  private database: PrimaryDatabase;
  constructor() {
    this.database = primaryDatabase;
  }
  async handler(c: Context): Promise<ApiResponse<ResumeEntity | null>> {
    const id = c.req.param('id');

    const resumeRepo = await this.database.open(ResumeEntity);

    const resume = await resumeRepo.findOne({
      where: { id: id },
    });

    if (!resume) {
      return apiResponse(
        c,
        {
          data: null,
          message: 'Resume not found',
        },
        404,
      );
    }

    return apiResponse(c, {
      data: resume,
      message: 'Resume found',
    });
  }
}
