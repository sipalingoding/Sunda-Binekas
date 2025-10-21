"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // kalau kamu pakai shadcn toast (opsional)
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
import { editProfileSchema, registerSchema } from "@/validators/auth";
import { z } from "zod";

interface ProfileFormProps {
  userData: {
    id: string;
    username: string;
    email: string;
    umur?: number;
    nohp: string;
    alamat?: string;
    pekerjaan?: string;
  };
}

const formSchema = editProfileSchema;

export default function ProfileFormClient({ userData }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    },
  });

  const handleSave = async (value: any) => {
    try {
      setLoading(true);

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      if (res.ok) {
        toast({
          title: "Berhasil Tersimpan",
          description: "data berhasil disimpan",
          variant: "success",
        });
        router.replace("/");
      } else {
        toast({
          title: "Terjadi Kesalahan",
          description: "Gagal tersimpan",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Terjadi Kesalahan",
        description: err,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 w-full max-w-3xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="space-y-6 w-full flex flex-col justify-between h-full"
        >
          <div className="space-y-8">
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
                      className="bg-white text-gray-900 border border-gray-300 px-4 py-2 w-full h-[50px] rounded-md"
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
                      className="bg-white text-gray-900 border border-gray-300 px-4 py-2 w-full h-[50px] rounded-md"
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
                      className="bg-white text-gray-900 border border-gray-300 px-4 py-2 w-full h-[50px] rounded-md"
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
                      className="bg-white text-gray-900 border border-gray-300 px-4 py-2 w-full h-[50px] rounded-md"
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
                      className="bg-white text-gray-900 border border-gray-300 px-4 py-2 w-full h-[50px] rounded-md"
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
                      className="bg-white text-gray-900 border border-gray-300 rounded-md h-[50px]"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end items-center">
            <Button
              type="submit"
              className="bg-[#fafafa] rounded-full px-4 py-2 w-[155px] font-semibold gap-4 h-[44px]"
            >
              <span className="font-semibold text-lg">Simpen</span>
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
