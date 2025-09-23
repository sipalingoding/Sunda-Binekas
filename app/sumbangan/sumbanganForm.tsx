"use client";

import Sidebar from "@/components/sidebar";
import Image from "next/image";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { sumbanganSchema } from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

const formSchema = sumbanganSchema;

const SumbanganForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  console.log(setLoading);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });
  return (
    <div className="relative min-h-screen p-12 flex justify-center">
      <Image
        src="/images/BACKGROUND-WEBSUN.jpeg"
        alt="Background"
        className="absolute z-[-1] w-full h-full object-cover"
        fill
        sizes="100vw"
      />
      <Sidebar />
      <div
        className="w-[1155px] h-[874px] rounded-md flex flex-col justify-start p-9 items-center gap-8"
        style={{
          background: "rgba(255, 255, 255, 0.20)",
          backdropFilter: "blur(2px)",
        }}
      >
        <span className="font-extrabold text-white text-3xl">Sumbangan</span>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-md flex flex-col gap-4 p-4">
            <p>
              Website ieu dikembangkeun ku muda mudi urang Sunda anu ngarasa
              reueus kana budayana, diwadahan ku sundabinékas.com
            </p>
            <p>
              Tujuanna pikeun diajar bahasa Sunda sacara ringkes tur ngaliwatan
              média online. Upami aya anu hoyong ngarojong kana tarékah ieu, boh
              sacara matéril atawa non materil tiasa ngalangkungan surélék
              admin.sundabinékas@gmail.com
            </p>
            <p>Hatur Nuhun Kana Rojonganana</p>
            <div className="flex justify-center">
              <div className="flex items-center gap-8">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>Eggy Aditiar</span>
                <span>1st</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-white opacity-90 rounded-md flex flex-col p-4 justify-center items-center w-full">
              <span className="font-bold">Hatur Nuhun Ka</span>
              <div></div>
            </div>
            <Form {...form}>
              <div className="bg-white opacity-90 rounded-md flex flex-col p-4 justify-center items-center w-full gap-4">
                <span>Isian Sumbangan</span>
                <div className="flex flex-col gap-2 w-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Wasta atanapi inisial"
                            className="border-[#D9D9D9] bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 items-center">
                    <Checkbox id="name" />
                    <label htmlFor="name" className="text-sm text-gray-500">
                      Namina anonimkeun
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Input
                    placeholder="Masukan kanggo abi sadaya salaku pengelola website"
                    className="border-[#D9D9D9] bg-white"
                  />
                  <span className="text-xs text-gray-500 font-normal">
                    Punten, nyuhunkeun nganggo basa anu sopan kalih lemes
                  </span>
                </div>
                <Button
                  type="submit"
                  className="bg-green-700 rounded-full px-4 py-2 text-white w-[155px] font-semibold gap-4 h-[44px]"
                >
                  <span className="font-semibold text-lg">Transfer</span>
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaArrowRight />
                  )}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SumbanganForm;
