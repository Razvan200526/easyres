import type { CreateApplicationFormData } from '@client/applications/components/CreateApplicationButton';
import type { ApplicationFilters } from '@client/resources/shared/filterUtils';
import type { Fetcher } from './Fetcher';
import type { ApplicationType, ResponseType } from './types';

export class ApplicationFetcher {
  constructor(readonly fetcher: Fetcher) {}

  public readonly apps = {
    filter: async (payload: {
      filters: ApplicationFilters;
      userId: string;
    }): Promise<ResponseType<ApplicationType[] | null>> => {
      const params = new URLSearchParams(
        Object.entries(payload.filters).map(([k, v]) => [k, String(v)]),
      );
      return this.fetcher.get(
        `/api/applications/${payload.userId}/filter?${params.toString()}`,
      );
      //TODO implment correct route
    },
    retrieve: async (payload: {
      userId: string;
    }): Promise<ResponseType<ApplicationType[]>> => {
      return this.fetcher.get(`/api/applications/${payload.userId}`);
    },

    getApp: async (payload: {
      applicationId: string;
    }): Promise<ResponseType<ApplicationType>> => {
      return this.fetcher.get(`/api/application/${payload.applicationId}`);
    },
    create: async (payload: {
      data: CreateApplicationFormData;
      userId: string;
    }): Promise<ResponseType> => {
      return await this.fetcher.post('/api/applications/create', payload);
    },
    update: async (payload: {
      data: FormData;
      applicationId: string;
    }): Promise<ResponseType> => {
      return this.fetcher.put(
        `/api/applications/update/${payload.applicationId}`,
      );
    },
  };
}
