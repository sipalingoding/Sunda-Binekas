"use client";

import { useRouter } from "next/navigation";
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
import { loginSchema } from "@/validators/auth";
import * as z from "zod";
import { FaArrowRight } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

const formSchema = loginSchema;

const LoginPage = () => {
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      toast({
        title: "Gagal masuk",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  }

  const handleLoginGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error)
      toast({
        title: "Login gagal",
        description: error.message,
        variant: "destructive",
      });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] grid grid-cols-1 md:grid-cols-2">
      {/* Left side (gambar atau kosong) */}
      <div className="hidden md:block h-screen w-full">
        <Image
          src="/images/login.png"
          alt="bg"
          fill
          className="object-cover object-left"
        />
      </div>

      {/* Form Section */}
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
            className="space-y-12 w-full max-w-md flex flex-col justify-center"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="font-bold text-3xl md:text-4xl">Sampurasun</h1>
              <p className="text-base md:text-lg text-gray-600">
                Hayu Daptar Heula
              </p>
            </div>

            {/* Input Fields */}
            <div className="space-y-6">
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
                        className="bg-white border border-gray-300 rounded-md h-[50px]"
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
                          className="bg-white border border-gray-300 rounded-md h-[50px]"
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

            {/* Submit Button */}
            <div className="flex justify-center items-center">
              <Button
                type="submit"
                className="bg-[#fafafa] rounded-full px-6 py-2 w-[155px] font-semibold gap-3 h-[44px]"
              >
                <span className="text-lg font-semibold">Lebet</span>
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaArrowRight />
                )}
              </Button>
            </div>

            {/* Google & Register Section */}
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
                Teu acan Kagungan Akun?{" "}
                <span
                  className="font-bold hover:underline hover:cursor-pointer"
                  onClick={() => router.replace("/register")}
                >
                  Daftar
                </span>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
