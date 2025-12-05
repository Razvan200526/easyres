import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { coverLetterRepository } from '@server/repositories/CoverletterRepository';
import type { ApiResponse } from '@server/sdk/types';
import type { Context } from 'hono';

type DeleteResult = {
  success: boolean;
  deletedCount: number;
};

@Route(
  'DELETE',
  '/api/coverletter/delete',
  'Controller for deleting 1 or more cover letters',
)
export class DeleteCoverletterController {
  private readonly coverletterRepository = coverLetterRepository;

  async handler(c: Context): Promise<ApiResponse<DeleteResult>> {
    try {
      const { coverletterIds, userId } = await c.req.json();

      // Validate input
      if (
        !coverletterIds ||
        !Array.isArray(coverletterIds) ||
        coverletterIds.length === 0
      ) {
        return apiResponse(
          c,
          {
            data: { success: false, deletedCount: 0 },
            message: 'Invalid cover letter IDs provided',
            isClientError: true,
          },
          400,
        );
      }

      if (!userId) {
        return apiResponse(
          c,
          {
            data: { success: false, deletedCount: 0 },
            message: 'User ID is required',
            isClientError: true,
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
        return apiResponse(
          c,
          {
            data: { success: false, deletedCount: 0 },
            message:
              'Unauthorized: Cannot delete cover letters that do not belong to you',
            isForbidden: true,
          },
          403,
        );
      }

      // Delete the cover letters
      const result =
        await this.coverletterRepository.deleteByIds(coverletterIds);

      return apiResponse(c, {
        data: {
          success: true,
          deletedCount: result.affected || 0,
        },
        message: `Successfully deleted ${result.affected || 0} cover letter(s)`,
      });
    } catch (error) {
      console.error('Delete cover letters error:', error);

      return apiResponse(
        c,
        {
          data: { success: false, deletedCount: 0 },
          message:
            'Internal server error occurred while deleting cover letters',
          isServerError: true,
        },
        500,
      );
    }
  }
}
