"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "@/validators/auth";
import { z } from "zod";
import Image from "next/image";

interface ProfileFormProps {
  userData: {
    id: string;
    username: string;
    email: string;
    umur?: number;
    nohp: string;
    alamat?: string;
    pekerjaan?: string;
    photo?: string;
  };
}

const formSchema = editProfileSchema;

export default function ProfileFormClient({ userData }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(userData.photo || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      username: userData.username ?? "",
      nohp: userData.nohp ?? "",
      alamat: userData.alamat ?? "",
      pekerjaan: userData.pekerjaan ?? "",
      umur: userData.umur ?? 0,
      email: userData.email ?? "",
      photo: userData.photo ?? "",
    },
  });

  // Preview foto
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Simpan profil
  const handleSave = async (value: any) => {
    try {
      setLoading(true);

      let photoUrl = userData.photo;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.url) throw new Error("Upload foto gagal");
        photoUrl = uploadData.url;
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...value, photo: photoUrl }),
      });

      if (res.ok) {
        toast({
          title: "Berhasil Tersimpan",
          description: "Data profil berhasil disimpan",
          variant: "success",
        });
        router.replace("/");
      } else {
        toast({
          title: "Gagal Menyimpan",
          description: "Terjadi kesalahan saat menyimpan data",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 w-full px-4 sm:px-8 md:px-12 lg:px-24 py-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="space-y-6 w-full flex flex-col justify-between h-full"
        >
          {/* Grid dua kolom di desktop, satu kolom di HP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
            {/* Foto profil */}
            <div>
              <FormField
                control={form.control}
                name="photo"
                render={() => (
                  <FormItem>
                    <FormLabel>Foto Profil</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-start gap-3">
                        {preview ? (
                          <Image
                            src={preview}
                            alt="preview"
                            width={200}
                            height={200}
                            className="rounded-lg object-cover border w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]"
                          />
                        ) : (
                          <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            No Photo
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full sm:w-[300px]"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Kolom data diri */}
            <div className="space-y-6">
              {[
                {
                  name: "username",
                  label: "Wasta",
                  placeholder: "Lebetkeun Wasta",
                },
                {
                  name: "nohp",
                  label: "No HP",
                  placeholder: "Lebetkeun No HP",
                  type: "number",
                },
                {
                  name: "pekerjaan",
                  label: "Pagawean",
                  placeholder: "Lebetkeun Pagawean",
                },
                {
                  name: "alamat",
                  label: "Padumukan",
                  placeholder: "Lebetkeun Padumukan",
                },
                {
                  name: "umur",
                  label: "Umur",
                  placeholder: "Lebetkeun Umur",
                  type: "number",
                },
                {
                  name: "email",
                  label: "Surel",
                  placeholder: "Lebetkeun Surel",
                  type: "email",
                  disabled: true,
                },
              ].map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as keyof z.infer<typeof formSchema>}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...inputField}
                          placeholder={field.placeholder}
                          type={field.type || "text"}
                          disabled={field.disabled}
                          className="bg-white text-gray-900 border border-gray-300 h-[48px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Tombol Simpen */}
          <div className="flex justify-end items-center mt-8">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#fafafa] rounded-full px-6 py-2 w-fit font-semibold gap-3 h-[44px] hover:bg-gray-100 border"
            >
              <span className="font-semibold text-lg">Simpen</span>
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#000] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaArrowRight />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
