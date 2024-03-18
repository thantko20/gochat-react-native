import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  username: z
    .string({ required_error: "Username is required" })
    .min(1, "Username is required"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must have at least 6 characters")
});

export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(1, "Username is required"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must have at least 6 characters")
});

export type LoginDto = z.infer<typeof loginSchema>;
