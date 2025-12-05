import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { CoverletterEntity } from '@server/entities';
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

@Route('POST', '/api/uploads/coverletters', 'Upload a cover letter')
export class UploadCoverLetterController {
  private database: PrimaryDatabase;
  private readonly storageService: StorageService;

  constructor() {
    this.database = primaryDatabase;
    this.storageService = storageService;
  }
  async handler(c: Context): Promise<ApiResponse<{ url: string } | null>> {
    try {
      const data = (await c.req.formData()) as FormData;
      const coverletter = data.get('coverletter') as File;
      const userId = data.get('userId') as string;
      const name = data.get('name') as string;

      if (!coverletter) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Cover letter is required',
            isClientError: true,
          },
          400,
        );
      }

      const url = await this.storageService.uploadCoverletter(coverletter);
      if (!url) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Failed to upload cover letter',
            isClientError: true,
          },
          400,
        );
      }
      const filename = coverletter.name;
      const uploadedAt = new Date();
      if (!userId) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'User ID is required',
            isClientError: true,
          },
          400,
        );
      }

      const repo = await this.database.open(CoverletterEntity);
      const coverletterEntity = repo.create({
        user: { id: userId },
        url,
        name,
        filename,
        uploadedAt,
      });

      const savedCoverletter = await repo.save(coverletterEntity);
      if (!savedCoverletter) {
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
        message: 'Cover letter uploaded successfully',
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
