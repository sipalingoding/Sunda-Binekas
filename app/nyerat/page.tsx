"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const TERMS = [
  "Eusian heula identitas kalayan lengkep saacan nyerat.",
  "Cantumkeun sumber dongéng — boh tina tradisi lisan masyarakat boh tina literatur tinulis (buku) kalayan ijin pangarangna.",
  "Kersa nampi saran tinu maca saupama dongéng anu ditulis dirasa kurang payus atawa perlu didiskusikeun.",
];

export default function NyeratPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="sb-nyerat paper-bg fade-enter">
      <div className="sb-nyerat-inner">

        {/* Left — copy */}
        <div className="sb-nyerat-copy">
          <div className="sb-hero-eyebrow">
            <span className="dot" />
            Kontribusi Dongéng
          </div>
          <h1>
            Tulis dongéng<br />
            <em>ti lembur</em>{" "}
            <span className="swash">anjeun.</span>
          </h1>
          <p className="lead">
            Bantu ngadokuméntasikeun dongéng Sunda sacara digital. Tiap carita anu anjeun tulis bakal ngajaga warisan budaya pikeun generasi ka hareup.
          </p>
        </div>

        {/* Right — terms card */}
        <div className="sb-nyerat-card">
          <div className="sb-nyerat-card-head">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 12l2 2 4-4" />
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Z" />
            </svg>
            Katangtuan Nyerat
          </div>

          <ol className="sb-nyerat-terms">
            {TERMS.map((t, i) => (
              <li key={i}>
                <span className="sb-nyerat-num">{i + 1}</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>

          <label className="sb-nyerat-agree">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="sb-nyerat-checkbox" aria-hidden />
            <span>Satuju kana katangtuan anu tos ditangtoskeun</span>
          </label>

          <button
            className="sb-nyerat-btn"
            disabled={!agreed}
            onClick={() => router.push("/nyerat/form")}
          >
            Ngawitan Nyerat
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
