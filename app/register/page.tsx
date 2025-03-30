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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validators/auth";
import * as z from "zod";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = registerSchema;

const Register = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      gender: "",
      password: "",
    },
  });

  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    registerUser(values)
      .then(() => {
        router.replace("/login");
      })
      .catch((error) =>
        toast({
          title: "Terjadi Kesalahan",
          description: error.response?.data?.error,
          variant: "destructive",
        })
      );
  }

  return (
    <div className="relative min-h-screen grid grid-cols-2">
      {/* Background Image Fullscreen */}
      <div className="col-span-1">
        <Image
          src="/images/BACKGROUND-WEBSUN.jpeg"
          alt="Background"
          className="absolute z-[-1] w-full h-full object-cover"
          fill
          sizes="100vw"
        />
      </div>

      {/* Form Section (posisi tengah kanan) */}
      <div
        className="flex min-h-screen w-full items-center px-24 py-12"
        style={{
          background: "rgba(255, 255, 255, 0.70)", // 🔥 Background transparan
          backdropFilter: "blur(4px)", // 🔥 Efek blur kaca
        }}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full flex flex-col justify-between h-full"
          >
            <div className="text-center space-y-2">
              <h1 className="font-bold text-2xl">Sampurasun</h1>
              <h1 className="text-lg">Hayu Daptar Heula</h1>
            </div>

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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="bg-white text-black border border-gray-300 w-full min-h-[50px] flex items-center">
                          <SelectValue placeholder="Milih Gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black">
                          <SelectItem value="laki-laki">Lalaki</SelectItem>
                          <SelectItem value="perempuan">Awewe</SelectItem>
                        </SelectContent>
                      </Select>
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
                          className="bg-white text-gray-900 border border-gray-300 rounded-md h-[50px]"
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

            <div className="flex justify-center items-center">
              <Button
                type="submit"
                className="bg-green-700 rounded-full px-4 py-2 text-white w-[155px] font-semibold gap-4 h-[44px]"
              >
                <span className="font-semibold text-lg">Lebet</span>{" "}
                <FaArrowRight />
              </Button>
            </div>

            <div className="flex flex-col justify-center items-center gap-2">
              <div className="flex gap-2 items-center">
                <h1 className="text-base">Atanapi daptar nganggo</h1>
                <FcGoogle size={25} className="hover:cursor-pointer" />
              </div>

              <h1 className="text-base">
                Tos Kagungan Akun?{" "}
                <span className="font-bold text-lg hover:cursor-pointer">
                  Lebet
                </span>
              </h1>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
