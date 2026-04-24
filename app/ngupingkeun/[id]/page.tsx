import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import SafeHTMLContent from "@/app/maos/detail/[id]/safe-html/SafeHtml";
import ContactButton from "@/app/maos/detail/[id]/ContactButton";
import ApproveButtonsNgupingkeun from "./ButtonDecisionNgupingkeun";
import AudioPlayerNguping from "./AudioPlayerNguping";

export default async function DetailNgupingkeunPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("ngupingkeun_list")
    .select(
      `id, status, file_audio,
       dongeng_id (id, judul, eusi, photo, kabupaten, sumber),
       user_id (photo, username, email, nohp)`
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return (
      <div className="nd-page">
        <div className="nd-inner">
          <p style={{ color: "var(--sb-muted)" }}>Gagal ngamuat data: {error?.message}</p>
        </div>
      </div>
    );
  }

  const dongeng = data.dongeng_id as any;
  const contributor = data.user_id as any;

  const statusLabel =
    data.status === "approved" ? "Ditarima" :
    data.status === "rejected" ? "Ditolak" : "Ngantri";
  const statusCls =
    data.status === "approved" ? "adm-pill adm-pill-approved" :
    data.status === "rejected" ? "adm-pill adm-pill-rejected" : "adm-pill adm-pill-pending";

  return (
    <div className="nd-page">
      <div className="nd-inner">

        {/* Back */}
        <Link href="/admin" className="nd-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Balik ka Admin
        </Link>

        {/* Hero */}
        <div className="nd-hero">
          {dongeng?.photo ? (
            <Image
              src={dongeng.photo}
              width={100}
              height={100}
              alt={dongeng.judul}
              className="nd-hero-photo"
            />
          ) : (
            <div className="nd-hero-photo-ph">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
          )}

          <div className="nd-hero-info">
            <span className="nd-hero-eyebrow">Kiriman Ngupingkeun</span>
            <h1 className="nd-hero-title">{dongeng?.judul}</h1>
            <div className="nd-hero-meta">
              {dongeng?.kabupaten && (
                <span className="nd-meta-chip">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {dongeng.kabupaten}
                </span>
              )}
              {dongeng?.sumber && (
                <span className="nd-meta-chip">Sumber: {dongeng.sumber}</span>
              )}
              <span className={statusCls}>{statusLabel}</span>
            </div>
          </div>
        </div>

        {/* Content card */}
        <div className="nd-content-card">

          {/* Audio contribution */}
          <div>
            <span className="nd-section-label">Audio Kontribusi</span>
            {data.file_audio ? (
              <AudioPlayerNguping src={data.file_audio} />
            ) : (
              <span style={{ fontSize: 13, color: "var(--sb-muted)", fontStyle: "italic" }}>
                Teu acan aya file audio.
              </span>
            )}
          </div>

          <div className="nd-divider" />

          {/* Eusi */}
          <div>
            <span className="nd-section-label">Eusi Dongéng</span>
            {dongeng?.eusi ? (
              <SafeHTMLContent html={dongeng.eusi} />
            ) : (
              <span style={{ fontSize: 13, color: "var(--sb-muted)", fontStyle: "italic" }}>
                Teu acan aya eusi.
              </span>
            )}
          </div>

          <div className="nd-divider" />

          {/* Footer */}
          <div className="nd-footer">
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

            <ContactButton
              email={contributor?.email ?? ""}
              nohp={contributor?.nohp ?? ""}
            />
          </div>
        </div>

        {/* Admin actions */}
        <ApproveButtonsNgupingkeun id={data.id} />

      </div>
    </div>
  );
}
