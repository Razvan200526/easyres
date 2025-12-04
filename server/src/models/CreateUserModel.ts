import type { UserType } from '@sdk/types';
import * as z from 'zod';
export type CreateUserModel = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  image?: string;
};
export const CreateUserModelSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  image: z.url().optional(),
});

export const validateUserModel = (
  data: Partial<Omit<UserType, 'id' | 'createdAt' | 'updatedAt' | 'image'>>,
) => {
  try {
    if (!CreateUserModelSchema.safeParse(data).success) {
      throw new Error(CreateUserModelSchema.safeParse(data).error?.message);
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
