"use client";

import React, { Suspense } from "react";
import MaosByKabupatenPage from "./maosbykabupaten/MaosByKabupaten";

export default function MaosByKabupatenPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MaosByKabupatenPage />
    </Suspense>
  );
}
