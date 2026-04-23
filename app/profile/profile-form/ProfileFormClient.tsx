"use client";

import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "@/validators/auth";
import { z } from "zod";
import Image from "next/image";

interface ProfileFormProps {
  userData: {
    id: string;
    username: string;
    email: string;
    umur?: number;
    nohp: string;
    alamat?: string;
    pekerjaan?: string;
    photo?: string;
  };
}

const formSchema = editProfileSchema;

const FIELDS = [
  { name: "username", label: "Wasta", placeholder: "Lebetkeun wasta", type: "text" },
  { name: "nohp", label: "No HP", placeholder: "Lebetkeun no HP", type: "tel" },
  { name: "pekerjaan", label: "Pagawean", placeholder: "Lebetkeun pagawean", type: "text" },
  { name: "alamat", label: "Padumukan", placeholder: "Lebetkeun padumukan", type: "text" },
  { name: "umur", label: "Umur", placeholder: "Lebetkeun umur", type: "number" },
  { name: "email", label: "Surél", placeholder: "Surél", type: "email", disabled: true },
] as const;

export default function ProfileFormClient({ userData }: ProfileFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(userData.photo || null);

  const initials = (userData.username || userData.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      username: userData.username ?? "",
      nohp: userData.nohp ?? "",
      alamat: userData.alamat ?? "",
      pekerjaan: userData.pekerjaan ?? "",
      umur: userData.umur ?? 0,
      email: userData.email ?? "",
      photo: userData.photo ?? "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const onSubmit = async (value: any) => {
    try {
      setLoading(true);
      let photoUrl = userData.photo;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadData.url) throw new Error("Upload foto gagal");
        photoUrl = uploadData.url;
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...value, photo: photoUrl }),
      });

      if (res.ok) {
        toast({ title: "Profil disimpen", description: "Data profil anjeun parantos disimpen.", variant: "success" });
        router.replace("/");
      } else {
        toast({ title: "Gagal", description: "Terjadi kasalahan waktos nyimpen data.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Terjadi kasalahan", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-wrap">
        {/* Sidebar — avatar & info */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-ring" onClick={() => fileRef.current?.click()}>
            {preview ? (
              <Image src={preview} alt={userData.username} width={100} height={100} className="rounded-full object-cover" />
            ) : (
              <div className="profile-avatar-placeholder">{initials}</div>
            )}
            <div className="profile-avatar-overlay">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="profile-file-input" onChange={handleImageChange} />

          <div className="profile-name">{userData.username || "—"}</div>
          <div className="profile-email">{userData.email}</div>

          <div className="profile-divider" />

          {userData.pekerjaan && (
            <div className="profile-meta-item">
              <span className="profile-meta-label">Pagawean</span>
              <span className="profile-meta-value">{userData.pekerjaan}</span>
            </div>
          )}
          {userData.alamat && (
            <div className="profile-meta-item">
              <span className="profile-meta-label">Padumukan</span>
              <span className="profile-meta-value">{userData.alamat}</span>
            </div>
          )}
          {userData.nohp && (
            <div className="profile-meta-item">
              <span className="profile-meta-label">No HP</span>
              <span className="profile-meta-value">{userData.nohp}</span>
            </div>
          )}
        </aside>

        {/* Form */}
        <div className="profile-form-card fade-enter">
          <div className="profile-eyebrow">Éditan Profil</div>
          <h2 className="profile-title">Robah data anjeun.</h2>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div className="profile-fields">
              <div className="profile-fields-grid">
                {FIELDS.slice(0, 4).map((f) => (
                  <div key={f.name} className="lf-field">
                    <label>{f.label}</label>
                    <input
                      {...register(f.name as any)}
                      type={f.type}
                      placeholder={f.placeholder}
                    />
                    {errors[f.name as keyof typeof errors] && (
                      <span style={{ fontSize: 11, color: "var(--terracotta)" }}>
                        {errors[f.name as keyof typeof errors]?.message as string}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {FIELDS.slice(4).map((f) => (
                <div key={f.name} className="lf-field">
                  <label>{f.label}</label>
                  <input
                    {...register(f.name as any)}
                    type={f.type}
                    placeholder={f.placeholder}
                    disabled={"disabled" in f ? f.disabled : false}
                    style={"disabled" in f && f.disabled ? { opacity: 0.55, cursor: "not-allowed" } : {}}
                  />
                  {errors[f.name as keyof typeof errors] && (
                    <span style={{ fontSize: 11, color: "var(--terracotta)" }}>
                      {errors[f.name as keyof typeof errors]?.message as string}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button type="submit" className="profile-submit" disabled={loading}>
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "lf-spin 0.8s linear infinite" }} />
                  Nyimpen…
                </>
              ) : (
                <>
                  Simpen
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes lf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
