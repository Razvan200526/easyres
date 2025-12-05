import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { resumeRepository } from '@server/repositories/ResumeRepository';
import type { ApiResponse } from '@server/sdk/types';
import { pe } from '@shared/utils';
import type { Context } from 'hono';

@Route(
  'DELETE',
  '/api/resumes/delete',
  'Controller for deleting 1 or more resumes',
)
export class DeleteResumeController {
  private readonly resumeRepository = resumeRepository;

  async handler(
    c: Context,
  ): Promise<ApiResponse<{ success: boolean; deletedCount: number }>> {
    try {
      const { resumeIds, userId } = await c.req.json();

      if (!resumeIds || !Array.isArray(resumeIds) || resumeIds.length === 0) {
        return apiResponse(c, {
          data: { success: false, deletedCount: 0 },
          message: 'Invalid resume',
        });
      }
      if (!userId) {
        return apiResponse(c, {
          data: { success: false, deletedCount: 0 },
          message: 'User ID is required',
        });
      }
      const resumes = await this.resumeRepository.findByIds(resumeIds);

      const unauthorized = resumes.some((resume: any) => {
        return resume.user.id !== userId;
      });
      if (unauthorized) {
        return apiResponse(c, {
          data: { success: false, deletedCount: 0 },
          message:
            'Unauthorized: Cannot delete resumes that do not belong to you',
        });
      }

      const result = await this.resumeRepository.deleteByIds(resumeIds);

      return apiResponse(c, {
        data: {
          success: true,
          deletedCount: result.affected || 0,
        },
        message: `Successfully deleted ${result.affected || 0} resume(s)`,
      });
    } catch (error) {
      if (error instanceof Error) console.error(pe.render(error));
      return apiResponse(c, {
        data: { success: false, deletedCount: 0 },
        message: 'Internal server error occurred while deleting resumes',
      });
    }
  }
}
