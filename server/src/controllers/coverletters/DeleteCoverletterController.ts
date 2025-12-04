import { Route } from '@server/decorators/Route';
import { coverLetterRepository } from '@server/repositories/CoverletterRepository';

import type { Context } from 'hono';

@Route(
  'DELETE',
  '/api/coverletter/delete',
  'Controller for deleting 1 or more cover letters',
)
export class DeleteCoverletterController {
  private readonly coverletterRepository = coverLetterRepository;

  async handler(c: Context) {
    try {
      const { coverletterIds, userId } = await c.req.json();

      // Validate input
      if (
        !coverletterIds ||
        !Array.isArray(coverletterIds) ||
        coverletterIds.length === 0
      ) {
        return c.json(
          {
            data: { success: false, deletedCount: 0 },
            message: 'Invalid cover letter IDs provided',
            success: false,
            status: 400,
            isClientError: true,
            isServerError: false,
            isNotFound: false,
            isUnauthorized: false,
            isForbidden: false,
            debug: false,
            app: { url: c.req.url },
          },
          400,
        );
      }

      if (!userId) {
        return c.json(
          {
            data: { success: false, deletedCount: 0 },
            message: 'User ID is required',
            success: false,
            status: 400,
            isClientError: true,
            isServerError: false,
            isNotFound: false,
            isUnauthorized: false,
            isForbidden: false,
            debug: false,
            app: { url: c.req.url },
          },
          400,
        );
      }

      // First, find the cover letters and verify they belong to the user
      const coverletters =
        await this.coverletterRepository.findByIds(coverletterIds);

      // Verify all cover letters belong to the requesting user
      const unauthorized = coverletters.some(
        (coverletter: any) => coverletter.user.id !== userId,
      );
      if (unauthorized) {
        return c.json(
          {
            data: { success: false, deletedCount: 0 },
            message:
              'Unauthorized: Cannot delete cover letters that do not belong to you',
            success: false,
            status: 403,
            isClientError: true,
            isServerError: false,
            isNotFound: false,
            isUnauthorized: false,
            isForbidden: true,
            debug: false,
            app: { url: c.req.url },
          },
          403,
        );
      }

      // Delete the cover letters
      const result =
        await this.coverletterRepository.deleteByIds(coverletterIds);

      return c.json(
        {
          data: {
            success: true,
            deletedCount: result.affected || 0,
          },
          message: `Successfully deleted ${result.affected || 0} cover letter(s)`,
          success: true,
          status: 200,
          isClientError: false,
          isServerError: false,
          isNotFound: false,
          isUnauthorized: false,
          isForbidden: false,
          debug: false,
          app: { url: c.req.url },
        },
        200,
      );
    } catch (error) {
      console.error('Delete cover letters error:', error);

      return c.json(
        {
          data: { success: false, deletedCount: 0 },
          message:
            'Internal server error occurred while deleting cover letters',
          success: false,
          status: 500,
          isClientError: false,
          isServerError: true,
          isNotFound: false,
          isUnauthorized: false,
          isForbidden: false,
          debug: true,
          app: { url: c.req.url },
        },
        500,
      );
    }
  }
}
