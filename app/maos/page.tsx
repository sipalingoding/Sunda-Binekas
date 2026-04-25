"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const REGIONS = [
  { n: 1,  name: "Kota Bogor",         type: "kota" },
  { n: 2,  name: "Kab. Bogor",         type: "kab" },
  { n: 3,  name: "Kota Depok",         type: "kota" },
  { n: 4,  name: "Kota Bekasi",        type: "kota" },
  { n: 5,  name: "Kab. Bekasi",        type: "kab" },
  { n: 6,  name: "Kab. Karawang",      type: "kab" },
  { n: 7,  name: "Kab. Purwakarta",    type: "kab" },
  { n: 8,  name: "Kab. Subang",        type: "kab" },
  { n: 9,  name: "Kab. Indramayu",     type: "kab" },
  { n: 10, name: "Kota Cirebon",       type: "kota" },
  { n: 11, name: "Kab. Cirebon",       type: "kab" },
  { n: 12, name: "Kab. Kuningan",      type: "kab" },
  { n: 13, name: "Kab. Majalengka",    type: "kab" },
  { n: 14, name: "Kab. Sumedang",      type: "kab" },
  { n: 15, name: "Kota Bandung",       type: "kota" },
  { n: 16, name: "Kota Cimahi",        type: "kota" },
  { n: 17, name: "Kab. Bandung Barat", type: "kab" },
  { n: 18, name: "Kab. Bandung",       type: "kab" },
  { n: 19, name: "Kab. Sukabumi",      type: "kab" },
  { n: 20, name: "Kota Sukabumi",      type: "kota" },
  { n: 21, name: "Kab. Cianjur",       type: "kab" },
  { n: 22, name: "Kab. Garut",         type: "kab" },
  { n: 23, name: "Kab. Tasikmalaya",   type: "kab" },
  { n: 24, name: "Kota Tasikmalaya",   type: "kota" },
  { n: 25, name: "Kab. Ciamis",        type: "kab" },
  { n: 26, name: "Kota Banjar",        type: "kota" },
  { n: 27, name: "Kab. Pangandaran",   type: "kab" },
];

type GeoFeature = {
  n: number;
  name: string;
  type: string;
  d: string;
  cx: number;
  cy: number;
};

function normalizeKabupaten(raw: string): string {
  const s = raw.trim();
  const up = s.toUpperCase();
  const titleCase = (str: string) =>
    str.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  if (up.startsWith("KABUPATEN ")) return "Kab. " + titleCase(s.slice("KABUPATEN ".length));
  if (up.startsWith("KOTA ")) return "Kota " + titleCase(s.slice("KOTA ".length));
  return s;
}

/* ─── Map View ─── */
const MIN_SCALE = 1;
const MAX_SCALE = 5;

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
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
  const [features, setFeatures] = useState<GeoFeature[]>([]);
  const [mapLoading, setMapLoading] = useState(true);

  // Zoom/pan state
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [scale, setScale] = useState(1);
  const [gesturing, setGesturing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isPinching = useRef(false);
  const isDragging = useRef(false);
  const lastDist = useRef(0);
  const lastPan = useRef({ x: 0, y: 0 });
  const panMoved = useRef(false); // distinguish tap vs drag
  const scaleRef = useRef(1);
  const txRef = useRef(0);
  const tyRef = useRef(0);

  // Keep refs in sync so imperative handlers can read latest values
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { txRef.current = tx; }, [tx]);
  useEffect(() => { tyRef.current = ty; }, [ty]);

  useEffect(() => {
    fetch("/jabar-paths.json")
      .then((r) => r.json())
      .then(setFeatures)
      .catch(console.error)
      .finally(() => setMapLoading(false));
  }, []);

  // Clamp translation so SVG never leaves viewport
  function clampedTranslate(s: number, x: number, y: number) {
    const el = containerRef.current;
    if (!el) return { x, y };
    const w = el.clientWidth;
    const h = el.clientHeight;
    const svgH = w * (560 / 900); // natural SVG aspect ratio
    return {
      x: clamp(x, w - w * s, 0),
      y: clamp(y, svgH - svgH * s, 0),
    };
  }

  // Attach non-passive touchmove so we can preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: TouchEvent) => {
      if (isPinching.current || (isDragging.current && scaleRef.current > 1)) {
        e.preventDefault();
      }
    };
    el.addEventListener("touchmove", onMove, { passive: false });
    return () => el.removeEventListener("touchmove", onMove);
  }, []);

  function getTouchDist(t: React.TouchList) {
    return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  }
  function getTouchMid(t: React.TouchList) {
    return { x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 };
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      isPinching.current = true;
      isDragging.current = false;
      lastDist.current = getTouchDist(e.touches);
      setGesturing(true);
    } else if (e.touches.length === 1) {
      isDragging.current = true;
      panMoved.current = false;
      lastPan.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && isPinching.current) {
      const newDist = getTouchDist(e.touches);
      const mid = getTouchMid(e.touches);
      const rect = containerRef.current!.getBoundingClientRect();
      const midX = mid.x - rect.left;
      const midY = mid.y - rect.top;

      const delta = newDist / lastDist.current;
      const newScale = clamp(scaleRef.current * delta, MIN_SCALE, MAX_SCALE);
      const actualDelta = newScale / scaleRef.current;
      const raw = clampedTranslate(
        newScale,
        midX - (midX - txRef.current) * actualDelta,
        midY - (midY - tyRef.current) * actualDelta,
      );
      setScale(newScale);
      setTx(raw.x);
      setTy(raw.y);
      lastDist.current = newDist;
    } else if (e.touches.length === 1 && isDragging.current && scaleRef.current > 1) {
      const dx = e.touches[0].clientX - lastPan.current.x;
      const dy = e.touches[0].clientY - lastPan.current.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) panMoved.current = true;
      lastPan.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const clamped = clampedTranslate(scaleRef.current, txRef.current + dx, tyRef.current + dy);
      setTx(clamped.x);
      setTy(clamped.y);
    }
  }

  function handleTouchEnd() {
    isPinching.current = false;
    isDragging.current = false;
    setGesturing(false);
    // Snap back to min scale if user pinched below 1
    if (scaleRef.current <= 1.05) {
      setScale(1); setTx(0); setTy(0);
    }
  }

  function zoomStep(factor: number) {
    const el = containerRef.current;
    const cx = el ? el.clientWidth / 2 : 0;
    const cy = el ? el.clientHeight / 2 : 0;
    const newScale = clamp(scaleRef.current * factor, MIN_SCALE, MAX_SCALE);
    const actualDelta = newScale / scaleRef.current;
    const raw = clampedTranslate(
      newScale,
      cx - (cx - txRef.current) * actualDelta,
      cy - (cy - tyRef.current) * actualDelta,
    );
    setScale(newScale); setTx(raw.x); setTy(raw.y);
  }

  function resetZoom() { setScale(1); setTx(0); setTy(0); }

  const isZoomed = scale > 1.05;

  if (mapLoading) {
    return (
      <div style={{ minHeight: 320, display: "grid", placeItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <span style={{
            width: 36, height: 36,
            border: "3px solid var(--sb-line)",
            borderTopColor: "var(--terracotta)",
            borderRadius: "50%",
            display: "inline-block",
            animation: "maos-spin 0.8s linear infinite",
          }} />
          <span style={{ fontSize: 13, color: "var(--sb-muted)", fontFamily: "var(--font-caveat)" }}>
            Ngamuat peta…
          </span>
        </div>
        <style>{`@keyframes maos-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Zoom controls — mobile only via CSS */}
      <div className="map-zoom-ctrl">
        <button className="map-zoom-btn" onClick={() => zoomStep(1.5)} aria-label="Zoom in">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
        </button>
        {isZoomed && (
          <button className="map-zoom-btn map-zoom-reset" onClick={resetZoom} aria-label="Reset zoom">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 8v4l3 3"/></svg>
          </button>
        )}
        <button className="map-zoom-btn" onClick={() => zoomStep(1 / 1.5)} aria-label="Zoom out">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>
        </button>
      </div>

      <div
        ref={containerRef}
        style={{ overflow: "hidden", touchAction: "none" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <svg
          viewBox="0 0 900 560"
          preserveAspectRatio="xMidYMid meet"
          className="jabar-map"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transformOrigin: "0 0",
            transition: gesturing ? "none" : "transform 0.2s ease-out",
            willChange: "transform",
          }}
        >
          {/* Fills */}
          {features.map((f) => {
            const isHover = hovered === f.n;
            const isSel = selected === f.n;
            return (
              <path
                key={f.n}
                d={f.d}
                fill={
                  isSel
                    ? "var(--terracotta)"
                    : isHover
                    ? "color-mix(in oklch, var(--terracotta) 25%, var(--paper-2))"
                    : "var(--paper-2)"
                }
                stroke={isSel || isHover ? "var(--terracotta)" : "var(--line-strong)"}
                strokeWidth={isSel ? 1.5 : 0.6}
                strokeLinejoin="round"
                style={{ cursor: "pointer", transition: "fill 0.2s, stroke 0.2s" }}
                onMouseEnter={() => setHovered(f.n)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => { if (!panMoved.current) onSelect(f.n); }}
              />
            );
          })}

          {/* Number badges */}
          {features.map((f) => {
            const isHover = hovered === f.n;
            const isSel = selected === f.n;
            const count = counts[f.name] ?? 0;
            const r = isSel || isHover ? 13 : 11;
            return (
              <g key={`l-${f.n}`} pointerEvents="none">
                <circle
                  cx={f.cx} cy={f.cy} r={r}
                  fill={f.type === "kota" ? "var(--sb-indigo)" : "var(--terracotta)"}
                  stroke="var(--paper)" strokeWidth="1.5"
                />
                <text
                  x={f.cx} y={f.cy + 3.5}
                  textAnchor="middle"
                  fontFamily="'Plus Jakarta Sans', system-ui"
                  fontSize={r > 11 ? "8.5" : "7.5"}
                  fontWeight="700"
                  fill="var(--paper)"
                >
                  {f.n}
                </text>
                {count > 0 && (isSel || isHover) && (
                  <text
                    x={f.cx} y={f.cy + r + 11}
                    textAnchor="middle"
                    fontFamily="'Plus Jakarta Sans', system-ui"
                    fontSize="8"
                    fontWeight="600"
                    fill="var(--terracotta)"
                  >
                    {count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* ─── Page ─── */
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
          if (d.kabupaten) {
            const key = normalizeKabupaten(d.kabupaten);
            map[key] = (map[key] || 0) + 1;
          }
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
          <span className="sb-breadcrumb handwritten">maos → peta dongeng</span>
          <h2>Maos Dongéng sa-Jawa Barat.</h2>
        </div>
        <p>
          Klik wewengkon dina peta kanggo ningali sabaraha dongéng nu parantos dicatet ti daérah éta.{" "}
          <strong>{REGIONS.length}</strong> kabupatén/kota ·{" "}
          {loading ? <span style={{ opacity: 0.5 }}>…</span> : <strong>{total}</strong>}{" "}
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
                <button
                  className="btn-sb-ghost"
                  style={{ padding: "10px 18px", fontSize: 13 }}
                  onClick={() => setSelected(null)}
                >
                  Tutup
                </button>
                <button
                  className="btn-sb-primary"
                  style={{ padding: "10px 18px", fontSize: 13 }}
                  onClick={() =>
                    router.push(
                      `/maos/detail/kabupaten?kabupaten=${encodeURIComponent(selRegion.name)}`
                    )
                  }
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
