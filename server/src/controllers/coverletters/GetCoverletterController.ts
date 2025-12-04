import { Route } from '@server/decorators/Route';
import { CoverletterEntity } from '@server/entities';
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
  async handler(c: Context) {
    const id = c.req.param('id');

    const coverLetterRepo = await this.database.open(CoverletterEntity);

    const coverLetter = await coverLetterRepo.findOne({
      where: { id: id },
    });

    if (!coverLetter) {
      return c.json({
        data: {},
        message: 'Cover letter not found',
        isClientError: true,
        isServerError: true,
        app: {
          url: Bun.env.APP_URL,
        },
      });
    }
    return c.json({
      data: coverLetter,
      message: 'Cover letter found',
      isClientError: false,
      isServerError: false,
      app: {
        url: Bun.env.APP_URL,
      },
    });
  }
}
