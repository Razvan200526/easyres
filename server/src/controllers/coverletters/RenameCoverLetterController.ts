import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { CoverletterEntity } from '@server/entities';
import type { ApiResponse } from '@server/sdk/types';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

@Route('PATCH', '/api/coverletter/:id/rename', 'Rename a specific cover letter')
export class RenameCoverLetterController {
  private readonly primaryDatabase: PrimaryDatabase;

  constructor() {
    this.primaryDatabase = primaryDatabase;
  }

  async handler(c: Context): Promise<ApiResponse<null>> {
    try {
      const id = c.req.param('id');
      const { newName } = await c.req.json();

      const repo = await this.primaryDatabase.open(CoverletterEntity);
      const coverLetter = await repo.findOne({ where: { id: id } });

      if (!coverLetter) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Cover letter not found',
            isNotFound: true,
          },
          404,
        );
      }

      coverLetter.name = newName;
      await repo.save(coverLetter);

      return apiResponse(c, {
        data: null,
        message: 'Cover letter renamed successfully',
      });
    } catch (e) {
      console.error(e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to rename cover letter',
          isServerError: true,
        },
        500,
      );
    }
  }
}
