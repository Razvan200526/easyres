import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { ApplicationEntity } from '@server/entities';
import type { ApiResponse } from '@server/sdk/types';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

@Route('GET', '/api/application/:id', 'Retrieve a single application ')
export class GetApplicationController {
  private db: PrimaryDatabase;

  constructor() {
    this.db = primaryDatabase;
  }
  async handler(c: Context): Promise<ApiResponse<ApplicationEntity | null>> {
    const id: string = c.req.param('id');

    const appRepo = await this.db.open(ApplicationEntity);
    const application = await appRepo.findOneOrFail({ where: { id: id } });
    if (!application) {
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve application',
          isNotFound: true,
        },
        404,
      );
    }

    return apiResponse(c, {
      data: application,
      message: 'Retrieved application successfully',
    });
  }
}
