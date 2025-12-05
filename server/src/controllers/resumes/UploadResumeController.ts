import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { ResumeEntity } from '@server/entities';
import type { ApiResponse } from '@server/sdk/types';
import {
  type StorageService,
  storageService,
} from '@server/service/StorageService';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

@Route('POST', '/api/uploads/resumes')
export class UploadResumeController {
  private readonly database: PrimaryDatabase;
  private readonly storageService: StorageService;

  constructor() {
    this.database = primaryDatabase;
    this.storageService = storageService;
  }

  async handler(c: Context): Promise<ApiResponse<{ url: string } | null>> {
    try {
      const data = (await c.req.formData()) as FormData;
      const resume = data.get('resume') as File;
      const userId = data.get('userId') as string;
      const name = data.get('name') as string;

      if (!name) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Name is required',
            isClientError: true,
          },
          400,
        );
      }
      if (!resume) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Resume is required',
            isClientError: true,
          },
          400,
        );
      }
      const url = await this.storageService.uploadResume(resume);

      const filesize = resume.size;
      const filename = resume.name;
      if (!userId) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Unauthorized',
            isUnauthorized: true,
          },
          401,
        );
      }
      const repo = await this.database.open(ResumeEntity);
      const resumeEntity = repo.create({
        user: { id: userId },
        name,
        filename,
        url,
        filesize,
      });

      const savedResume = await repo.save(resumeEntity);

      if (!savedResume) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Resume upload failed(database)',
            isServerError: true,
          },
          500,
        );
      }
      return apiResponse(c, {
        data: { url },
        message: 'Resume uploaded successfully',
      });
    } catch (e) {
      console.error(e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Internal Server Error',
          isServerError: true,
        },
        500,
      );
    }
  }
}
