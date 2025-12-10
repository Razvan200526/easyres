import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { CoverletterEntity } from '@server/entities';
import type { ApiResponse, DateRange, ResumeState, SortOrder } from '@server/sdk/types';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';
import { Between, type FindOptionsWhere, ILike } from 'typeorm';


@Route('GET', '/api/resumes/:userId/filter', 'Get filtered resumes for a user')
export class RetrieveFilteredCoverlettersController {
  private database: PrimaryDatabase;

  constructor() {
    this.database = primaryDatabase;
  }

  async handler(c: Context): Promise<ApiResponse<CoverletterEntity[] | null>> {
    try {
      const userId = c.req.param('userId');

      if (!userId) {
        return apiResponse(
          c,
          { data: null, message: 'User ID is required', isClientError: true },
          400,
        );
      }

      const searchQuery = c.req.query('searchQuery') || '';
      const sortBy = c.req.query('sortBy') || 'uploadedAt';
      const sortOrder = (c.req.query('sortOrder') || 'desc') as SortOrder;
      const dateRange = (c.req.query('dateRange') || 'all') as DateRange;
      const state = (c.req.query('state') || 'all') as ResumeState;

      const resumeRepo = await this.database.open(CoverletterEntity);

      const where: FindOptionsWhere<CoverletterEntity> = {
        user: { id: userId },
      };

      if (searchQuery.trim()) {
        where.name = ILike(`%${searchQuery}%`);
      }

      if (state !== 'all') {
        where.state = state;
      }

      if (dateRange !== 'all') {
        const now = new Date();
        const filterDate = this.getFilterDate(now, dateRange);
        where.uploadedAt = Between(filterDate, now);
      }

      const order: Record<string, 'ASC' | 'DESC'> = {};
      const validSortFields = ['name', 'uploadedAt'];
      if (validSortFields.includes(sortBy)) {
        order[sortBy] = sortOrder.toUpperCase() as 'ASC' | 'DESC';
      } else {
        order.uploadedAt = 'DESC';
      }

      const resumes = await resumeRepo.find({
        where,
        order,
      });

      return apiResponse(c, {
        data: resumes,
        success: true,
        message: 'Coverletters retrieved successfully',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return apiResponse(
        c,
        { data: null, success: false, message, isServerError: true },
        500,
      );
    }
  }

  private getFilterDate(now: Date, dateRange: DateRange): Date {
    const date = new Date(now);

    switch (dateRange) {
      case 'today':
        date.setHours(0, 0, 0, 0);
        break;
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case '3months':
        date.setMonth(date.getMonth() - 3);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        break;
      default:
        date.setFullYear(1970);
    }

    return date;
  }
}
