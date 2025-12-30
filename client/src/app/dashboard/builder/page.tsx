"use client";

import FormBuilderComponent from "@/components/form/form-builder";
import React from "react";
import FormBuilderHeaderComponent from "@/components/form/form-builder-header";
import FormBuilderFooterComponent from "@/components/form/form-builder-footer";

function FormBuilderPage() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="h-full w-full flex flex-col justify-center items-center gap-2">
        <FormBuilderHeaderComponent />
        <FormBuilderComponent />
        <FormBuilderFooterComponent />
      </div>
    </div>
  );
}

export default FormBuilderPage;
