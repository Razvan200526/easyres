import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { ResumeEntity } from '@server/entities';
import type { ApiResponse } from '@server/sdk/types';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

@Route('PATCH', '/api/resume/:id/rename', 'Rename a specific resume')
export class RenameResumeController {
  private readonly primaryDatabase: PrimaryDatabase;

  constructor() {
    this.primaryDatabase = primaryDatabase;
  }

  async handler(c: Context): Promise<ApiResponse<null>> {
    try {
      const id = c.req.param('id');
      const { newName } = await c.req.json();

      const repo = await this.primaryDatabase.open(ResumeEntity);
      const resume = await repo.findOne({ where: { id: id } });

      if (!resume) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Resume not found',
            isNotFound: true,
          },
          404,
        );
      }

      resume.name = newName;
      await repo.save(resume);

      return apiResponse(c, {
        data: null,
        message: 'Resume renamed successfully',
      });
    } catch (e) {
      console.error(e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to rename resume',
          isServerError: true,
        },
        500,
      );
    }
  }
}
