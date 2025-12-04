import type { ResponseType } from '@sdk/types';
import { Route } from '@server/decorators/Route';
import { ResumeEntity } from '@server/entities';
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

  async handler(c: Context) {
    const id = c.req.param('id');
    const { newName } = await c.req.json();

    const repo = await this.primaryDatabase.open(ResumeEntity);
    const resume = await repo.findOne({ where: { id: id } });

    if (!resume) {
      return c.json({ error: 'Resume not found' }, 404);
    }

    resume.name = newName;
    await repo.save(resume);

    return c.json<ResponseType>({
      data: {},
      success: true,
      message: 'Resume renamed successfully',
      status: 200,
      isClientError: false,
      isServerError: false,
      isNotFound: false,
      isUnauthorized: false,
      isForbidden: false,
      debug: false,
      app: {
        url: c.req.url,
      },
    });
  }
}
