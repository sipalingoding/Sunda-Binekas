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

  // hanya preview, tidak upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // upload baru dilakukan di sini
  const handleSave = async (value: any) => {
    try {
      setLoading(true);

      let photoUrl = userData.photo;

      // jika user memilih file baru
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

      // kirim data profil beserta URL foto (kalau ada)
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
    <div className="space-y-5 w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="space-y-6 w-full flex flex-col justify-between h-full"
        >
          <div className="grid grid-cols-2 gap-10 w-full">
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
                            width={400}
                            height={400}
                            className="rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            No Photo
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-[400]"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-8 ">
              {/* FORM FIELD LAINNYA */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wasta</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Lebetkeun Wasta"
                        {...field}
                        className="bg-white text-gray-900 border border-gray-300 h-[50px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nohp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No HP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Lebetkeun No HP"
                        {...field}
                        type="number"
                        className="bg-white text-gray-900 border border-gray-300 h-[50px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pekerjaan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pagawean</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Lebetkeun Pagawean"
                        {...field}
                        className="bg-white text-gray-900 border border-gray-300 h-[50px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Padumukan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Lebetkeun Padumukan"
                        {...field}
                        className="bg-white text-gray-900 border border-gray-300 h-[50px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="umur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Umur</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Lebetkeun Umur"
                        {...field}
                        type="number"
                        className="bg-white text-gray-900 border border-gray-300 h-[50px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surel</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Lebetkeun Surel"
                        {...field}
                        className="bg-white text-gray-900 border border-gray-300 h-[50px]"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* BUTTON SIMPEN */}
          <div className="flex justify-end items-center">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#fafafa] rounded-full px-4 py-2 w-[155px] font-semibold gap-4 h-[44px]"
            >
              <span className="font-semibold text-lg">Simpen</span>
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#fafafa] border-t-transparent rounded-full animate-spin"></div>
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
