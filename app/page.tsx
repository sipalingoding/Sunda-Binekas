"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useEffect, useState } from "react";

const PALETTE = [
  {
    bg: "oklch(0.72 0.09 150)",
    sky: "oklch(0.82 0.07 210)",
    ground: "oklch(0.55 0.12 140)",
  },
  {
    bg: "oklch(0.68 0.10 40)",
    sky: "oklch(0.84 0.06 70)",
    ground: "oklch(0.48 0.13 120)",
  },
  {
    bg: "oklch(0.65 0.09 260)",
    sky: "oklch(0.78 0.08 200)",
    ground: "oklch(0.42 0.10 150)",
  },
  {
    bg: "oklch(0.70 0.11 30)",
    sky: "oklch(0.86 0.07 60)",
    ground: "oklch(0.50 0.14 130)",
  },
];

function DongengIllustration({ index }: { index: number }) {
  const p = PALETTE[index % PALETTE.length];
  return (
    <svg
      viewBox="0 0 320 180"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="320" height="180" fill={p.sky} />
      <ellipse cx="260" cy="40" rx="38" ry="24" fill="white" opacity="0.35" />
      <ellipse cx="200" cy="30" rx="26" ry="16" fill="white" opacity="0.25" />
      <rect x="0" y="120" width="320" height="60" fill={p.ground} />
      <ellipse cx="160" cy="120" rx="160" ry="18" fill={p.ground} />
      {/* Tree center */}
      <rect
        x="153"
        y="70"
        width="14"
        height="55"
        fill="oklch(0.35 0.08 40)"
        rx="4"
      />
      <ellipse cx="160" cy="58" rx="42" ry="40" fill={p.bg} />
      <ellipse cx="135" cy="72" rx="26" ry="22" fill={p.bg} />
      <ellipse cx="185" cy="72" rx="26" ry="22" fill={p.bg} />
      {/* Tree left */}
      <rect
        x="52"
        y="90"
        width="10"
        height="38"
        fill="oklch(0.35 0.08 40)"
        rx="3"
      />
      <ellipse cx="57" cy="78" rx="28" ry="26" fill={p.bg} opacity="0.85" />
      {/* Tree right */}
      <rect
        x="256"
        y="88"
        width="10"
        height="40"
        fill="oklch(0.35 0.08 40)"
        rx="3"
      />
      <ellipse cx="261" cy="76" rx="28" ry="26" fill={p.bg} opacity="0.85" />
      {/* Mountains */}
      <polygon
        points="60,120 100,70 140,120"
        fill="oklch(0.48 0.08 260)"
        opacity="0.5"
      />
      <polygon
        points="130,120 180,60 230,120"
        fill="oklch(0.45 0.09 250)"
        opacity="0.45"
      />
    </svg>
  );
}

const BADGE_COLORS: Record<string, string> = {
  FABEL: "var(--terracotta)",
  DONGÉNG: "var(--sb-indigo)",
  KETUHANAN: "var(--ochre)",
};

function FeaturedSection() {
  const [dongeng, setDongeng] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/dongeng/approved")
      .then((r) => r.json())
      .then((json) => setDongeng((json.data || []).slice(0, 4)))
      .catch(() => {});
  }, []);

  const items = dongeng.length > 0 ? dongeng : Array(4).fill(null);

  return (
    <section className="sb-featured">
      <div className="sb-featured-head">
        <h2>
          Aos dongéng kalayan
          <br />
          <em>khidmat.</em>
        </h2>
        <p>
          Tiap dongéng nyimpen <mark className="sb-highlight">hikmah</mark>{" "}
          jeung ajaran anu tiasa dicandak kana kahirupan sapopoé — pikeun
          barudak sareng kolot.
        </p>
      </div>
      <div className="sb-featured-grid">
        {items.map((item, i) => {
          const id = item?.id ? btoa(item.id) : null;
          const judul = item?.judul ?? "";
          const kabupaten = item?.kabupaten ?? "";
          const eusi = item?.eusi
            ? item.eusi.replace(/<[^>]*>/g, "").slice(0, 90) + "…"
            : "";
          const badge = ["FABEL", "DONGÉNG", "KETUHANAN", "FABEL"][i];
          return (
            <div
              key={i}
              className={`sb-dcard${!item ? " sb-dcard-skeleton" : ""}`}
            >
              <div className="sb-dcard-img">
                {item?.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.photo}
                    alt={judul}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <DongengIllustration index={i} />
                )}
                <span
                  className="sb-dcard-badge"
                  style={{
                    background: BADGE_COLORS[badge] ?? "var(--terracotta)",
                  }}
                >
                  {badge}
                </span>
              </div>
              <div className="sb-dcard-body">
                {item ? (
                  <>
                    <div className="sb-dcard-meta">
                      {kabupaten || "Jawa Barat"}
                    </div>
                    <div className="sb-dcard-title">{judul}</div>
                    <p className="sb-dcard-desc">{eusi}</p>
                    <Link
                      href={id ? `/maos/detail/${id}` : "/maos"}
                      className="sb-dcard-link"
                    >
                      Baca{" "}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </>
                ) : (
                  <div className="sb-dcard-loading" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="sb-home paper-bg fade-enter">
      {/* Hero */}
      <section className="sb-hero">
        {/* Copy */}
        <div className="sb-hero-copy">
          <div className="sb-hero-eyebrow">
            <span className="dot" />
            Dongéng Sunda — Interaktif
          </div>

          <h1>
            <em>Wilujeng</em> <span className="swash">sumping</span>,
          </h1>

          <p className="lead">
            {t("subtitle1_home") ||
              "Baca dongéng Sunda klasik nu bisa diklik, dipilih jalanna, sareng diartikeun kecap demi kecap. Arangkah saé pikeun murangkalih — sareng urang kolot nu hoyong nginget deui."}
          </p>

          <div className="sb-hero-actions">
            <Link href="/rereongan" className="btn-sb-primary">
              Mimitian baca
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/maos" className="btn-sb-ghost">
              Peta Dongéng
            </Link>
          </div>
        </div>

        {/* Visual — Gunungan Wayang */}
        <div className="sb-hero-visual">
          <div className="sb-wayang-card">
            <svg
              viewBox="0 0 500 625"
              preserveAspectRatio="xMidYMid slice"
              style={{ width: "100%", height: "100%" }}
            >
              <defs>
                <pattern
                  id="mm-hero"
                  x="0"
                  y="0"
                  width="80"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 30 Q10 20 20 30 T40 30 T60 30 T80 30"
                    fill="none"
                    stroke="rgba(255,220,160,0.18)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M0 45 Q10 35 20 45 T40 45 T60 45 T80 45"
                    fill="none"
                    stroke="rgba(255,220,160,0.18)"
                    strokeWidth="1.2"
                  />
                </pattern>
                <radialGradient id="glow-hero" cx="0.5" cy="0.5" r="0.6">
                  <stop
                    offset="0"
                    stopColor="oklch(0.85 0.17 65)"
                    stopOpacity="0.45"
                  />
                  <stop
                    offset="1"
                    stopColor="oklch(0.32 0.08 260)"
                    stopOpacity="0"
                  />
                </radialGradient>
              </defs>
              <rect width="500" height="625" fill="oklch(0.32 0.08 260)" />
              <rect width="500" height="625" fill="url(#mm-hero)" />
              <circle cx="250" cy="312" r="280" fill="url(#glow-hero)" />
              {/* Gunungan wayang */}
              <g transform="translate(250, 320)">
                <path
                  d="M0 -260 L120 -130 L170 40 L150 210 L90 240 L-90 240 L-150 210 L-170 40 L-120 -130 Z"
                  fill="oklch(0.25 0.08 40)"
                />
                <path
                  d="M0 -220 Q20 -100 0 80 Q-20 180 0 240"
                  stroke="oklch(0.85 0.15 55)"
                  strokeWidth="2.5"
                  fill="none"
                />
                {([-160, -100, -40, 20, 100, 180] as number[]).map((y) => (
                  <g key={y}>
                    <ellipse
                      cx="0"
                      cy={y}
                      rx="40"
                      ry="12"
                      fill="none"
                      stroke="oklch(0.78 0.14 55)"
                      strokeWidth="1.5"
                    />
                    <circle cx="0" cy={y} r="5" fill="oklch(0.85 0.16 65)" />
                  </g>
                ))}
                <path
                  d="M0 -260 L120 -130 L170 40 L150 210 L90 240 L-90 240 L-150 210 L-170 40 L-120 -130 Z"
                  fill="none"
                  stroke="oklch(0.78 0.14 55)"
                  strokeWidth="2"
                />
                <path
                  d="M-60 240 L-60 80 Q-60 40 -30 40 L30 40 Q60 40 60 80 L60 240"
                  fill="none"
                  stroke="oklch(0.78 0.14 55)"
                  strokeWidth="2"
                />
                <circle
                  cx="0"
                  cy="90"
                  r="18"
                  fill="oklch(0.78 0.14 55)"
                  opacity="0.8"
                />
              </g>
              {/* Stars */}
              {(
                [
                  [80, 80],
                  [420, 120],
                  [60, 400],
                  [440, 480],
                  [120, 540],
                ] as [number, number][]
              ).map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="oklch(0.9 0.1 70)"
                  opacity="0.7"
                />
              ))}
            </svg>
          </div>
        </div>
      </section>

      <FeaturedSection />
    </div>
  );
}
