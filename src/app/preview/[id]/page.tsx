"use client";

import React from "react";
import { useRouter } from "next/router";

function FormPreviewPage() {
  const router = useRouter();
  return <div>Preview for {router.query.id}</div>;
}

export default FormPreviewPage;
