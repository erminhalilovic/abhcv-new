import { CVExportWrapper } from "./cv-export-wrapper";
import type { Employee } from "@/components/cv-app";

export const dynamic = "force-dynamic";

export default async function CVExportPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const { data } = await searchParams;
  if (!data) return <div>No data</div>;

  let employee: Employee;
  try {
    employee = JSON.parse(atob(data)) as Employee;
  } catch {
    return <div>Invalid data</div>;
  }

  return <CVExportWrapper employee={employee} />;
}
