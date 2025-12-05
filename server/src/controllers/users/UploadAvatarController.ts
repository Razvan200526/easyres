import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import type { ApiResponse } from '@server/sdk/types';
import {
  type StorageService,
  storageService,
} from '@server/service/StorageService';
import type { Context } from 'hono';

@Route('POST', '/api/uploads/images/avatars', 'Upload user avatar')
export class UploadAvatarController {
  private storageService: StorageService;
  constructor() {
    this.storageService = storageService;
  }
  async handler(c: Context): Promise<ApiResponse<{ url: string } | null>> {
    try {
      const data = (await c.req.formData()) as FormData;
      const avatar = data.get('avatar') as File;
      if (!avatar) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'No avatar provided',
            isClientError: true,
          },
          400,
        );
      }
      const url = await this.storageService.uploadAvatar(avatar);
      return apiResponse(c, {
        data: { url },
        message: 'Avatar uploaded successfully',
      });
    } catch (e) {
      console.error(e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to upload',
          isServerError: true,
        },
        500,
      );
    }
  }
}
