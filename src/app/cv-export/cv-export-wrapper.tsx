"use client";

import { CVPreview } from "@/components/cv-preview";
import type { Employee } from "@/components/cv-app";

export function CVExportWrapper({ employee }: { employee: Employee }) {
  return (
    <CVPreview
      employee={employee}
      onTotalPagesChange={(total) => {
        if (total > 0) {
          document.body.setAttribute("data-export-ready", "true");
        }
      }}
    />
  );
}
