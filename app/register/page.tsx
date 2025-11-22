"use client";

import { useRouter } from "next/navigation";
import { registerUser } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validators/auth";
import * as z from "zod";
import { FaArrowRight } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

const formSchema = registerSchema;

const Register = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      nohp: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await registerUser(values);
      router.replace("/login");
    } catch (error: any) {
      toast({
        title: "Terjadi Kesalahan",
        description: error.response?.data?.error || "Gagal mendaftar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleLoginGoogle = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#fafafa]">
      {/* LEFT SIDE (image / kosong) */}
      <div className="hidden md:block h-screen w-full">
        <Image
          src="/images/login.png"
          alt="bg"
          fill
          className="object-cover object-left"
        />
      </div>
      {/* RIGHT SIDE (Form Section) */}
      <div
        className="flex min-h-screen w-full items-center justify-center px-6 sm:px-10 md:px-16 lg:px-24 py-12"
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(4px)",
        }}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-10 w-full max-w-md flex flex-col justify-center"
          >
            {/* HEADER */}
            <div className="text-center space-y-2">
              <h1 className="font-bold text-3xl md:text-4xl">Sampurasun</h1>
              <p className="text-base md:text-lg text-gray-600">
                Hayu Daptar Heula
              </p>
            </div>

            {/* INPUT FIELDS */}
            <div className="space-y-6">
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
                        className="bg-white text-gray-900 border border-gray-300 h-[50px] rounded-md"
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
                        type="number"
                        {...field}
                        className="bg-white text-gray-900 border border-gray-300 h-[50px] rounded-md"
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
                        className="bg-white text-gray-900 border border-gray-300 h-[50px] rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sandi</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Lebetkeun Sandi"
                          {...field}
                          className="bg-white text-gray-900 border border-gray-300 h-[50px] rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? (
                            <FaEyeSlash size={20} />
                          ) : (
                            <IoEyeSharp size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-center items-center">
              <Button
                type="submit"
                className="bg-[#fafafa] rounded-full px-6 py-2 w-[155px] font-semibold gap-3 h-[44px]"
              >
                <span className="text-lg font-semibold">
                  {loading ? "Ngantosan..." : "Lebet"}
                </span>
                {!loading && <FaArrowRight />}
              </Button>
            </div>

            {/* GOOGLE & LOGIN LINK */}
            <div className="flex flex-col justify-center items-center gap-3 text-center">
              <div className="flex gap-2 items-center">
                <span className="text-base text-gray-700">
                  Atanapi daptar nganggo
                </span>
                <FcGoogle
                  size={25}
                  className="hover:cursor-pointer"
                  onClick={handleLoginGoogle}
                />
              </div>

              <p className="text-base text-gray-700">
                Tos Kagungan Akun?{" "}
                <span
                  className="font-bold hover:underline hover:cursor-pointer"
                  onClick={() => router.replace("/login")}
                >
                  Lebet
                </span>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
