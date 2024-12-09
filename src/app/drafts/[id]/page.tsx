"use client";

import React from "react";
import { useRouter } from "next/router";

function FormDraftPage() {
  const router = useRouter();
  return <div>FormDraftPage ID: {router.query.id}</div>;
}

export default FormDraftPage;
