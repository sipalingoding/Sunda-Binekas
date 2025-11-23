"use client";

import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import ContentViewer from "./ContentViewer";
import AudioReader from "./audio-reader";

export default function DetailClientWrapper({
  eusi,
  translate,
  audio,
  role,
}: {
  eusi: string;
  translate?: string;
  audio?: string;
  role?: string | null;
}) {
  const [lang, setLang] = useState<"su" | "id">("su");

  return (
    <>
      {/* Audio + Dropdown */}
      <div className="flex gap-2 absolute top-10 right-10 lg:top-16 lg:right-16">
        <LanguageSwitcher
          available={!!translate}
          onChange={(l) => setLang(l)}
        />
        {audio && role === "admin" ? <AudioReader audioUrl={audio} /> : null}
      </div>

      {/* Content */}
      <ContentViewer eusi={eusi} translate={translate} lang={lang} />
    </>
  );
}
