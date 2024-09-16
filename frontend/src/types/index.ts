import { z } from "zod";

export type TNote = {
  _id: string;
  title: string;
  text?: string;
  createdAt: string;
  updatedAt: string;
};

export const noteSchema = z.object({
  title: z.string().min(1),
  text: z.string().optional(),
});

export type TNoteSchema = z.infer<typeof noteSchema>;

export type TAuthFormProps = "signin" | "signup";

export type TUser = {
  _id: string;
  username: string;
  email: string;
};

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type TSignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    username: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type TSignUpSchema = z.infer<typeof signUpSchema>;
