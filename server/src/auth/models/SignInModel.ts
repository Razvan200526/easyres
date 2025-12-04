import * as z from 'zod';

export type SignInModel = {
  email: string;
  password: string;
};

export const SignInModelSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const validateSignInModel = (data: SignInModel) => {
  return z.safeParse(SignInModelSchema, data).success;
};
