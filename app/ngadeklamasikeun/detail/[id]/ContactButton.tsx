"use client";

import { useState } from "react";

type Props = { email: string; nohp: string };

export default function ContactButton({ email, nohp }: Props) {
  const [open, setOpen] = useState(false);

  const waPhone = nohp?.replace(/\D/g, "").replace(/^0/, "62");

  return (
    <>
      <button className="nd-footer-item" onClick={() => setOpen(true)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" />
        </svg>
        Hubungi Kontributor
      </button>

      {open && (
        <div className="nd-modal-overlay" onClick={() => setOpen(false)}>
          <div className="nd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nd-modal-head">
              <span className="nd-modal-title">Kontak Kontributor</span>
              <button className="nd-modal-close" onClick={() => setOpen(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="nd-modal-sub">Mangga tiasa ngahubungi kontributor ngangge:</p>
            <div className="nd-modal-contact">
              <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {email}
              </a>
              {nohp && (
                <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  {nohp}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
