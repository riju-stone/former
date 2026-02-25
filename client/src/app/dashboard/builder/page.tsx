"use client";

import FormBuilderComponent from "@/components/form/form-builder";
import React from "react";
import FormBuilderHeaderComponent from "@/components/form/form-builder-header";
import FormBuilderFooterComponent from "@/components/form/form-builder-footer";

function FormBuilderPage() {
  return (
    <div className="h-full w-full max-w-full flex flex-col gap-2 overflow-hidden">
      <FormBuilderHeaderComponent />
      <div className="flex-1 min-h-0 min-w-0">
        <FormBuilderComponent />
      </div>
      <FormBuilderFooterComponent />
    </div>
  );
}

export default FormBuilderPage;
