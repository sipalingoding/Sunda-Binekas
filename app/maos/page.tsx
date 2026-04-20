"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const REGIONS = [
  { n: 1,  name: "Kota Bogor",         type: "kota", col: 2, row: 3, w: 1, h: 1 },
  { n: 2,  name: "Kab. Bogor",         type: "kab",  col: 1, row: 3, w: 1, h: 2 },
  { n: 3,  name: "Kota Depok",         type: "kota", col: 3, row: 2, w: 1, h: 1 },
  { n: 4,  name: "Kota Bekasi",        type: "kota", col: 4, row: 2, w: 1, h: 1 },
  { n: 5,  name: "Kab. Bekasi",        type: "kab",  col: 5, row: 2, w: 1, h: 1 },
  { n: 6,  name: "Kab. Karawang",      type: "kab",  col: 6, row: 2, w: 1, h: 1 },
  { n: 7,  name: "Kab. Purwakarta",    type: "kab",  col: 5, row: 3, w: 1, h: 1 },
  { n: 8,  name: "Kab. Subang",        type: "kab",  col: 6, row: 3, w: 1, h: 1 },
  { n: 9,  name: "Kab. Indramayu",     type: "kab",  col: 7, row: 2, w: 2, h: 1 },
  { n: 10, name: "Kota Cirebon",       type: "kota", col: 9, row: 2, w: 1, h: 1 },
  { n: 11, name: "Kab. Cirebon",       type: "kab",  col: 9, row: 3, w: 1, h: 1 },
  { n: 12, name: "Kab. Kuningan",      type: "kab",  col: 9, row: 4, w: 1, h: 1 },
  { n: 13, name: "Kab. Majalengka",    type: "kab",  col: 8, row: 3, w: 1, h: 1 },
  { n: 14, name: "Kab. Sumedang",      type: "kab",  col: 7, row: 3, w: 1, h: 1 },
  { n: 15, name: "Kota Bandung",       type: "kota", col: 5, row: 4, w: 1, h: 1 },
  { n: 16, name: "Kota Cimahi",        type: "kota", col: 4, row: 4, w: 1, h: 1 },
  { n: 17, name: "Kab. Bandung Barat", type: "kab",  col: 3, row: 4, w: 1, h: 1 },
  { n: 18, name: "Kab. Bandung",       type: "kab",  col: 5, row: 5, w: 2, h: 1 },
  { n: 19, name: "Kab. Sukabumi",      type: "kab",  col: 1, row: 5, w: 2, h: 1 },
  { n: 20, name: "Kota Sukabumi",      type: "kota", col: 2, row: 4, w: 1, h: 1 },
  { n: 21, name: "Kab. Cianjur",       type: "kab",  col: 3, row: 5, w: 1, h: 1 },
  { n: 22, name: "Kab. Garut",         type: "kab",  col: 4, row: 5, w: 1, h: 1 },
  { n: 23, name: "Kab. Tasikmalaya",   type: "kab",  col: 7, row: 4, w: 1, h: 1 },
  { n: 24, name: "Kota Tasikmalaya",   type: "kota", col: 7, row: 5, w: 1, h: 1 },
  { n: 25, name: "Kab. Ciamis",        type: "kab",  col: 8, row: 4, w: 1, h: 1 },
  { n: 26, name: "Kota Banjar",        type: "kota", col: 8, row: 5, w: 1, h: 1 },
  { n: 27, name: "Kab. Pangandaran",   type: "kab",  col: 9, row: 5, w: 1, h: 1 },
];

const CELL = 90;

function regionRect(r: typeof REGIONS[0]) {
  return {
    x: r.col * CELL + 10,
    y: r.row * CELL + 10,
    w: r.w * CELL - 20,
    h: r.h * CELL - 20,
  };
}

function JabarMapView({
  onSelect,
  selected,
  hovered,
  setHovered,
  counts,
}: {
  onSelect: (n: number) => void;
  selected: number | null;
  hovered: number | null;
  setHovered: (n: number | null) => void;
  counts: Record<string, number>;
}) {
  return (
    <svg
      viewBox="80 160 820 450"
      preserveAspectRatio="xMidYMid meet"
      className="jabar-map"
      style={{ width: "100%", height: "auto", display: "block", maxHeight: "68vh" }}
    >
      <defs>
        <pattern id="batik-map" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </pattern>
      </defs>
      <text x="490" y="185" textAnchor="middle" fontFamily="'Caveat', cursive" fontSize="18" fill="var(--sb-muted)" opacity="0.5">Laut Jawa</text>
      <text x="490" y="605" textAnchor="middle" fontFamily="'Caveat', cursive" fontSize="18" fill="var(--sb-muted)" opacity="0.5">Samudra Hindia</text>

      {REGIONS.map((r) => {
        const { x, y, w, h } = regionRect(r);
        const isHover = hovered === r.n;
        const isSel = selected === r.n;
        return (
          <g
            key={r.n}
            onMouseEnter={() => setHovered(r.n)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(r.n)}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={x} y={y} width={w} height={h}
              rx="10"
              fill={
                isSel
                  ? "var(--terracotta)"
                  : isHover
                  ? "color-mix(in oklch, var(--terracotta) 25%, var(--paper-2))"
                  : "var(--paper-2)"
              }
              stroke={isSel || isHover ? "var(--terracotta)" : "var(--line-strong)"}
              strokeWidth={isSel ? 2 : 1}
              style={{ transition: "all 0.25s" }}
            />
            {isHover && !isSel && (
              <rect x={x} y={y} width={w} height={h} rx="10" fill="url(#batik-map)" style={{ color: "var(--terracotta)" }} pointerEvents="none" />
            )}
          </g>
        );
      })}

      {REGIONS.map((r) => {
        const { x, y, w, h } = regionRect(r);
        const cx = x + w / 2;
        const cy = y + h / 2;
        const isHover = hovered === r.n;
        const isSel = selected === r.n;
        return (
          <g key={`m-${r.n}`} pointerEvents="none" style={{ transition: "all 0.25s" }}>
            <circle
              cx={cx} cy={cy - 6}
              r={isSel || isHover ? 17 : 15}
              fill={r.type === "kota" ? "var(--sb-indigo)" : "var(--terracotta)"}
              stroke="var(--paper)"
              strokeWidth="2.5"
            />
            <text x={cx} y={cy - 2} textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui" fontSize="13" fontWeight="700" fill="var(--paper)">{r.n}</text>
            <text x={cx} y={cy + 20} textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui" fontSize="9" fill="var(--ink-2)" opacity={isSel || isHover ? 1 : 0.7}>
              {r.name.replace("Kab. ", "").replace("Kota ", "").slice(0, 10)}
            </text>
            {(counts[r.name] ?? 0) > 0 && (
              <text x={cx} y={cy + 30} textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui" fontSize="8" fill="var(--terracotta)" opacity={isSel || isHover ? 1 : 0.6}>
                {counts[r.name]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function MaosPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "kab" | "kota">("all");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dongeng/approved")
      .then((r) => r.json())
      .then(({ data }) => {
        const map: Record<string, number> = {};
        (data || []).forEach((d: { kabupaten: string }) => {
          if (d.kabupaten) map[d.kabupaten] = (map[d.kabupaten] || 0) + 1;
        });
        setCounts(map);
      })
      .finally(() => setLoading(false));
  }, []);

  const selRegion = REGIONS.find((r) => r.n === selected);
  const total = Object.values(counts).reduce((s, c) => s + c, 0);
  const filteredList = REGIONS.filter((r) => filter === "all" || r.type === filter);

  return (
    <div className="sb-section paper-bg fade-enter" style={{ minHeight: "100%" }}>
      {/* Section head */}
      <div className="sb-section-head">
        <div>
          <span className="sb-breadcrumb handwritten">Haus → peta dongéng</span>
          <h2>Maos Dongéng sa-Jawa Barat.</h2>
        </div>
        <p>
          Klik wewengkon dina peta kanggo ningali sabaraha dongéng nu parantos dicatet ti daérah éta.{" "}
          <strong>{REGIONS.length}</strong> kabupatén/kota ·{" "}
          {loading ? (
            <span style={{ opacity: 0.5 }}>…</span>
          ) : (
            <strong>{total}</strong>
          )}{" "}
          dongéng.
        </p>
      </div>

      {/* Map + side panel */}
      <div className="maos-layout">
        {/* Map stage */}
        <div className="maos-stage">
          <JabarMapView
            onSelect={setSelected}
            selected={selected}
            hovered={hovered}
            setHovered={setHovered}
            counts={counts}
          />

          {/* Legend */}
          <div className="maos-legend">
            <div className="maos-leg-item">
              <span className="maos-leg-dot" style={{ background: "var(--terracotta)" }} />
              Kabupatén
            </div>
            <div className="maos-leg-item">
              <span className="maos-leg-dot" style={{ background: "var(--sb-indigo)" }} />
              Kota
            </div>
          </div>

          {/* Region card popup */}
          {selected && selRegion && (
            <div className="region-card">
              <button className="rc-close" onClick={() => setSelected(null)} aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
              <div className="rc-label">Dongéng Wilayah</div>
              <h3 className="rc-name">
                {selRegion.name.replace("Kab. ", "").replace("Kota ", "").toUpperCase()}
              </h3>
              <div className="rc-meta">
                <span className="rc-type">{selRegion.type === "kota" ? "Kota" : "Kabupatén"}</span>
                <span>·</span>
                <span>No. {selRegion.n}</span>
              </div>
              <div className="rc-count-label">Jumlah Dongéng</div>
              <div className="rc-count">
                {loading ? "…" : (counts[selRegion.name] ?? 0)}
              </div>
              <div className="rc-actions">
                <button className="btn-sb-ghost" style={{ padding: "10px 18px", fontSize: 13 }} onClick={() => setSelected(null)}>
                  Tutup
                </button>
                <button
                  className="btn-sb-primary"
                  style={{ padding: "10px 18px", fontSize: 13 }}
                  onClick={() => router.push(`/maos/${encodeURIComponent(selRegion.name)}`)}
                >
                  Baca dongéng
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        <aside className="maos-side">
          <div className="side-head">
            Daptar Wewengkon
            <div className="side-filter">
              <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Sadaya</button>
              <button className={filter === "kab" ? "active" : ""} onClick={() => setFilter("kab")}>Kab</button>
              <button className={filter === "kota" ? "active" : ""} onClick={() => setFilter("kota")}>Kota</button>
            </div>
          </div>
          <div className="side-list">
            {filteredList
              .slice()
              .sort((a, b) => (counts[b.name] ?? 0) - (counts[a.name] ?? 0))
              .map((r) => (
                <button
                  key={r.n}
                  className={`side-item${selected === r.n ? " active" : ""}`}
                  onMouseEnter={() => setHovered(r.n)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(r.n)}
                >
                  <span className={`side-badge ${r.type}`}>{r.n}</span>
                  <span className="side-name">{r.name}</span>
                  <span className="side-count">
                    {loading ? "…" : (counts[r.name] ?? 0)}
                  </span>
                </button>
              ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
