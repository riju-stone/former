"use client";

import React, { use, useEffect, useState } from "react";
import FormBuilderComponent from "@/components/form/form-builder";
import { toast } from "sonner";
import { useFormStore } from "@/store/formBuilderStore";
import { FormBuilderData } from "@/types/formBuilderState";
import { useRouter } from "next/navigation";
import { fetchFormBuilderData } from "@/utils/formApiHelper";
import FormBuilderHeaderComponent from "@/components/form/form-builder-header";
import FormBuilderFooterComponent from "@/components/form/form-builder-footer";

function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const formStore = useFormStore();
  const { resetFormStore, loadForm } = formStore;

  const router = useRouter();

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setIsLoading(true);
        const formData = await fetchFormBuilderData(id);

        console.log("Fetched formData:", formData);

        if (formData && formData.builderData && Object.keys(formData.builderData).length > 0) {
          // Reset the form store first
          resetFormStore();

          // Parse the builder data from JSON string to object
          const builderData = formData.builderData as Record<string, FormBuilderData>;

          console.log("Loading form with:", {
            builderData,
            steps: Object.keys(builderData).length,
            id: formData.id,
            title: formData.formName,
          });

          // Load the form data directly
          loadForm(builderData, Object.keys(builderData).length, formData.id, formData.formName);

          toast.success("Form build loaded successfully");
        } else {
          toast.error("Form not found");
          router.push("/builder");
        }
      } catch (error) {
        console.error("Error loading form:", error);
        toast.error("Failed to load form");
      } finally {
        setIsLoading(false);
      }
    };

    loadFormData();
  }, [id, resetFormStore, loadForm, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full w-full">Loading form data</div>;
  }

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
