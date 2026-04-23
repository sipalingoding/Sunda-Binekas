import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import MapViewWrapper from "../MapViewWrapper";
import DetailClientWrapper from "./DetailClientWrapper";
import ShareDialogButton from "./share-dialog-button";
import ContactButton from "./ContactButton";
import ApproveButtons from "./button-decision/ButtonDecision";

export default async function DetailMaosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dataId = atob(id);
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    role = userData?.role ?? null;
  }

  const { data, error } = await supabase
    .from("dongeng")
    .select(
      `
      id,
      judul,
      kabupaten,
      kecamatan,
      desa,
      eusi,
      view,
      status,
      kamus,
      sumber,
      photo,
      lat,
      lan,
      audio,
      translate,
      created_at,
      user_id (
        id,
        username,
        email,
        photo,
        nohp
      )
    `
    )
    .eq("id", dataId)
    .single();

  await supabase
    .from("dongeng")
    .update({ view: (data?.view ?? 0) + 1 })
    .eq("id", dataId);

  if (error) return <div>Error ambil dongeng: {error.message}</div>;

  const mapsUrl =
    data?.lat && data?.lan
      ? `https://www.google.com/maps?q=${data.lat},${data.lan}`
      : null;

  const contributor = data.user_id as any;
  const shareLink = `https://sunda-binekas.vercel.app/dongeng/${dataId}`;

  return (
    <div className="nd-page">
      <div className="nd-inner">
        {/* Back */}
        <Link href="/maos" className="nd-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Balik ka daptar
        </Link>

        {/* Hero */}
        <div className="nd-hero">
          {data?.photo ? (
            <Image
              src={data.photo}
              width={100}
              height={100}
              alt={data.judul}
              className="nd-hero-photo"
            />
          ) : (
            <div className="nd-hero-photo-ph">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
          )}

          <div className="nd-hero-info">
            <span className="nd-hero-eyebrow">Dongéng Sunda</span>
            <h1 className="nd-hero-title">{data.judul}</h1>

            <div className="nd-hero-meta">
              {data.kabupaten && (
                <span className="nd-meta-chip">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {data.kabupaten}
                </span>
              )}
              {data.kecamatan && (
                <span className="nd-meta-chip">{data.kecamatan}</span>
              )}
              {data.desa && (
                <span className="nd-meta-chip">{data.desa}</span>
              )}
              {data.sumber && (
                <span className="nd-meta-chip">Sumber: {data.sumber}</span>
              )}
            </div>

            <div className="nd-hero-stats">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {data.view ?? 0} ditingali
            </div>
          </div>
        </div>

        {/* Content card */}
        <div className="nd-content-card">
          {/* Eusi + language switcher */}
          <div>
            <span className="nd-section-label">Eusi Dongéng</span>
            <DetailClientWrapper eusi={data.eusi} translate={data.translate} />
          </div>

          <div className="nd-divider" />

          {/* Kamus */}
          <div>
            <span className="nd-section-label">Kamus Alit</span>
            {data?.kamus?.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {data.kamus.map((item: any, index: number) => (
                  <div key={index} className="nd-kamus-item">
                    <span className="nd-kamus-word">{item.kata}</span>
                    <span style={{ color: "var(--sb-muted)" }}>—</span>
                    <span className="nd-kamus-def">{item.pengertian}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: 13, color: "var(--sb-muted)", fontStyle: "italic" }}>
                Teu acan aya kamus alit.
              </span>
            )}
          </div>

          <div className="nd-divider" />

          {/* Map */}
          <MapViewWrapper data={data} />

          <div className="nd-divider" />

          {/* Footer */}
          <div className="nd-footer">
            {/* Kontributor */}
            <div className="nd-footer-item" style={{ cursor: "default" }}>
              {contributor?.photo ? (
                <Image
                  src={contributor.photo}
                  width={32}
                  height={32}
                  alt={contributor.username}
                  className="nd-footer-avatar"
                />
              ) : (
                <div className="nd-footer-avatar-ph">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
              )}
              Kontributor: {contributor?.username}
            </div>

            {/* Hubungi */}
            <ContactButton
              email={contributor?.email ?? ""}
              nohp={contributor?.nohp ?? ""}
            />

            {/* Bagikeun */}
            <ShareDialogButton link={shareLink} />

            {/* Tempat */}
            <a
              href={mapsUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="nd-footer-item"
              style={!mapsUrl ? { opacity: 0.45, pointerEvents: "none" } : {}}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Nyalusur Tempat Dongeng
            </a>
          </div>
        </div>

        {/* Admin actions */}
        {role === "admin" && (
          <ApproveButtons id={data.id} />
        )}
      </div>
    </div>
  );
}
