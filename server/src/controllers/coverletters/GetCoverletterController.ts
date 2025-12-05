import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { CoverletterEntity } from '@server/entities';
import type { ApiResponse } from '@server/sdk/types';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

@Route('GET', '/api/coverletter/:id', 'Get cover letter by id')
export class GetCoverletterController {
  private database: PrimaryDatabase;
  constructor() {
    this.database = primaryDatabase;
  }
  async handler(c: Context): Promise<ApiResponse<CoverletterEntity | null>> {
    const id = c.req.param('id');

    const coverLetterRepo = await this.database.open(CoverletterEntity);

    const coverLetter = await coverLetterRepo.findOne({
      where: { id: id },
    });

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
    return apiResponse(c, {
      data: coverLetter,
      message: 'Cover letter found',
    });
  }
}
