"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const LoginPage = () => {
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [mode, setMode] = useState<"login" | "daftar">("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ surel: "", sandi: "", nami: "" });
  const router = useRouter();

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.surel,
        password: form.sandi,
      });
      if (error) {
        toast({ title: "Gagal masuk", description: error.message, variant: "destructive" });
        setLoading(false);
      } else {
        setSubmitted(true);
        setTimeout(() => { window.location.href = "/"; }, 1200);
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: form.surel,
        password: form.sandi,
        options: { data: { full_name: form.nami } },
      });
      if (error) {
        toast({ title: "Gagal daftar", description: error.message, variant: "destructive" });
        setLoading(false);
      } else {
        setSubmitted(true);
        setTimeout(() => { window.location.href = "/"; }, 1200);
      }
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) toast({ title: "Login gagal", description: error.message, variant: "destructive" });
  };

  return (
    <div className="login-page">
      {/* Left panel — illustration */}
      <div className="login-left">
        <div className="login-brand">
          <div className="lb-mark">
            <img src="/images/LOGO.png" alt="Sunda Binekas" width={28} height={28} style={{ objectFit: "contain" }} />
          </div>
          <div>
            <div className="lb-name">Sunda Binekas</div>
            <div className="lb-tag">Peta Dongéng · Karuhun Sunda</div>
          </div>
        </div>

        {/* SVG Illustration */}
        <div className="login-illo">
          <svg viewBox="0 0 480 560" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="il-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="oklch(0.32 0.08 260)" />
                <stop offset="1" stopColor="oklch(0.42 0.1 250)" />
              </linearGradient>
              <pattern id="il-batik" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="18" fill="none" stroke="oklch(0.85 0.1 75 / 0.18)" strokeWidth="1" />
                <circle cx="30" cy="30" r="9" fill="none" stroke="oklch(0.85 0.1 75 / 0.18)" strokeWidth="1" />
                <circle cx="0" cy="0" r="18" fill="none" stroke="oklch(0.85 0.1 75 / 0.18)" strokeWidth="1" />
                <circle cx="60" cy="0" r="18" fill="none" stroke="oklch(0.85 0.1 75 / 0.18)" strokeWidth="1" />
                <circle cx="0" cy="60" r="18" fill="none" stroke="oklch(0.85 0.1 75 / 0.18)" strokeWidth="1" />
                <circle cx="60" cy="60" r="18" fill="none" stroke="oklch(0.85 0.1 75 / 0.18)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="480" height="560" fill="url(#il-bg)" />
            <rect width="480" height="560" fill="url(#il-batik)" />
            {/* Wayang figure 1 */}
            <g transform="translate(150, 300)">
              <ellipse cx="0" cy="180" rx="60" ry="10" fill="oklch(0 0 0 / 0.3)" />
              <rect x="-28" y="40" width="56" height="140" rx="8" fill="oklch(0.2 0.04 280)" />
              <rect x="-28" y="40" width="56" height="140" rx="8" fill="url(#il-batik)" opacity="0.4" />
              <path d="M-30 50 L-60 90 L-50 110 L-25 80 Z" fill="oklch(0.2 0.04 280)" />
              <path d="M30 50 L50 40 L60 50 L40 70 Z" fill="oklch(0.2 0.04 280)" />
              <circle cx="0" cy="10" r="25" fill="oklch(0.68 0.09 50)" />
              <path d="M-25 -5 Q0 -25 25 -5 L20 10 L-20 10 Z" fill="oklch(0.22 0.05 280)" />
              <circle cx="-8" cy="12" r="1.5" fill="oklch(0.15 0.02 60)" />
              <circle cx="8" cy="12" r="1.5" fill="oklch(0.15 0.02 60)" />
              <path d="M-8 22 Q0 28 8 22" stroke="oklch(0.3 0.05 40)" strokeWidth="1.5" fill="none" />
            </g>
            {/* Wayang figure 2 */}
            <g transform="translate(330, 310)">
              <ellipse cx="0" cy="170" rx="55" ry="9" fill="oklch(0 0 0 / 0.3)" />
              <rect x="-26" y="45" width="52" height="125" rx="8" fill="oklch(0.85 0.08 75)" />
              <rect x="-26" y="45" width="52" height="125" rx="8" fill="url(#il-batik)" opacity="0.3" />
              <path d="M-28 55 L-55 95 L-45 110 L-22 85 Z" fill="oklch(0.85 0.08 75)" />
              <path d="M28 55 L50 45 L58 55 L35 75 Z" fill="oklch(0.85 0.08 75)" />
              <circle cx="0" cy="15" r="24" fill="oklch(0.7 0.09 45)" />
              <path d="M-24 5 Q0 -8 24 5 L22 15 L-22 15 Z" fill="oklch(0.25 0.04 40)" />
              <circle cx="-7" cy="18" r="1.5" fill="oklch(0.15 0.02 60)" />
              <circle cx="7" cy="18" r="1.5" fill="oklch(0.15 0.02 60)" />
              <path d="M-6 26 Q0 31 6 26" stroke="oklch(0.3 0.05 40)" strokeWidth="1.5" fill="none" />
            </g>
            {/* Stars */}
            {([[80, 80], [400, 120], [60, 400], [420, 450], [240, 60]] as [number, number][]).map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1.8" fill="oklch(0.9 0.1 70)" opacity="0.7" />
            ))}
            {/* Gunungan silhouette */}
            <path
              d="M240 80 L290 140 L310 230 L300 300 L270 320 L210 320 L180 300 L170 230 L190 140 Z"
              fill="oklch(0.25 0.07 280)"
              opacity="0.6"
            />
          </svg>
        </div>

        <div className="login-quote handwritten">
          "Sampurasun — wilujeng sumping di tempat dongéng urang."
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login-right">
        <button className="login-close" onClick={() => router.push("/")} aria-label="Tutup">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="login-form-wrap fade-enter">
          <div className="lf-eyebrow handwritten">
            {mode === "login" ? "Sampurasun" : "Wilujeng Sumping"}
          </div>
          <h2 className="lf-title">
            {mode === "login" ? "Hayu lebet heula." : "Hayu daptar heula."}
          </h2>
          <p className="lf-sub">
            {mode === "login"
              ? "Terasken maos dongéng nu tos disimpen."
              : "Damel akun énggal kanggo nyimpen dongéng karesep."}
          </p>

          {submitted ? (
            <div className="lf-success fade-enter">
              <div className="ls-check">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </div>
              <h3>Hatur nuhun!</h3>
              <p>Anjeun bakal dibawa deui ka beranda…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="lf-form">
              {mode === "daftar" && (
                <div className="lf-field">
                  <label>Nami Lengkep</label>
                  <input
                    type="text"
                    placeholder="Lebetkeun nami"
                    value={form.nami}
                    onChange={(e) => update("nami", e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="lf-field">
                <label>Surél</label>
                <input
                  type="email"
                  placeholder="Lebetkeun surél"
                  value={form.surel}
                  onChange={(e) => update("surel", e.target.value)}
                  required
                />
              </div>

              <div className="lf-field">
                <label>Sandi</label>
                <div className="lf-pass">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Lebetkeun sandi"
                    value={form.sandi}
                    onChange={(e) => update("sandi", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="lf-eye"
                    onClick={() => setShowPass((s) => !s)}
                    aria-label="Tingal sandi"
                  >
                    {showPass ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {mode === "login" && (
                  <a className="lf-forgot" href="#">Hilap sandi?</a>
                )}
              </div>

              <button type="submit" className="lf-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span style={{ width: 16, height: 16, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "lf-spin 0.8s linear infinite" }} />
                    Ngantosan…
                  </>
                ) : (
                  <>
                    {mode === "login" ? "Lebet" : "Damel akun"}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </>
                )}
              </button>

              <div className="lf-divider"><span>atawa</span></div>

              <button type="button" className="lf-google" onClick={handleGoogle}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 19 13 24 13c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.3c-2 1.4-4.5 2.3-7.3 2.3-5.2 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.1 4.1-3.9 5.5l6.2 5.3C42 35.1 44 29.9 44 24c0-1.3-.1-2.6-.4-3.9z" />
                </svg>
                Lanjutkeun ku Google
              </button>

              <div className="lf-switch">
                {mode === "login" ? (
                  <>
                    Teu acan gaduh akun?{" "}
                    <button type="button" onClick={() => setMode("daftar")}>Daptar</button>
                  </>
                ) : (
                  <>
                    Parantos gaduh akun?{" "}
                    <button type="button" onClick={() => setMode("login")}>Lebet</button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`@keyframes lf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoginPage;
