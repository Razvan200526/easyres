import { backend } from '@client/shared/backend';
import { queryClient } from '@client/shared/QueryClient';
import type { ApplicationType } from '@sdk/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { CreateApplicationFormData } from '../components/CreateApplicationButton';

export const useApplications = (userId: string) => {
  return useQuery({
    queryKey: ['applications', 'retrieve'],
    queryFn: async () => {
      console.debug('User id', userId);
      const res = await backend.apps.apps.retrieve({
        userId: userId,
      });
      return res.data;
    },
  });
};

export const useGetApplication = (applicationId: string) => {
  return useQuery({
    queryKey: ['applications', 'retrieve', applicationId],
    queryFn: async () => {
      const res = await backend.apps.apps.getApp({
        applicationId: applicationId,
      });
      return res.data as ApplicationType;
    },
  });
};

export const useCreateApplication = () => {
  return useMutation({
    mutationFn: async (variables: {
      userId: string;
      data: CreateApplicationFormData;
    }) => {
      const { userId, data } = variables;
      return backend.apps.apps.create({
        data: data,
        userId: userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['applications', 'retrieve'],
      });
    },
  });
};
