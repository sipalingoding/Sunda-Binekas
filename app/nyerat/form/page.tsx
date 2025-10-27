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
  const [idKab, setIdKab] = useState<any>();
  const [idKec, setIdKec] = useState<any>();
  const [idDesa, setIdDesa] = useState<any>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      kabupaten: "",
      kecamatan: "",
      desa: "",
      judul: "",
      eusi: "",
      sumber: "",
    },
  });

  const [kamusList, setKamusList] = useState<
    { kata: string; pengertian: string }[]
  >([{ kata: "", pengertian: "" }]);

  const addKamus = () =>
    setKamusList([...kamusList, { kata: "", pengertian: "" }]);
  const removeKamus = (index: number) =>
    setKamusList(kamusList.filter((_, i) => i !== index));
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
    setLoading(true);
    const payload = {
      ...values,
      lat: latitude,
      lan: langitude,
      kamus: kamusList.filter((k) => k.kata && k.pengertian),
      kabupaten_id: idKab,
      kecamatan_id: idKec,
      desa_id: idDesa,
    };

    try {
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
    } catch (err) {
      console.error(err);
      toast({
        title: "Gagal koneksi",
        description: "Aya kasalahan dina sambungan jaringan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data wilayah
  const [kabupatenList, setKabupatenList] = useState<any[]>([]);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaList, setDesaList] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/regencies/32.json")
      .then((res) => res.json())
      .then(setKabupatenList)
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const selectedKab = kabupatenList.find(
      (k) => k.name === form.watch("kabupaten")
    );

    setIdKab(selectedKab?.id);
    if (!selectedKab) return;
    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedKab.id}.json`
    )
      .then((res) => res.json())
      .then(setKecamatanList)
      .catch(console.error);
  }, [form.watch("kabupaten")]);

  useEffect(() => {
    const selectedKec = kecamatanList.find(
      (k) => k.name === form.watch("kecamatan")
    );
    setIdKec(selectedKec?.id);
    if (!selectedKec) return;
    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedKec.id}.json`
    )
      .then((res) => res.json())
      .then(setDesaList)
      .catch(console.error);
  }, [form.watch("kecamatan")]);

  useEffect(() => {
    const selectedDesa = desaList.find((k) => k.name === form.watch("desa"));
    setIdDesa(selectedDesa?.id);
  }, [form.watch("desa")]);

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
    <div className="px-4 sm:px-8 md:px-16 py-6 md:py-10">
      <span className="font-bold text-2xl sm:text-3xl">Pengisian Data</span>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* Grid Responsif */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Kiri */}
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
                        <SelectTrigger className="w-full min-h-[48px]">
                          <SelectValue placeholder="Pilih Kabupaten" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto bg-white">
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
                        <SelectTrigger className="w-full min-h-[48px]">
                          <SelectValue placeholder="Pilih Kecamatan" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto bg-white">
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
                        <SelectTrigger className="w-full min-h-[48px]">
                          <SelectValue placeholder="Pilih Desa" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto bg-white">
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

              <FormField
                control={form.control}
                name="sumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sumber Dongeng</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Lebetkeun Sumber" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Kanan */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="judul"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Lebetkeun Judul" />
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
                        {...field}
                        rows={10}
                        placeholder="Lebetkeun Eusi Dongeng"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Kamus Section */}
              <div>
                <FormLabel>Kamus (Opsional)</FormLabel>
                <div className="space-y-3 mt-3">
                  {kamusList.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                    >
                      <Input
                        placeholder="Kata"
                        value={item.kata}
                        onChange={(e) =>
                          updateKamus(index, "kata", e.target.value)
                        }
                        className="sm:w-1/3"
                      />
                      <Input
                        placeholder="Pengertian"
                        value={item.pengertian}
                        onChange={(e) =>
                          updateKamus(index, "pengertian", e.target.value)
                        }
                        className="flex-1"
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

          {/* Tombol Submit */}
          <div className="flex justify-end">
            <Button
              className="bg-gray-900 text-white hover:bg-gray-700 w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="font-semibold">Simpen</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormPage;
