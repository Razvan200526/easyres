import { backend } from '@client/shared/backend';
import { queryClient } from '@client/shared/QueryClient';
import { useMutation, useQuery } from '@tanstack/react-query';

export interface ChatSession {
  id: string;
  resourceType: 'resume' | 'coverletter';
  resourceId: string;
  resourceName: string;
  lastMessageAt: Date;
  messageCount: number;
  lastMessage: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Add these new hooks to the existing hooks.ts file

export const useChatSessions = (userId: string) => {
  return useQuery({
    queryKey: ['chatSessions', userId],
    queryFn: async () => {
      try {
        const response = await backend.chat.sessions.retrieve({ userId });
        return response.data as ChatSession[];
      } catch (error) {
        console.error('Failed to fetch chat sessions:', error);
        return [];
      }
    },
    enabled: !!userId,
  });
};
export const useChatSession = (
  resourceType: 'resume' | 'coverletter',
  resourceId: string,
) => {
  return useQuery({
    queryKey: ['chatSession', resourceType, resourceId],
    queryFn: async () => {
      const response = await backend.chat.sessions.getByResource({
        resourceType,
        resourceId,
      });
      return response.data;
    },
    enabled: !!resourceId,
  });
};

export const useGetChatSession = (
  resourceType: 'resume' | 'coverletter',
  resourceId: string,
) => {
  return useQuery({
    queryKey: ['chatSession', resourceType, resourceId],
    queryFn: async () => {
      try {
        const response = await backend.chat.sessions.getByResource({
          resourceType,
          resourceId,
        });
        return response.data;
      } catch (error) {
        console.error('Failed to fetch chat session:', error);
        return null;
      }
    },
    enabled: !!resourceId,
  });
};
export const useChatMessages = (sessionId: string) => {
  return useQuery({
    queryKey: ['chatMessages', sessionId],
    queryFn: async () => {
      try {
        const response = await backend.chat.messages.retrieve({ sessionId });
        return response.data as ChatMessage[];
      } catch (error) {
        console.error('Failed to fetch chat messages:', error);
        return [];
      }
    },
    enabled: !!sessionId,
  });
};

export const useCreateChatSession = () => {
  return useMutation({
    mutationFn: async (data: {
      resourceType: 'resume' | 'coverletter';
      resourceId: string;
      resourceName: string;
    }) => {
      const response = await backend.chat.sessions.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chatSessions'],
      });
    },
  });
};

export const useSaveChatMessage = () => {
  return useMutation({
    mutationFn: async (data: {
      sessionId: string;
      content: string;
      sender: 'user' | 'ai';
    }) => {
      return backend.chat.messages.create(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['chatMessages', variables.sessionId],
      });
    },
  });
};
