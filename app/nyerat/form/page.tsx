"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formSubmitDongengSchema } from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Trash, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";

const formSchema = formSubmitDongengSchema;

const TipTapEditor = dynamic(
  () => import("@/components/tip-tap-editor/TipTapEditor"),
  { ssr: false }
);

const FormPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState<string>();
  const [langitude, setLangitude] = useState<string>();
  const [idKab, setIdKab] = useState<any>();
  const [idKec, setIdKec] = useState<any>();
  const [idDesa, setIdDesa] = useState<any>();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: { kabupaten: "", kecamatan: "", desa: "", judul: "", eusi: "", sumber: "" },
  });

  const [kamusList, setKamusList] = useState<{ kata: string; pengertian: string }[]>([
    { kata: "", pengertian: "" },
  ]);
  const addKamus = () => setKamusList([...kamusList, { kata: "", pengertian: "" }]);
  const removeKamus = (i: number) => setKamusList(kamusList.filter((_, idx) => idx !== i));
  const updateKamus = (i: number, field: "kata" | "pengertian", value: string) => {
    const updated = [...kamusList];
    updated[i][field] = value;
    setKamusList(updated);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let photoUrl = values.photo;
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await fetch("/api/upload-dongeng", { method: "POST", body: fd });
      const uploadData = await uploadRes.json();
      if (!uploadData.url) throw new Error("Upload foto gagal");
      photoUrl = uploadData.url;
    }
    setLoading(true);
    const payload = {
      ...values,
      lat: latitude,
      lan: langitude,
      kamus: kamusList.filter((k) => k.kata && k.pengertian),
      kabupaten_id: idKab,
      kecamatan_id: idKec,
      desa_id: idDesa,
      photo: photoUrl,
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
          description: "Dongeng anjeun bade di pariksa heula ku kurator, pami tos valid engke di email.",
          variant: "success",
        });
        router.replace("/maos");
      } else {
        toast({ title: "Error nyimpen data", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Gagal koneksi", description: "Aya kasalahan dina sambungan jaringan.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const [kabupatenList, setKabupatenList] = useState<any[]>([]);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaList, setDesaList] = useState<any[]>([]);
  const [loadingKab, setLoadingKab] = useState(true);
  const [loadingKec, setLoadingKec] = useState(false);
  const [loadingDesa, setLoadingDesa] = useState(false);

  useEffect(() => {
    setLoadingKab(true);
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/regencies/32.json")
      .then((r) => r.json())
      .then(setKabupatenList)
      .catch(console.error)
      .finally(() => setLoadingKab(false));
  }, []);

  useEffect(() => {
    const sel = kabupatenList.find((k) => k.name === form.watch("kabupaten"));
    setIdKab(sel?.id);
    if (!sel) return;
    setLoadingKec(true);
    setKecamatanList([]);
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${sel.id}.json`)
      .then((r) => r.json())
      .then(setKecamatanList)
      .catch(console.error)
      .finally(() => setLoadingKec(false));
  }, [form.watch("kabupaten")]);

  useEffect(() => {
    const sel = kecamatanList.find((k) => k.name === form.watch("kecamatan"));
    setIdKec(sel?.id);
    if (!sel) return;
    setLoadingDesa(true);
    setDesaList([]);
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${sel.id}.json`)
      .then((r) => r.json())
      .then(setDesaList)
      .catch(console.error)
      .finally(() => setLoadingDesa(false));
  }, [form.watch("kecamatan")]);

  useEffect(() => {
    const sel = desaList.find((k) => k.name === form.watch("desa"));
    setIdDesa(sel?.id);
  }, [form.watch("desa")]);

  useEffect(() => {
    if (!form.watch("kabupaten")) return;
    const encoded = encodeURIComponent(form.getValues("kabupaten"));
    fetch(`https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`, {
      headers: { "User-Agent": "NextJS-Geocoding-Demo/1.0" },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) { setLatitude(data[0].lat); setLangitude(data[0].lon); }
      })
      .catch(console.error);
  }, [form.watch("kabupaten")]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <div className="sb-form-page paper-bg fade-enter">
      <div className="sb-form-wrap">

        {/* Page header */}
        <div className="sb-form-page-head">
          <div className="sb-hero-eyebrow">
            <span className="dot" />
            Nyerat Dongéng
          </div>
          <h1>Pengisian <em>Data</em></h1>
          <p>Eusian formulir di handap kalayan lengkep. Sadaya widang anu ditandaan wajib diisi.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="sb-form-body">

            {/* ── Section: Lokasi ── */}
            <div className="sb-form-section">
              <div className="sb-form-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                Lokasi Dongéng
              </div>
              <div className="sb-form-grid-3">

                <FormField control={form.control} name="kabupaten" render={({ field }) => (
                  <FormItem>
                    <label className="sb-form-label">Kabupaten <span className="sb-form-required">*</span></label>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingKab}>
                        <SelectTrigger className="sb-form-select">
                          {loadingKab
                            ? <span className="sb-form-loading"><Loader2 size={14} className="animate-spin" /> Ngamuat…</span>
                            : <SelectValue placeholder="Pilih Kabupaten" />}
                        </SelectTrigger>
                        <SelectContent className="sb-form-select-content">
                          {kabupatenList.map((item) => (
                            <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="sb-form-error" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="kecamatan" render={({ field }) => (
                  <FormItem>
                    <label className="sb-form-label">Kecamatan <span className="sb-form-required">*</span></label>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.watch("kabupaten") || loadingKec}>
                        <SelectTrigger className="sb-form-select">
                          {loadingKec
                            ? <span className="sb-form-loading"><Loader2 size={14} className="animate-spin" /> Ngamuat…</span>
                            : <SelectValue placeholder="Pilih Kecamatan" />}
                        </SelectTrigger>
                        <SelectContent className="sb-form-select-content">
                          {kecamatanList.map((item) => (
                            <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="sb-form-error" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="desa" render={({ field }) => (
                  <FormItem>
                    <label className="sb-form-label">Desa <span className="sb-form-required">*</span></label>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.watch("kecamatan") || loadingDesa}>
                        <SelectTrigger className="sb-form-select">
                          {loadingDesa
                            ? <span className="sb-form-loading"><Loader2 size={14} className="animate-spin" /> Ngamuat…</span>
                            : <SelectValue placeholder="Pilih Desa" />}
                        </SelectTrigger>
                        <SelectContent className="sb-form-select-content">
                          {desaList.map((item) => (
                            <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="sb-form-error" />
                  </FormItem>
                )} />

              </div>
            </div>

            {/* ── Section: Dongéng ── */}
            <div className="sb-form-section">
              <div className="sb-form-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                </svg>
                Eusi Dongéng
              </div>
              <div className="sb-form-stack">

                <FormField control={form.control} name="judul" render={({ field }) => (
                  <FormItem>
                    <label className="sb-form-label">Judul Dongéng <span className="sb-form-required">*</span></label>
                    <FormControl>
                      <input {...field} className="sb-form-input" placeholder="Lebetkeun judul dongéng" />
                    </FormControl>
                    <FormMessage className="sb-form-error" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="sumber" render={({ field }) => (
                  <FormItem>
                    <label className="sb-form-label">Sumber Dongéng <span className="sb-form-required">*</span></label>
                    <FormControl>
                      <input {...field} className="sb-form-input" placeholder="cth: Tradisi lisan ti Kecamatan X / Buku Y (2001)" />
                    </FormControl>
                    <FormMessage className="sb-form-error" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="eusi" render={({ field }) => (
                  <FormItem>
                    <label className="sb-form-label">Eusi Dongéng <span className="sb-form-required">*</span></label>
                    <FormControl>
                      <div className="sb-form-editor-wrap">
                        <TipTapEditor value={field.value} onChange={field.onChange} />
                      </div>
                    </FormControl>
                    <FormMessage className="sb-form-error" />
                  </FormItem>
                )} />

              </div>
            </div>

            {/* ── Section: Foto ── */}
            <div className="sb-form-section">
              <div className="sb-form-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                Foto Dongéng <span className="sb-form-optional">(opsional)</span>
              </div>

              <div className="sb-form-upload-row">
                <div className="sb-form-upload-preview">
                  {preview ? (
                    <Image src={preview} alt="preview" width={200} height={200} className="sb-form-preview-img" />
                  ) : (
                    <div className="sb-form-preview-empty">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                      <span>Teu aya foto</span>
                    </div>
                  )}
                </div>
                <div className="sb-form-upload-info">
                  <p>Pilih gambar pikeun jadi ilustrasi dongéng. Format anu dirojong: JPG, PNG, WEBP.</p>
                  <label className="sb-form-upload-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {preview ? "Ganti Foto" : "Pilih Foto"}
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                  </label>
                </div>
              </div>
            </div>

            {/* ── Section: Kamus ── */}
            <div className="sb-form-section">
              <div className="sb-form-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Kamus <span className="sb-form-optional">(opsional)</span>
              </div>
              <p className="sb-form-section-desc">Tambahkeun kecap-kecap Sunda anu perlu diterangkeun hartosna.</p>

              <div className="sb-form-kamus-list">
                {kamusList.map((item, i) => (
                  <div key={i} className="sb-form-kamus-row">
                    <input
                      className="sb-form-input sb-form-kamus-kata"
                      placeholder="Kecap"
                      value={item.kata}
                      onChange={(e) => updateKamus(i, "kata", e.target.value)}
                    />
                    <input
                      className="sb-form-input sb-form-kamus-harti"
                      placeholder="Hartosna"
                      value={item.pengertian}
                      onChange={(e) => updateKamus(i, "pengertian", e.target.value)}
                    />
                    <button
                      type="button"
                      className="sb-form-kamus-del"
                      onClick={() => removeKamus(i)}
                      aria-label="Hapus"
                    >
                      <Trash size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" className="sb-form-kamus-add" onClick={addKamus}>
                <Plus size={15} />
                Tambah Kecap
              </button>
            </div>

            {/* ── Submit ── */}
            <div className="sb-form-footer">
              <button type="button" className="sb-form-cancel" onClick={() => router.back()}>
                Batal
              </button>
              <button type="submit" className="sb-nyerat-btn sb-form-submit" disabled={loading}>
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Nyimpen…</>
                  : <>Simpen Dongéng <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></>}
              </button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
};

export default FormPage;
