import type { CreateApplicationFormData } from '@client/applications/components/CreateApplicationButton';
import type { Fetcher } from './Fetcher';
import type { ApplicationType, ResponseType } from './types';

export class ApplicationFetcher {
  constructor(readonly fetcher: Fetcher) { }

  public readonly apps = {
    retrieve: async (payload: { userId: string }): Promise<ResponseType<ApplicationType[]>> => {
      return this.fetcher.get(`/api/applications/${payload.userId}`);
    },

    getApp: async (payload: { applicationId: string }): Promise<ResponseType<ApplicationType>> => {
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
