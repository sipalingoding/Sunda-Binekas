"use client";

import { useState } from "react";

export default function LanguageSwitcher({
  onChange,
  available,
}: {
  onChange: (lang: "su" | "id") => void;
  available: boolean;
}) {
  const [active, setActive] = useState<"su" | "id">("su");

  if (!available) return null;

  const select = (lang: "su" | "id") => {
    setActive(lang);
    onChange(lang);
  };

  return (
    <div className="ls-wrap">
      <button
        className={`ls-btn${active === "su" ? " ls-active" : ""}`}
        onClick={() => select("su")}
      >
        Sunda
      </button>
      <button
        className={`ls-btn${active === "id" ? " ls-active" : ""}`}
        onClick={() => select("id")}
      >
        Indonesia
      </button>
    </div>
  );
}
