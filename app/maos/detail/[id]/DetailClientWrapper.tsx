"use client";

import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import ContentViewer from "./ContentViewer";

export default function DetailClientWrapper({
  eusi,
  translate,
}: {
  eusi: string;
  translate?: string;
}) {
  const [lang, setLang] = useState<"su" | "id">("su");

  return (
    <div>
      <LanguageSwitcher available={!!translate} onChange={(l) => setLang(l)} />
      <ContentViewer eusi={eusi} translate={translate} lang={lang} />
    </div>
  );
}
