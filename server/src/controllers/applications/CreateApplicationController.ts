import type { CreateApplicationType } from '@sdk/types';
import { Route } from '@server/decorators/Route';
import {
  ApplicationEntity,
  CoverletterEntity,
  ResumeEntity,
} from '@server/entities';
import { userRepository } from '@server/repositories/UserRepository';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import { env } from '@shared/env';
import type { Context } from 'hono';

@Route('POST', '/api/applications/create', 'Create a new application')
export class CreateApplicationController {
  private readonly db: PrimaryDatabase;

  constructor() {
    this.db = primaryDatabase;
  }
  async handler(c: Context) {
    const body = (await c.req.json()) as CreateApplicationType;
    const { data, userId } = body;

    const applicationRepository = await this.db.open(ApplicationEntity);
    if (!applicationRepository.exists()) {
      return c.json({
        success: false,
        isClientError: false,
        isServerError: true,
        data: null,
        message: 'Database error',
        status: 500,
        isNotFound: false,
        isForbidden: false,
        isUnauthorized: false,
        debug: false,
        app: {
          url: env.APP_URL,
        },
      });
    }

    const user = await userRepository.findOneOrFail(userId);
    if (user.id !== userId) {
      return c.json({
        success: false,
        isClientError: true,
        isServerError: true,
        data: null,
        message: 'Server error',
        status: 500,
        isNotFound: false,
        isForbidden: false,
        isUnauthorized: true,
        debug: false,
        app: {
          url: env.APP_URL,
        },
      });
    }

    const appEntity = new ApplicationEntity();
    appEntity.user = user;
    appEntity.employer = data.employer;
    appEntity.jobTitle = data.jobTitle;
    appEntity.jobUrl = data.jobUrl;
    appEntity.salaryRange = data.salaryRange;
    appEntity.contact = data.contact;
    appEntity.location = data.location;
    appEntity.platform = data.platform as 'linkedin' | 'glassdoor' | 'other';
    appEntity.status = data.status;

    if (data.resumeId && data.resumeId !== 'none') {
      const resumeRepository = await this.db.open(ResumeEntity);
      const resume = await resumeRepository.findOne({
        where: { id: data.resumeId },
      });
      if (resume) {
        appEntity.resume = resume;
      }
    }

    if (data.coverletterId && data.coverletterId !== 'none') {
      const coverletterRepository = await this.db.open(CoverletterEntity);
      const coverletter = await coverletterRepository.findOne({
        where: { id: data.coverletterId },
      });
      if (coverletter) {
        appEntity.coverletter = coverletter;
      }
    }

    const newApplication = applicationRepository.create(appEntity);
    await applicationRepository.save(newApplication);
    if (!newApplication) {
      return c.json({
        success: false,
        isClientError: false,
        isServerError: true,
        data: null,
        message: 'Error creating application',
        status: 500,
        isNotFound: false,
        isForbidden: false,
        isUnauthorized: true,
        debug: false,
        app: {
          url: env.APP_URL,
        },
      });
    }
    return c.json({
      success: true,
      isClientError: false,
      isServerError: false,
      data: {
        newApplication,
      },
      message: 'Application created successfully',
      status: 200,
      isNotFound: false,
      isForbidden: false,
      isUnauthorized: false,
      debug: false,
      app: {
        url: env.APP_URL,
      },
    });
  }
}
