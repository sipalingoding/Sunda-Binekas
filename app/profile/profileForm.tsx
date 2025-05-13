"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateProfileSchema } from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import Sidebar from "@/components/sidebar";
import { IoMdArrowDropright } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { logout } from "@/services/authService";

type User = {
  id: string;
  username: string;
  email?: string;
  gender: string;
  password?: string;
};

const formSchema = updateProfileSchema;

export default function ProfileForm({ user }: { user: User }) {
  const [selectGender, setSelectGender] = useState(user.gender || "");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      username: user.username,
      email: user.email,
      gender: user.gender as undefined | "laki-laki" | "perempuan",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.username,
        gender: values.gender,
        email: values.email,
      }),
    })
      .then(() => {
        toast({
          title: "Berhasil Submit",
          description: "Update profile berhasil",
          variant: "success",
        });
        router.replace("/");
      })
      .catch((error) =>
        toast({
          title: "Terjadi Kesalahan",
          description: error.response?.data?.error,
          variant: "destructive",
        })
      )
      .finally(() => setLoading(false));
  }

  const handleLogout = () => {
    logout();
  };

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
          background: "rgba(255, 255, 255, 0.20)",
          backdropFilter: "blur(2px)",
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
                className="space-y-6 w-full flex flex-col justify-start h-full"
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  disabled
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        Surel <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
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
                        Gender <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={selectGender}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectGender(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="laki-laki">Lalaki</SelectItem>
                            <SelectItem value="perempuan">Awewe</SelectItem>
                          </SelectContent>
                        </Select>
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
                    <span className="font-semibold text-lg">Lebet</span>
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
        </div>
        <Button className="flex justify-between py-2 px-8 bg-red-700 self-start">
          <span className="text-white" onClick={handleLogout}>
            Kaluar Akun
          </span>
          <IoMdArrowDropright color="white" />
        </Button>
      </div>
    </div>
  );
}
