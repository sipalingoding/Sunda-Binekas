import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  nohp: z.string().min(12, "No Hp minimal 12 digit"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const updateProfileSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
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
  sumber: z.string().nonempty("Sumber kudu diisi!"),
});

export const editProfileSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  nohp: z.string().min(12, "No Hp minimal 12 digit"),
  umur: z.preprocess((val) => Number(val), z.number().min(0)),
  pekerjaan: z.string(),
  alamat: z.string(),
  photo: z.string().optional(),
});
