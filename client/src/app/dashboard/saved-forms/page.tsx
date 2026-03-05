"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFormDrafts } from "@/utils/formApiHelper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DraftFormRow = {
  id: string;
  formName: string;
  updatedAt: string | null;
};

function SavedFormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<DraftFormRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadDrafts = async () => {
      try {
        setIsLoading(true);
        const data = await getFormDrafts();
        if (isMounted) {
          setForms(data as DraftFormRow[]);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load saved drafts");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDrafts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-[600] text-gray-950">Saved Drafts</h1>
        <p className="text-[13px] text-gray-500">Draft forms saved in your builder.</p>
      </div>

      <div className="flex-1 min-h-0 rounded-xl border border-gray-200 bg-white">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-[13px] text-gray-500">Loading drafts...</div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-[13px] text-red-600">{error}</div>
        ) : forms.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[13px] text-gray-500">No saved drafts yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Name</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Form ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form) => (
                <TableRow
                  key={form.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/dashboard/builder/${form.id}`)}
                >
                  <TableCell className="font-[600] text-gray-950">{form.formName}</TableCell>
                  <TableCell className="text-gray-600">
                    {form.updatedAt ? new Date(form.updatedAt).toLocaleString() : "-"}
                  </TableCell>
                  <TableCell className="text-right text-[12px] text-gray-500">{form.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default SavedFormsPage;
