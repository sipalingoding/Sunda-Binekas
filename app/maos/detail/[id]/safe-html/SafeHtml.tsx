"use client";

import DOMPurify from "dompurify";

interface SafeHTMLContentProps {
  html: string;
}

export default function SafeHTMLContent({ html }: SafeHTMLContentProps) {
  const clean = DOMPurify.sanitize(html);
  return (
    <div
      className="prose prose-sm md:prose-base lg:prose-lg leading-relaxed text-justify max-w-none"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
