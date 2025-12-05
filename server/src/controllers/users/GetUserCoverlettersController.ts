import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { CoverletterEntity } from '@server/entities';
import type { ApiResponse } from '@server/sdk/types';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import { pe } from '@shared/utils';
import type { Context } from 'hono';

@Route('GET', '/api/coverletters/:id', 'Get all cover letters')
export class GetUserCoverlettersController {
  private database: PrimaryDatabase;
  constructor() {
    this.database = primaryDatabase;
  }
  async handler(c: Context): Promise<ApiResponse<CoverletterEntity[] | null>> {
    try {
      const userId = c.req.param('id');
      if (!userId) {
        return apiResponse(
          c,
          {
            data: [],
            message: 'User ID is required',
            isClientError: true,
          },
          400,
        );
      }

      const coverLetterRepo = await this.database.open(CoverletterEntity);
      const allCoverLetters = await coverLetterRepo.find({
        where: { user: { id: userId } },
      });

      return apiResponse(c, {
        data: allCoverLetters,
        message: 'Cover letters retrieved successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(pe.render(error));
      }
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve cover letters',
          isServerError: true,
        },
        500,
      );
    }
  }
}
