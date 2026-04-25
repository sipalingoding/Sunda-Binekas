"use client";

import { useEffect, useState } from "react";

interface SafeHTMLContentProps {
  html: string;
}

export default function SafeHTMLContent({ html }: SafeHTMLContentProps) {
  const [cleanHTML, setCleanHTML] = useState("");

  useEffect(() => {
    (async () => {
      // import hanya di client agar tidak bentrok dengan SSR
      const DOMPurify = (await import("dompurify")).default;
      setCleanHTML(DOMPurify.sanitize(html));
    })();
  }, [html]);

  return (
    <div
      className="nd-eusi-content"
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
    />
  );
}
