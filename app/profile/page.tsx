"use client";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerSchema } from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowRight, FaEyeSlash } from "react-icons/fa6";
import { IoMdArrowDropright } from "react-icons/io";
import { IoEyeSharp } from "react-icons/io5";
import { z } from "zod";

const formSchema = registerSchema;

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectGender, setSelectGender] = useState("");

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="relative min-h-screen p-12 flex items-center justify-center ">
      <Image
        src="/images/BACKGROUND-WEBSUN.jpeg"
        alt="Background"
        className="absolute z-[-1] w-full h-full object-cover"
        fill
        sizes="100vw"
      />
      <Sidebar />
      <div
        className="w-[805px] h-[754px] rounded-md flex flex-col justify-start p-9 items-center gap-8"
        style={{
          background: "rgba(255, 255, 255, 0.20)", // 🔥 Background transparan
          backdropFilter: "blur(2px)", // 🔥 Efek blur kaca
        }}
      >
        <h1 className="text-white text-3xl font-bold">Profil</h1>
        <div className="flex gap-8">
          <div className="w-[273px] h-[528px] bg-white rounded-md flex flex-col p-8 gap-8 items-center justify-between">
            <h1 className="font-semibold">Karakter Anjeun</h1>
            {selectGender === "perempuan" ? (
              <Image
                src="/images/karakter-awewe.png"
                alt="karakter"
                width="134"
                height="741"
                style={{ height: "741px", width: "134px", objectFit: "cover" }}
              />
            ) : (
              <Image
                src="/images/karakter.png"
                alt="karakter"
                width="134"
                height="341"
              />
            )}
            <span className="text-sm text-center">
              otomatis ngubah pami ngagentos gender
            </span>
          </div>
          <div className="w-[430px] h-[528px] bg-white rounded-md py-8 px-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 w-full flex flex-col justify-between h-full"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        Wasta <span className="text-red-500">*</span>
                      </FormLabel>
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
                      <FormLabel className="font-bold">
                        Surel<span className="text-red-500">*</span>
                      </FormLabel>
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
                      <FormLabel className="font-bold">
                        Gender<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectGender(value);
                          }}
                        >
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
                      <FormLabel className="font-bold">
                        Sandi<span className="text-red-500">*</span>
                      </FormLabel>
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

                <div className="flex justify-center items-center">
                  <Button
                    type="submit"
                    className="bg-green-700 rounded-full px-4 py-2 text-white w-[155px] font-semibold gap-4 h-[44px]"
                  >
                    <span className="font-semibold text-lg">Lebet</span>{" "}
                    <FaArrowRight />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <Button className="flex justify-between py-2 px-8 bg-red-700 self-start">
          <span className="text-white">Kaluar Akun</span>
          <IoMdArrowDropright color="white" />
        </Button>
      </div>
    </div>
  );
}
