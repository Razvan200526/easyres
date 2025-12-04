import { Route } from '@server/decorators/Route';
import { ApplicationEntity } from '@server/entities';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import { env } from '@shared/env';
import type { Context } from 'hono';

@Route('GET', '/api/application/:id', 'Retrieve a single application ')
export class GetApplicationController {
  private db: PrimaryDatabase;

  constructor() {
    this.db = primaryDatabase;
  }
  async handler(c: Context) {
    const id: string = c.req.param('id');

    const appRepo = await this.db.open(ApplicationEntity);
    const application = await appRepo.findOneOrFail({ where: { id: id } });
    if (!application) {
      return c.json({
        data: {},
        message: 'Failed to retrieve application',
        success: false,
        isNotFound: true,
        isForbidden: false,
        isClientError: false,
        isServerError: false,
        isUnauthorized: false,
        debug: false,
        app: {
          url: env.APP_URL,
        },
      });
    }

    return c.json({
      data: application,
      message: 'Retrieved application successfully',
      success: true,
      isNotFound: false,
      isForbidden: false,
      isClientError: false,
      isServerError: false,
      isUnauthorized: false,
      debug: false,
      app: {
        url: Bun.env.APP_URL,
      },
    });
  }
}
