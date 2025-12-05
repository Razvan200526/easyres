import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import {
  ApplicationEntity,
  CoverletterEntity,
  ResumeEntity,
} from '@server/entities';
import { userRepository } from '@server/repositories/UserRepository';
import type { ApiResponse, CreateApplicationType } from '@server/sdk/types';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';

@Route('POST', '/api/applications/create', 'Create a new application')
export class CreateApplicationController {
  private readonly db: PrimaryDatabase;

  constructor() {
    this.db = primaryDatabase;
  }
  async handler(
    c: Context,
  ): Promise<ApiResponse<{ newApplication: ApplicationEntity } | null>> {
    const body = (await c.req.json()) as CreateApplicationType;
    const { data, userId } = body;

    const applicationRepository = await this.db.open(ApplicationEntity);
    if (!applicationRepository.exists()) {
      return apiResponse(
        c,
        {
          data: null,
          message: 'Database error',
          isServerError: true,
        },
        500,
      );
    }

    const user = await userRepository.findOneOrFail(userId);
    if (user.id !== userId) {
      return apiResponse(
        c,
        {
          data: null,
          message: 'Server error',
          isUnauthorized: true,
        },
        500,
      );
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
      return apiResponse(
        c,
        {
          data: null,
          message: 'Error creating application',
          isServerError: true,
        },
        500,
      );
    }
    return apiResponse(c, {
      data: { newApplication },
      message: 'Application created successfully',
    });
  }
}
