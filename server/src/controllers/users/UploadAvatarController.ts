import { Route } from '@server/decorators/Route';
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
  async handler(c: Context) {
    try {
      const data = (await c.req.formData()) as FormData;
      const avatar = data.get('avatar') as File;
      if (!avatar) {
        return c.json({ error: 'No avatar provided' }, 400);
      }
      const url = await this.storageService.uploadAvatar(avatar);
      return c.json({ success: true, data: { url } });
    } catch (e) {
      console.error(e);
      return c.json({ error: 'Failed to upload', success: false }, 500);
    }
  }
}
