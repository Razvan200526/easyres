import { Route } from '@server/decorators/Route';
import { ResumeEntity } from '@server/entities';

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

  async handler(c: Context) {
    try {
      const userId = c.req.param('id');
      if (!userId) {
        throw new Error('Invalid user id');
      }

      const resumesRepo = await this.database.open(ResumeEntity);
      const allResumes = await resumesRepo.find({
        where: { user: { id: userId } },
      });

      return c.json({
        data: allResumes,
        message: null,
        success: true,
        status: 200,
        isClientError: false,
        isServerError: false,
        isNotFound: false,
        isUnauthorized: false,
        isForbidden: false,
        debug: process.env.NODE_ENV !== 'production',
        app: { url: process.env.APP_URL || '' },
      });
    } catch (error: any) {
      return c.json({
        data: null,
        message: error.message || 'Unknown error',
        success: false,
        status: 500,
        isClientError: false,
        isServerError: true,
        isNotFound: false,
        isUnauthorized: false,
        isForbidden: false,
        debug: process.env.NODE_ENV !== 'production',
        app: { url: process.env.APP_URL || '' },
      });
    }
  }
}
