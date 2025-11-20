"use client";

import SafeHTMLContent from "./safe-html/SafeHtml";

export default function ContentViewer({
  eusi,
  translate,
  lang,
}: {
  eusi: string;
  translate?: string;
  lang: "su" | "id";
}) {
  const html = lang === "id" && translate ? translate : eusi;
  return <SafeHTMLContent html={html} />;
}
