"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import "../i18n";

const NAV_LINKS = [
  { href: "/", label: "Beranda", exact: true },
  { href: "/maos", label: "Maos", exact: false },
  { href: "/rereongan", label: "Dongéng", exact: false },
  { href: "/nyerat", label: "Nyerat", exact: false },
  { href: "/warta", label: "Warta", exact: false },
];

function SiteHeader() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sb-theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.dataset.theme = saved;
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("sb-theme", next);
    document.documentElement.dataset.theme = next;
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname?.startsWith(href);

  return (
    <>
      <header className="site-header">
        <div className="inner">
          {/* Brand */}
          <Link href="/" className="brand">
            <div className="brand-mark" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 6 Q12 2 20 6 L20 18 Q12 22 4 18 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M12 4 L12 20" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <div className="brand-text">
              <div className="name">Sunda Binekas</div>
              <div className="tag">Dongéng pikeun urang</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="sb-nav">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href, link.exact) ? "nav-active" : ""}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className={`nav-lebet${isActive("/login", false) ? " nav-active" : ""}`}
            >
              Lebet
            </Link>
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
          </nav>

          {/* Mobile toggle */}
          <button
            className="sb-nav-mobile-toggle"
            onClick={() => setDrawerOpen(true)}
            aria-label="Buka menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="sb-nav-drawer" onClick={() => setDrawerOpen(false)} style={{ display: "block" }}>
          <div className="sb-nav-drawer-inner" onClick={(e) => e.stopPropagation()}>
            <button className="sb-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Tutup menu">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
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
            <Link
              href="/login"
              className={`nav-lebet${isActive("/login", false) ? " nav-active" : ""}`}
              onClick={() => setDrawerOpen(false)}
            >
              Lebet
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <div>
          <div className="sf-brand">
            <div className="sf-mark" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 6 Q12 2 20 6 L20 18 Q12 22 4 18 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M12 4 L12 20" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
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

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNav =
    pathname?.startsWith("/login") || pathname?.startsWith("/register");

  if (hideNav) {
    return <>{children}</>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      <SiteHeader />
      <main style={{ flex: 1 }}>{children}</main>
      <SiteFooter />
    </div>
  );
}
