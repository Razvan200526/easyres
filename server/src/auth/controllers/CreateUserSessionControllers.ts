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

import type { Context } from 'hono';

@Route('POST', '/api/user-sessions', 'Create User Session')
export class CreateUserSessionController {
  private readonly userRepository: UserRepository;
  private readonly userSessionRepository: UserSessionRepository;
  constructor() {
    this.userRepository = userRepository;
    this.userSessionRepository = userSessionRepository;
  }

  async handler(c: Context) {
    const { sessionData } = await c.req.json();
    // if (isSessionValid(sessionData)) {
    //   console.debug('valid');
    // } else {
    //   console.error('Invalid session');
    // }
    const user = await this.userRepository.findOne(sessionData.userId);
    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    const existingSession = await this.userSessionRepository.findByToken(
      sessionData.token,
    );
    if (existingSession) {
      return c.json({ message: 'Session token already exists' }, 409);
    }

    const entity = new UserSessionEntity();
    entity.user = user;
    entity.token = sessionData.token;
    entity.expiresAt = sessionData.expiresAt;
    entity.ipAddress = sessionData.ipAddress;
    entity.userAgent = sessionData.userAgent;

    const newSession = await this.userSessionRepository.create(entity);
    return c.json(newSession, 201);
  }
}
