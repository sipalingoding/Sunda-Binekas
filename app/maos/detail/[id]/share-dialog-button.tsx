"use client";

import { useState } from "react";

export default function ShareDialogButton({ link }: { link: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <button className="nd-footer-item" onClick={() => setOpen(true)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Bagikeun
      </button>

      {open && (
        <div className="nd-modal-overlay" onClick={() => setOpen(false)}>
          <div className="nd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nd-modal-head">
              <span className="nd-modal-title">Bagikeun Dongéng</span>
              <button className="nd-modal-close" onClick={() => setOpen(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="nd-modal-sub">Salin link di handap pikeun ngabagikeun dongéng ieu.</p>
            <div className="nd-share-row">
              <input className="nd-share-input" value={link} readOnly />
              <button className="nd-share-copy" onClick={handleCopy}>
                {copied ? "Disalin!" : "Salin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
