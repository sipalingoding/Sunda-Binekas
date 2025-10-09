import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  gender: z.enum(["laki-laki", "perempuan"], {
    errorMap: () => ({ message: "Gender wajib dipilih" }),
  }),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const updateProfileSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  gender: z.enum(["laki-laki", "perempuan"], {
    errorMap: () => ({ message: "Gender wajib dipilih" }),
  }),
});

export const sumbanganSchema = z.object({
  name: z.string().min(3, "Username minimal 3 karakter"),
  isAnonim: z.boolean(),
  saran: z.string().min(1, "Pesan saran wajib diisi"),
});

export const formSubmitDongengSchema = z.object({
  kabupaten: z.string().nonempty("Kabupaten kudu diisi!"),
  kecamatan: z.string().nonempty("Kecamatan kudu diisi!"),
  desa: z.string().nonempty("Desa kudu diisi!"),
  judul: z.string().nonempty("Judul kudu diisi!"),
  eusi: z.string().nonempty("eusi kudu diisi!"),
});
