import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  gender: z.enum(["laki-laki", "perempuan"]).optional().or(z.literal("")),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const updateProfileSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  gender: z.enum(["laki-laki", "perempuan"]).optional().or(z.literal("")),
});
