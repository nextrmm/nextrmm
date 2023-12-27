import { z } from "zod";

export const authDataSchema = z.object({
  email: z.string().email(),
});

export const signinDataSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signupDataSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .refine(
      (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(value),
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter and one number",
      },
    ),
});
