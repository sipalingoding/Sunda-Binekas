"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formSubmitDongengSchema } from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Trash } from "lucide-react";

const formSchema = formSubmitDongengSchema;

const FormPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<string>();
  const [langitude, setLangitude] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      kabupaten: "",
      kecamatan: "",
      desa: "",
      judul: "",
      eusi: "",
    },
  });

  const [kamusList, setKamusList] = useState<
    { kata: string; pengertian: string }[]
  >([{ kata: "", pengertian: "" }]);

  // Fungsi untuk menambah baris kamus
  const addKamus = () => {
    setKamusList([...kamusList, { kata: "", pengertian: "" }]);
  };

  // Fungsi untuk menghapus baris kamus
  const removeKamus = (index: number) => {
    setKamusList(kamusList.filter((_, i) => i !== index));
  };

  // Fungsi untuk ubah nilai kata/pengertian
  const updateKamus = (
    index: number,
    field: "kata" | "pengertian",
    value: string
  ) => {
    const updated = [...kamusList];
    updated[index][field] = value;
    setKamusList(updated);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const payload = {
      ...values,
      lat: latitude,
      lan: langitude,
      kamus: kamusList.filter((k) => k.kata && k.pengertian),
    };

    const res = await fetch("/api/dongeng", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      toast({
        title: "Data Parantos Disimpen",
        description:
          "Dongeng anjeun bade di pariksa heula ku kurator, pami tos valid engke di email.",
        variant: "success",
      });
      router.replace("/maos");
    } else {
      toast({
        title: "Error nyimpen data",
        description: data.error,
        variant: "destructive",
      });
    }

    setLoading(true);
  };

  const [kabupatenList, setKabupatenList] = useState<
    { id: string; province_id: string; name: string }[]
  >([]);

  const [kecamatanList, setKecamatanList] = useState<
    {
      id: string;
      regency_id: string;
      name: string;
    }[]
  >([]);
  const [desaList, setDesaList] = useState<
    {
      id: string;
      id_district: string;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    async function fetchKabupaten() {
      try {
        const res = await fetch(
          "https://www.emsifa.com/api-wilayah-indonesia/api/regencies/32.json"
        );
        const data = await res.json();
        setKabupatenList(data);
      } catch (error) {
        console.error("Gagal mengambil data kabupaten:", error);
      }
    }

    fetchKabupaten();
  }, []);

  useEffect(() => {
    const selectedKabupaten = kabupatenList.find(
      (k) => k.name === form.watch("kabupaten")
    );
    if (!selectedKabupaten) return;

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedKabupaten.id}.json`
    )
      .then((res) => res.json())
      .then((data) => setKecamatanList(data))
      .catch((err) => console.error("Gagal ambil kecamatan:", err));
  }, [form.watch("kabupaten")]);

  useEffect(() => {
    const selectedKecamatan = kecamatanList.find(
      (k) => k.name === form.watch("kecamatan")
    );
    if (!selectedKecamatan) return;

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api//villages/${selectedKecamatan.id}.json`
    )
      .then((res) => res.json())
      .then((data) => setDesaList(data))
      .catch((err) => console.error("Gagal ambil desa:", err));
  }, [form.watch("kecamatan")]);

  useEffect(() => {
    if (!form.watch("kabupaten")) return;
    const fullAddress = `${form.getValues("kabupaten")}`;
    const encoded = encodeURIComponent(fullAddress);
    const fetchCoordinates = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&addressdetails=1&limit=1`,
          {
            headers: { "User-Agent": "NextJS-Geocoding-Demo/1.0" },
          }
        );
        const data = await res.json();

        if (data.length > 0) {
          setLatitude(data[0].lat);
          setLangitude(data[0].lon);
        } else {
          console.log("Koordinat tidak ditemukan");
        }
      } catch (err) {
        console.error("Gagal mengambil koordinat:", err);
      }
    };

    fetchCoordinates();
  }, [form.watch("kabupaten")]);

  return (
    <div className="rounded-lg p-8 flex flex-col gap-8">
      <span className="font-bold text-3xl">Pengisian Data</span>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="kabupaten"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kabupaten</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-white text-black border border-gray-300 w-full min-h-[50px] flex items-center">
                          <SelectValue placeholder="Pilih Kabupaten" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black max-h-60 overflow-y-auto">
                          {kabupatenList.map((item) => (
                            <SelectItem key={item.id} value={item.name}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kecamatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kecamatan</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!form.watch("kabupaten")}
                      >
                        <SelectTrigger className="bg-white text-black border border-gray-300 w-full min-h-[50px]">
                          <SelectValue placeholder="Pilih Kecamatan" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black max-h-60 overflow-y-auto">
                          {kecamatanList.map((item) => (
                            <SelectItem key={item.id} value={item.name}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desa</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!form.watch("kecamatan")}
                      >
                        <SelectTrigger className="bg-white text-black border border-gray-300 w-full min-h-[50px]">
                          <SelectValue placeholder="Pilih Desa" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black max-h-60 overflow-y-auto">
                          {desaList.map((item) => (
                            <SelectItem key={item.id} value={item.name}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="judul"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Lebetkeun Judul"
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
                name="eusi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eusi Dongeng</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={14}
                        placeholder="Lebetkeun Eusi Dongeng"
                        {...field}
                        className="bg-white text-gray-900 border border-gray-300 px-4 py-2 w-full rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-6">
                <FormLabel>Kamus (Opsional)</FormLabel>
                <div className="space-y-4 mt-2">
                  {kamusList.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Input
                        placeholder="Kata"
                        value={item.kata}
                        onChange={(e) =>
                          updateKamus(index, "kata", e.target.value)
                        }
                        className="bg-white border border-gray-300 px-4 py-2 w-1/3"
                      />
                      <Input
                        placeholder="Pengertian"
                        value={item.pengertian}
                        onChange={(e) =>
                          updateKamus(index, "pengertian", e.target.value)
                        }
                        className="bg-white border border-gray-300 px-4 py-2 flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeKamus(index)}
                        className="text-red-500"
                      >
                        <Trash size={18} />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  onClick={addKamus}
                  variant="outline"
                  className="mt-4 text-sm"
                >
                  <Plus size={16} className="mr-2" />
                  Tambah Kata
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-[#fafafa]">
              <span className="font-semibold">Simpen</span>
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                ""
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormPage;
