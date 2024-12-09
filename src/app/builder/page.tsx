"use client";

import FormBuilderComponent from "@/components/form/form-builder";
import React from "react";
import Image from "next/image";
import { toast } from "sonner";
import Arrow from "@/assets/icons/arrowtopright.svg";
import Doc from "@/assets/icons/doc.svg";
import Tick from "@/assets/icons/tick.svg";
import { FormState, useFormStore } from "@/store/formStore";
import { uploadBuild, uploadDraft } from "@/db/queries";
import { useRouter } from "next/navigation";

const styles = {
  builderPage: "h-full w-full flex justify-center items-center",
  builderWrapper:
    "h-full w-full md:w-[640px] flex-col justify-center align-middle",
  headerContainer:
    "h-[56px] w-full flex justify-between items-center bg-gray-00 border-[1px] border-gray-200 px-6",
  formTitle: "text-[16px] font-[600] border-none outline-none",
  footerContainer:
    "h-[64px] w-full md:w-[640px] flex justify-between items-center bg-[#F6F8FA] bg-opacity-90 border-[1px] border-gray-200 py-4 px-[24px]",
  whiteButtonDisabled:
    "h-[32px] flex justify-center items-center gap-1 py-[6px] px-[16px] bg-white border-[1px] border-gray-200 rounded-xl text-[14px] text-gray-950 font-[600] leading-5 shadow-button",
  greenButtonDisabled:
    "h-[32px] flex justify-center items-center gap-1 py-[7px] px-[16px] bg-green-500 border-[1px] border-green-500 rounded-xl text-[14px] text-white font-[600] leading-5 shadow-button",
};

function FormBuilderPage() {
  const formStore = useFormStore();
  const { formId, formTitle, formElements, updateFormTitle } = formStore;
  const router = useRouter();

  const formObject: FormState = {
    formId: formId,
    formTitle: formTitle,
    formElements: formElements,
  };

  const handleFormUpload = async () => {
    await deleteDraft(formObject);
    await uploadBuild(formObject);
    localStorage.removeItem(`form-build-${formId}`);
  };

  const handleSaveDraftLocally = () => {
    localStorage.setItem(
      `form-build-${formObject.formId}`,
      JSON.stringify(formObject),
    );
  };

  const handleSaveDraftGlobally = async () => {
    await uploadDraft(formObject);
  };

  const handleFormPreview = async () => {
    handleSaveDraftLocally();
    router.push(`/preview/${formId}`);
  };

  return (
    <div className={styles.builderPage}>
      <div className={styles.builderWrapper}>
        <div className={styles.headerContainer}>
          <input
            className={styles.formTitle}
            type="text"
            placeholder="Untitled form"
            value={formTitle}
            onChange={(e) => updateFormTitle(e.target.value)}
          />
          <button
            className={`${styles.whiteButtonDisabled} ${formElements.length > 0 ? "opacity-100" : "opacity-50"}`}
            disabled={formElements.length > 0 ? false : true}
            onClick={() => handleFormPreview()}
          >
            Preview
            <Image src={Arrow} alt="preview"></Image>
          </button>
        </div>
        <FormBuilderComponent />
        <div className={styles.footerContainer}>
          <button
            className={`${styles.whiteButtonDisabled} ${formElements.length > 0 ? "opacity-100" : "opacity-50"}`}
            disabled={formElements.length > 0 ? false : true}
            onClick={() =>
              toast.promise(handleSaveDraftGlobally(), {
                loading: "Uploading Form Draft",
                success: "Form Draft Uploaded",
                error: "Failed to Upload Form Draft",
              })
            }
          >
            <Image src={Doc} alt="draft"></Image>
            Save as Draft
          </button>
          <button
            onClick={() =>
              toast.promise(handleFormUpload(), {
                loading: "Uploading Current Build",
                success: "Form Build Uploaded Successfully",
                error: "Failed to Upload Form Build",
              })
            }
            className={`${styles.greenButtonDisabled} ${formElements.length > 0 ? "opacity-100" : "opacity-50"}`}
            disabled={formElements.length > 0 ? false : true}
          >
            <Image src={Tick} alt="publish"></Image>
            Publish Form
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormBuilderPage;
