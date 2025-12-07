import { Toast } from '../common/components/toast';
import { queryClient } from '../shared/QueryClient';
import type { Fetcher } from './Fetcher';
import { Socket, type SocketResponseType } from './Socket';
import type { ResponseType, ResumeChatResponseType, ResumeType } from './types';

export class ResumeFetcher {
  constructor(readonly fetcher: Fetcher) {}

  public readonly resumes = {
    retrieve: async (payload: { userId: string }): Promise<ResponseType> => {
      return this.fetcher.get(`/api/resumes/${payload.userId}`);
    },
    // upload: async (payload: {
    //   userId: string;
    //   url: string;
    // }): Promise<ResponseType> => {
    //   return this.fetcher.post(
    //     `/api/resumes/${payload.userId}/upload`,
    //     payload,
    //   );
    // },
    delete: async (payload: {
      resumeIds: string[];
      userId: string;
    }): Promise<ResponseType> => {
      return this.fetcher.delete('/api/resumes/delete', payload);
    },
    get: async (payload: { id: string }): Promise<ResponseType> => {
      return this.fetcher.get(`/api/resume/${payload.id}`);
    },
    getSuggestions: async (payload: { id: string }): Promise<ResponseType> => {
      this.fetcher.config.baseURL = import.meta.env.VITE_PY_URL as string;
      const res = this.fetcher.get(`/api/suggestions/resume/${payload.id}`);
      this.fetcher.config.baseURL = import.meta.env.VITE_APP_URL as string;
      return res;
    },
    rename: async (payload: {
      id: string;
      newName: string;
    }): Promise<ResponseType> => {
      return this.fetcher.patch(`/api/resume/${payload.id}/rename`, {
        newName: payload.newName,
      });
    },
  };

  public readonly create = (payload: { url: string }) => {
    const socket = new Socket('ws://localhost:2000');

    socket.on<{ resume: ResumeType }>('message', (response) => {
      queryClient.invalidateQueries();

      const isReady = response.data.resume.isReady;
      const isFailed = response.data.resume.state === 'failed';

      if (isReady || isFailed) {
        socket.close();
      }

      if (isReady) {
        Toast.success({ description: 'Resume uploaded sucessfully' });
      }

      socket.send({
        channelName: 'resume:create',
        data: {
          url: payload.url,
        },
      });
    });

    Toast.info({ description: 'Uploading resume' });
  };

  public readonly chat = (payload: {
    resumeId: string;
    query: string;
    onMessage: (
      response: SocketResponseType<ResumeChatResponseType>,
      ws: Socket,
    ) => void;
  }) => {
    const socket = new Socket(import.meta.env.VITE_PY_URL as string);
    socket.on(
      'message',
      (response: SocketResponseType<ResumeChatResponseType>) => {
        payload.onMessage(response, socket);
      },
    );
    socket.send({
      channelName: 'resume:chat',
      data: {
        resumeId: payload.resumeId,
        query: payload.query,
      },
    });
    return socket;
  };
}
