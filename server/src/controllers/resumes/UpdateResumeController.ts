import { Route } from '@server/decorators/Route';
import type { Context } from 'hono';

@Route('PUT', '/resumes/:id', 'Update a specific resume')
export class UpdateResumeController {
  async handler(_c: Context) {
    // TODO: Update a specific resume
  }
}
