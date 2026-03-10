"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
  type ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  Maximize,
  Share,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { CVPreview } from "@/components/cv-preview";
import { CVEditor } from "@/components/cv-editor";

export type EmploymentHistory = {
  id: string;
  from: string;
  to: string;
  isPresent: boolean;
  role: string;
  company: string;
};

export type Education = {
  id: string;
  from: string;
  to: string;
  isPresent: boolean;
  degree: string;
  school: string;
};

export type Responsibility = {
  id: string;
  title: string;
  description: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
};

export type Employee = {
  id: number;
  name: string;
  role: string;
  showRole: boolean;
  summary: string;
  employmentHistory: EmploymentHistory[];
  education: Education[];
  responsibilities: Responsibility[];
  projects: Project[];
  languages: string[];
  technologies: string[];
  strengths: string[];
  active: boolean;
  editing: boolean;
};

const DEFAULT_EMPLOYMENT_HISTORY: EmploymentHistory[] = [
  {
    id: "emp-1",
    from: "2020",
    to: "",
    isPresent: true,
    role: "Founding Designer",
    company: "Atlantbh",
  },
];

const DEFAULT_EDUCATION: Education[] = [
  {
    id: "edu-1",
    from: "2016",
    to: "2021",
    isPresent: false,
    degree: "Bachelor's Degree, Computer Science",
    school: "Faculty of Electrical Engineering Sarajevo",
  },
];

const DEFAULT_SUMMARY =
  "Lorem ipsum dolor sit amet consectetur. At egestas vel tempor ante. Libero fringilla elit ornare imperdiet id tortor nec diam. Sed arcu senectus ultrices pellentesque donec lorem donec lectus lacus. Magna tempus porttitor diam scelerisque suspendisse fringilla.";

const DEFAULT_RESPONSIBILITIES: Responsibility[] = [
  {
    id: "resp-1",
    title: "Lead Frontend Architecture & Development",
    description:
      "Responsible for architecting and implementing scalable frontend solutions using React, Next.js, and TypeScript. Leading technical decisions for web applications.",
  },
  {
    id: "resp-2",
    title: "Team Mentorship & Code Quality Assurance",
    description:
      "Mentoring junior and mid-level developers through code reviews, pair programming sessions, and technical workshops.",
  },
  {
    id: "resp-3",
    title: "Product Design System Maintenance",
    description:
      "Maintaining and evolving the company-wide design system with reusable components and documentation.",
  },
  {
    id: "resp-4",
    title: "API Integration & Backend Collaboration",
    description:
      "Designing and implementing RESTful and GraphQL API integrations for complex web applications.",
  },
  {
    id: "resp-5",
    title: "Performance Optimization & Monitoring",
    description:
      "Implementing performance monitoring, optimization strategies, and lighthouse score improvements across all projects.",
  },
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Enterprise Dashboard Redesign",
    description:
      "Led the complete redesign of the enterprise analytics dashboard serving 10,000+ daily active users.",
    technologies: ["React", "Next.js", "TypeScript"],
  },
  {
    id: "proj-2",
    title: "Design System v2.0",
    description:
      "Built a comprehensive design system with 50+ reusable components, reducing development time by 40%.",
    technologies: ["Tailwind CSS", "Storybook"],
  },
  {
    id: "proj-3",
    title: "Mobile-First E-Commerce Platform",
    description:
      "Developed a responsive e-commerce platform with accessibility compliance and progressive web app capabilities.",
    technologies: ["GraphQL", "REST API", "Node.js"],
  },
];

function createEmployee(
  id: number,
  name: string,
  active: boolean,
  editing: boolean
): Employee {
  return {
    id,
    name,
    role: "Founding Designer",
    showRole: true,
    summary: DEFAULT_SUMMARY,
    employmentHistory: DEFAULT_EMPLOYMENT_HISTORY.map((e) => ({ ...e })),
    education: DEFAULT_EDUCATION.map((e) => ({ ...e })),
    responsibilities: DEFAULT_RESPONSIBILITIES.map((r) => ({ ...r })),
    projects: DEFAULT_PROJECTS.map((p) => ({ ...p, technologies: [...p.technologies] })),
    languages: ["English"],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "GraphQL"],
    strengths: ["Teamwork", "Mentorship Skills", "Critical Thinking", "Context Switching"],
    active,
    editing,
  };
}

function createBlankEmployee(
  id: number,
  active: boolean,
  editing: boolean
): Employee {
  return {
    id,
    name: "",
    role: "",
    showRole: true,
    summary: "",
    employmentHistory: [],
    education: [],
    responsibilities: [],
    projects: [],
    languages: [],
    technologies: [],
    strengths: [],
    active,
    editing,
  };
}

const INITIAL_EMPLOYEES: Employee[] = [
  createEmployee(1, "John Doe", true, false),
  createEmployee(2, "James Doe", false, false),
  createEmployee(3, "Jamie Doe", false, false),
];

function ZoomControls({ scale }: { scale: number }) {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const percentage = Math.round(scale * 100);

  return (
    <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background border border-border rounded-lg shadow-sm px-1 py-1">
      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={() => zoomOut(0.25)}
      >
        <Minus className="size-3.5" />
      </Button>
      <span className="text-xs font-medium tabular-nums w-10 text-center select-none">
        {percentage}%
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={() => zoomIn(0.25)}
      >
        <Plus className="size-3.5" />
      </Button>
      <div className="w-px h-4 bg-border mx-0.5" />
      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={() => resetTransform()}
      >
        <Maximize className="size-3.5" />
      </Button>
    </div>
  );
}

export function CVApp() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [zoomScale, setZoomScale] = useState(0.75);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchContentRef>(null);

  const activeEmployee = employees.find((e) => e.active) ?? employees[0];

  // Reset to page 1 when switching employees
  useEffect(() => {
    setCurrentPage(1);
  }, [activeEmployee.id]);

  // Clamp current page if total pages shrinks (e.g. content removed)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleTotalPagesChange = useCallback((total: number) => {
    setTotalPages(total);
  }, []);

  /** Jump to a specific page at 100% zoom */
  const jumpToPage = useCallback((page: number) => {
    setCurrentPage(page);
    // zoomToElement accepts a CSS selector string
    requestAnimationFrame(() => {
      transformRef.current?.zoomToElement(
        `[data-page-index="${page - 1}"]`,
        1,
        300,
        "easeOut"
      );
    });
  }, []);

  function addEmployee() {
    const newId = Math.max(...employees.map((e) => e.id)) + 1;
    setEmployees((prev) => [
      createBlankEmployee(newId, true, true),
      ...prev.map((e) => ({ ...e, active: false })),
    ]);
  }

  function updateEmployee(id: number, fields: Partial<Employee>) {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...fields } : e))
    );
  }

  function removeEmployee(id: number) {
    setEmployees((prev) => {
      const next = prev.filter((e) => e.id !== id);
      // If we removed the active one, activate the first remaining
      const removedWasActive = prev.find((e) => e.id === id)?.active;
      if (removedWasActive && next.length > 0) {
        next[0] = { ...next[0], active: true };
      }
      return next;
    });
  }

  function updateName(id: number, name: string) {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, name } : e))
    );
  }

  function commitEdit(id: number) {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, editing: false } : e))
    );
  }

  function selectEmployee(id: number) {
    setEmployees((prev) =>
      prev.map((e) => ({ ...e, active: e.id === id }))
    );
  }

  async function handleExportPDF() {
    setIsExporting(true);
    try {
      const data = btoa(JSON.stringify(activeEmployee));
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeName = activeEmployee.name
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "");
      a.href = url;
      a.download = `${safeName || "CV"}_CV.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <SidebarProvider
      className="h-screen"
      style={{ "--sidebar-width": "260px" } as React.CSSProperties}
    >
      <AppSidebar
        employees={employees}
        onAdd={addEmployee}
        onNameChange={updateName}
        onCommitEdit={commitEdit}
        onSelect={selectEmployee}
        onRemove={removeEmployee}
      />

      <SidebarInset className="flex flex-row overflow-hidden h-screen">
        {/* Center area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-background shrink-0">
            <SidebarTrigger />
            <Button
              size="sm"
              className="gap-2 text-xs h-8"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              <Share className="size-4" />
              {isExporting ? "Exporting…" : "Export PDF"}
            </Button>
          </header>

          <main className="flex-1 bg-muted/50 relative overflow-hidden">
            <TransformWrapper
              ref={transformRef}
              initialScale={0.75}
              minScale={0.25}
              maxScale={3}
              centerOnInit
              wheel={{ step: 0.05 }}
              panning={{ velocityDisabled: true }}
              onTransformed={(_ref, state) => setZoomScale(state.scale)}
            >
              <TransformComponent
                wrapperStyle={{
                  width: "100%",
                  height: "100%",
                }}
                contentStyle={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="p-20">
                  <CVPreview
                    employee={activeEmployee}
                    onTotalPagesChange={handleTotalPagesChange}
                  />
                </div>
              </TransformComponent>

              <ZoomControls scale={zoomScale} />
            </TransformWrapper>

            {/* Pagination — jump to page at 100% zoom */}
            {totalPages > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full size-8"
                  disabled={currentPage <= 1}
                  onClick={() => jumpToPage(Math.max(1, currentPage - 1))}
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <span className="text-sm font-medium text-foreground tabular-nums">
                  {currentPage}/{totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full size-8"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    jumpToPage(Math.min(totalPages, currentPage + 1))
                  }
                >
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            )}
          </main>
        </div>

        {/* Right editor panel */}
        <CVEditor
          employee={activeEmployee}
          onUpdate={(fields) => updateEmployee(activeEmployee.id, fields)}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
