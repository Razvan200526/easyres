import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { UserSessionEntity } from '@server/entities';
import {
  type UserRepository,
  userRepository,
} from '@server/repositories/UserRepository';
import {
  type UserSessionRepository,
  userSessionRepository,
} from '@server/repositories/UserSessionRepository';
import type { ApiResponse } from '@server/sdk/types';

import type { Context } from 'hono';

@Route('POST', '/api/user-sessions', 'Create User Session')
export class CreateUserSessionController {
  private readonly userRepository: UserRepository;
  private readonly userSessionRepository: UserSessionRepository;
  constructor() {
    this.userRepository = userRepository;
    this.userSessionRepository = userSessionRepository;
  }

  async handler(c: Context): Promise<ApiResponse<UserSessionEntity | null>> {
    const { sessionData } = await c.req.json();
    const user = await this.userRepository.findOne(sessionData.userId);
    if (!user) {
      return apiResponse(c, { data: null, message: 'User not found' }, 404);
    }

    const existingSession = await this.userSessionRepository.findByToken(
      sessionData.token,
    );
    if (existingSession) {
      return apiResponse(
        c,
        { data: null, message: 'Session token already exists' },
        409,
      );
    }

    const entity = new UserSessionEntity();
    entity.user = user;
    entity.token = sessionData.token;
    entity.expiresAt = sessionData.expiresAt;
    entity.ipAddress = sessionData.ipAddress;
    entity.userAgent = sessionData.userAgent;

    const newSession = await this.userSessionRepository.create(entity);
    return apiResponse(
      c,
      { data: newSession, message: 'Session created successfully' },
      201,
    );
  }
}
