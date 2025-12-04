import { Route } from '@server/decorators/Route';
import type { Context } from 'hono';

@Route('PUT', '/api/applications/update/:id', 'Update an existing application')
export class UpdateApplicationController {
  async handler(_c: Context) {
    // TODO: Update an existing application
  }
}
