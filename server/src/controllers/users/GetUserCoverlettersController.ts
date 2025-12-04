import { Route } from '@server/decorators/Route';
import { CoverletterEntity } from '@server/entities';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

@Route('GET', '/api/coverletters/:id', 'Get all cover letters')
export class GetUserCoverlettersController {
  private database: PrimaryDatabase;
  constructor() {
    this.database = primaryDatabase;
  }
  async handler(c: Context) {
    try {
      const userId = c.req.param('id');
      if (!userId) {
        return c.json({
          data: {},
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
      }

      const coverLetterRepo = await this.database.open(CoverletterEntity);
      const allCoverLetters = await coverLetterRepo.find({
        where: { user: { id: userId } },
      });

      return c.json({
        data: allCoverLetters,
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
    } catch (error) {
      return c.json({
        data: {},
        message: error,
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
