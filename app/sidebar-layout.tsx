"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import "../i18n";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { logout } from "@/services/authService";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/", label: "Beranda", exact: true },
  { href: "/warta", label: "Warta", exact: false },
];

const FITUR_LINKS = [
  {
    href: "/maos",
    label: "Maos",
    desc: "Baca dongéng dina peta interaktif",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    href: "/ngupingkeun",
    label: "Ngupingkeun",
    desc: "Dengekeun dongéng sacara audio",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
  {
    href: "/nyerat",
    label: "Nyerat",
    desc: "Tulis jeung kirimkeun dongéng anjeun",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    href: "/ngadeklamasikeun",
    label: "Ngadeklamasikeun",
    desc: "Rekam sora anjeun maca dongéng",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
  },
];

type UserProfile = {
  username: string | null;
  photo: string | null;
  role: string | null;
};

const KONTAK_INFO = {
  email: "sundabinekas@gmail.com",
  whatsapp: "6281221808959",
};

/* ─── Kontak Dropdown ─── */
function KontakDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="nav-fitur-wrapper">
      <button
        className="nav-fitur-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Kontak
        <svg className="nav-fitur-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="nav-kontak-dropdown">
          <div className="nav-fitur-dropdown-label">Hubungi Kami</div>
          <a
            href={`mailto:${KONTAK_INFO.email}`}
            className="nav-kontak-item"
            onClick={() => setOpen(false)}
          >
            <div className="nav-kontak-icon nav-kontak-icon--email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="M2 7l10 7 10-7" />
              </svg>
            </div>
            <div className="nav-kontak-info">
              <span className="nav-kontak-label">Email</span>
              <span className="nav-kontak-value">{KONTAK_INFO.email}</span>
            </div>
          </a>
          <a
            href={`https://wa.me/${KONTAK_INFO.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-kontak-item"
            onClick={() => setOpen(false)}
          >
            <div className="nav-kontak-icon nav-kontak-icon--wa">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div className="nav-kontak-info">
              <span className="nav-kontak-label">WhatsApp</span>
              <span className="nav-kontak-value">+{KONTAK_INFO.whatsapp}</span>
            </div>
          </a>
        </div>
      )}
    </div>
  );
}

/* ─── Fitur Dropdown ─── */
function FiturDropdown({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isAnyActive = FITUR_LINKS.some((f) => pathname?.startsWith(f.href));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="nav-fitur-wrapper">
      <button
        className={`nav-fitur-btn${isAnyActive ? " active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Fitur Utami
        <svg className="nav-fitur-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="nav-fitur-dropdown">
          <div className="nav-fitur-dropdown-label">Fitur Utami</div>
          {FITUR_LINKS.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={`nav-fitur-item${pathname?.startsWith(f.href) ? " active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <div className="nav-fitur-icon">{f.icon}</div>
              <div className="nav-fitur-info">
                <span className="nav-fitur-name">{f.label}</span>
                <span className="nav-fitur-desc">{f.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── User Avatar ─── */
function UserAvatar({ user, profile }: { user: User; profile: UserProfile | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const avatarUrl = profile?.photo || user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
  const displayName = profile?.username || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "U";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    try { await logout(); router.push("/login"); } catch (err) { console.error(err); }
  };

  return (
    <div ref={ref} className="nav-avatar-wrapper">
      <button className="nav-avatar-btn" onClick={() => setOpen((v) => !v)} aria-label="Menu profil" aria-expanded={open}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="nav-avatar-img" />
        ) : (
          <span className="nav-avatar-fallback">{initials}</span>
        )}
      </button>

      {open && (
        <div className="nav-avatar-dropdown">
          <div className="nav-avatar-info">
            <span className="nav-avatar-name">{displayName}</span>
            <span className="nav-avatar-email">{user.email}</span>
          </div>
          <div className="nav-avatar-divider" />
          <button className="nav-avatar-item" onClick={() => { setOpen(false); router.push("/profile"); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Profil
          </button>
          {profile?.role === "admin" && (
            <button className="nav-avatar-item" onClick={() => { setOpen(false); router.push("/admin"); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Admin
            </button>
          )}
          <button className="nav-avatar-item nav-avatar-logout" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Kaluar
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Site Header ─── */
function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fiturOpen, setFiturOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const saved = localStorage.getItem("sb-theme") as "light" | "dark" | null;
    if (saved) { setTheme(saved); document.documentElement.dataset.theme = saved; }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) return;
      const data = await res.json();
      setProfile(data ?? null);
    } catch { /* silent */ }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) fetchProfile();
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) fetchProfile();
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("sb-theme", next);
    document.documentElement.dataset.theme = next;
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname?.startsWith(href);

  const avatarUrl = profile?.photo || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  const displayName = profile?.username || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "U";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const isFiturActive = FITUR_LINKS.some((f) => pathname?.startsWith(f.href));

  return (
    <>
      <header className="site-header">
        <div className="inner">
          {/* Brand */}
          <Link href="/" className="brand">
            <div className="brand-mark" aria-hidden>
              <img src="/images/LOGO.png" alt="Sunda Binekas" width={28} height={28} style={{ objectFit: "contain" }} />
            </div>
            <div className="brand-text">
              <div className="name">Sunda Binekas</div>
              <div className="tag">Dongéng pikeun urang</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="sb-nav">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={isActive(link.href, link.exact) ? "nav-active" : ""}>
                {link.label}
              </Link>
            ))}

            <FiturDropdown pathname={pathname} />

            <KontakDropdown />

            <button className="theme-toggle" onClick={toggleTheme} title="Ganti tema" aria-label="Ganti tema">
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z" />
                </svg>
              )}
            </button>

            {user ? (
              <UserAvatar user={user} profile={profile} />
            ) : (
              <Link href="/login" className={`nav-lebet${isActive("/login", false) ? " nav-active" : ""}`}>
                Lebet
              </Link>
            )}
          </nav>

          {/* Mobile toggle */}
          <button className="sb-nav-mobile-toggle" onClick={() => setDrawerOpen(true)} aria-label="Buka menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="sb-nav-drawer" onClick={() => setDrawerOpen(false)} style={{ display: "block" }}>
          <div className="sb-nav-drawer-inner" onClick={(e) => e.stopPropagation()}>

            {/* Header: logo + close */}
            <div className="sb-drawer-header">
              <Link href="/" className="sb-drawer-brand" onClick={() => setDrawerOpen(false)}>
                <img src="/images/LOGO.png" alt="Sunda Binekas" width={28} height={28} style={{ objectFit: "contain" }} />
                <span className="sb-drawer-brand-name">Sunda Binekas</span>
              </Link>
              <button className="sb-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Tutup menu">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="sb-drawer-body sb-nav-drawer-inner">

              {/* Regular links */}
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive(link.href, link.exact) ? "nav-active" : ""}
                  onClick={() => setDrawerOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Fitur Utami accordion */}
              <button
                className={`sb-drawer-fitur-toggle${isFiturActive ? " active" : ""}`}
                onClick={() => setFiturOpen((v) => !v)}
              >
                Fitur Utami
                <svg style={{ transition: "transform 0.2s", transform: fiturOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.6 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {fiturOpen && (
                <div className="sb-drawer-fitur-sub">
                  {FITUR_LINKS.map((f) => (
                    <Link
                      key={f.href}
                      href={f.href}
                      className={pathname?.startsWith(f.href) ? "nav-active" : ""}
                      onClick={() => { setDrawerOpen(false); setFiturOpen(false); }}
                    >
                      {f.label}
                    </Link>
                  ))}
                </div>
              )}

              <div className="sb-drawer-divider" />

              {/* Kontak section */}
              <div className="sb-drawer-kontak">
                <div className="sb-drawer-section-label">Kontak</div>
                <a href={`mailto:${KONTAK_INFO.email}`} className="sb-drawer-kontak-item" onClick={() => setDrawerOpen(false)}>
                  <div className="nav-kontak-icon nav-kontak-icon--email">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="3" />
                      <path d="M2 7l10 7 10-7" />
                    </svg>
                  </div>
                  {KONTAK_INFO.email}
                </a>
                <a href={`https://wa.me/${KONTAK_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="sb-drawer-kontak-item" onClick={() => setDrawerOpen(false)}>
                  <div className="nav-kontak-icon nav-kontak-icon--wa">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  +{KONTAK_INFO.whatsapp}
                </a>
              </div>

              <div className="sb-drawer-divider" />

              {/* User section */}
              {user ? (
                <div className="sb-drawer-user">
                  <div className="sb-drawer-user-info">
                    <div className="nav-avatar-btn" style={{ pointerEvents: "none", flexShrink: 0 }}>
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Profil" className="nav-avatar-img" />
                      ) : (
                        <span className="nav-avatar-fallback">{initials}</span>
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="sb-drawer-username">{displayName}</div>
                      <div className="sb-drawer-email">{user.email}</div>
                    </div>
                  </div>
                  <Link href="/profile" className="sb-drawer-action-link" onClick={() => setDrawerOpen(false)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    Profil
                  </Link>
                  {profile?.role === "admin" && (
                    <Link href="/admin" className="sb-drawer-action-link" onClick={() => setDrawerOpen(false)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      Admin
                    </Link>
                  )}
                  <button
                    className="sb-drawer-action-btn sb-drawer-logout"
                    onClick={async () => { setDrawerOpen(false); await logout(); router.push("/login"); }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Kaluar
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className={`nav-lebet${isActive("/login", false) ? " nav-active" : ""}`}
                  onClick={() => setDrawerOpen(false)}
                >
                  Lebet
                </Link>
              )}
            </div>

            {/* Footer: theme toggle */}
            <div className="sb-drawer-footer">
              <button className="sb-drawer-theme-btn" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z" />
                  </svg>
                )}
                {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

/* ─── Site Footer ─── */
function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <div>
          <div className="sf-brand">
            <div className="sf-mark" aria-hidden>
              <img src="/images/LOGO.png" alt="Sunda Binekas" width={24} height={24} style={{ objectFit: "contain" }} />
            </div>
            <span className="sf-brand-name">Sunda Binekas</span>
          </div>
          <p className="sf-desc">
            Proyék amatir ngalestarikeun dongéng Sunda dina wangun<br />
            digital. Dijieun ku ati, pikeun barudak jeung nu sepuh.
          </p>
        </div>
        <div className="sf-right">
          <div className="sf-tagline">Hatur nuhun parantos maos</div>
          <div className="sf-copy">© {new Date().getFullYear()} · Dongéng pikeun urang sadaya</div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Root Layout ─── */
export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname?.startsWith("/login") || pathname?.startsWith("/register");

  if (hideNav) return <>{children}</>;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      <SiteHeader />
      <main style={{ flex: 1 }}>{children}</main>
      <SiteFooter />
    </div>
  );
}
