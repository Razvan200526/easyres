import type { ApplicationStatus } from '@server/auth/validation';
import { apiResponse } from '@server/client';
import { Route } from '@server/decorators/Route';
import { ApplicationEntity } from '@server/entities';
import type { ApiResponse, DateRange, SortOrder } from '@server/sdk/types';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type { Context } from 'hono';
import { Between, type FindOptionsWhere, ILike } from 'typeorm';

@Route(
  'GET',
  '/api/applications/:userId/filter',
  'Get filtered applications for a user',
)
export class RetrieveFilteredApplicationsController {
  private database: PrimaryDatabase;

  constructor() {
    this.database = primaryDatabase;
  }

  async handler(c: Context): Promise<ApiResponse<ApplicationEntity[] | null>> {
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
      const sortBy = c.req.query('sortBy') || 'createdAt';
      const sortOrder = (c.req.query('sortOrder') || 'desc') as SortOrder;
      const dateRange = (c.req.query('dateRange') || 'all') as DateRange;
      const status = (c.req.query('status') || 'all') as
        | ApplicationStatus
        | 'all';

      const applicationRepo = await this.database.open(ApplicationEntity);

      let where: FindOptionsWhere<ApplicationEntity>[] = [];

      if (searchQuery.trim()) {
        // Search in multiple fields
        where = [
          { user: { id: userId }, jobTitle: ILike(`%${searchQuery}%`) },
          { user: { id: userId }, employer: ILike(`%${searchQuery}%`) },
          { user: { id: userId }, location: ILike(`%${searchQuery}%`) },
        ];
      } else {
        where = [{ user: { id: userId } }];
      }

      // Apply status filter to all where clauses
      if (status !== 'all') {
        where = where.map((w) => ({ ...w, status }));
      }

      if (dateRange !== 'all') {
        const now = new Date();
        const filterDate = this.getFilterDate(now, dateRange);
        where = where.map((w) => ({
          ...w,
          createdAt: Between(filterDate, now),
        }));
      }

      const order: Record<string, 'ASC' | 'DESC'> = {};
      const validSortFields = [
        'jobTitle',
        'employer',
        'location',
        'createdAt',
        'status',
      ];
      if (validSortFields.includes(sortBy)) {
        order[sortBy] = sortOrder.toUpperCase() as 'ASC' | 'DESC';
      } else {
        order.createdAt = 'DESC';
      }

      const applications = await applicationRepo.find({
        where,
        order,
      });

      return apiResponse(c, {
        data: applications,
        success: true,
        message: 'Applications retrieved successfully',
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
