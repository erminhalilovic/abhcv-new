// Note: This component uses 'TT Commons' font. Install the font and add it to globals.css
// for the exact design match. Falls back to sans-serif until then.

"use client";

import { useEffect, useRef } from "react";
import type { Employee } from "@/components/cv-app";
import {
  useCVPagination,
  type PageSectionBlock,
  type RightColumnSections,
} from "@/hooks/use-cv-pagination";

// ─── Item components ───────────────────────────────────────────────────────

function EmploymentItem({ date, role }: { date: string; role: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[#3f4a5a] text-[12px] leading-[1.1]">{date}</p>
      <p
        className="text-[14px] leading-[1.1] font-medium bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(to right, #001d2a 0.368%, #3f4a5a 100.37%)",
        }}
      >
        {role}
      </p>
    </div>
  );
}

function EducationItem({
  date,
  degree,
  university,
}: {
  date: string;
  degree: string;
  university: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[#e8ebf3] text-[12px] leading-[1.1]">{date}</p>
      <p
        className="text-[14px] leading-[1.1] font-medium bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(192.91deg, #ffffff 0%, #e8ebf3 100%)",
        }}
      >
        {degree}
      </p>
      <p className="text-[#e8ebf3] text-[12px] leading-[1.1]">{university}</p>
    </div>
  );
}

function ResponsibilityItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p
        className="text-[14px] leading-[1.1] font-medium bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(to right, #001d2a 0.368%, #3f4a5a 100.37%)",
        }}
      >
        {title}
      </p>
      {description && (
        <p className="text-[#3f4a5a] text-[12px] leading-[1.3]">
          {description}
        </p>
      )}
    </div>
  );
}

function ProjectItem({
  title,
  description,
  technologies,
}: {
  title: string;
  description: string;
  technologies: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <p
        className="text-[14px] leading-[1.1] font-medium bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(to right, #001d2a 0.368%, #3f4a5a 100.37%)",
        }}
      >
        {title}
      </p>
      {description && (
        <p className="text-[#3f4a5a] text-[12px] leading-[1.3]">
          {description}
        </p>
      )}
      {technologies.length > 0 && (
        <p className="text-[#3f4a5a] text-[12px] leading-[1.3]">
          <span className="font-semibold text-[#001d2a]">Technology stack:</span>{" "}
          {technologies.join(", ")}
        </p>
      )}
    </div>
  );
}

function CVSectionHeader({
  title,
  dark = false,
}: {
  title: string;
  dark?: boolean;
}) {
  return (
    <div className="pb-1.5 mb-1.5">
      <p
        className="text-[16px] leading-[1.1] font-medium uppercase bg-clip-text text-transparent mb-1.5"
        style={{
          backgroundImage: dark
            ? "linear-gradient(213.59deg, #ffffff 0%, #e8ebf3 100%)"
            : "linear-gradient(to right, #001d2a 0.368%, #3f4a5a 100.37%)",
        }}
      >
        {title}
      </p>
      <div
        className="h-px"
        style={{
          backgroundImage: dark
            ? "linear-gradient(90deg, rgba(255,255,255,0) 0%, #FFF 30%, rgba(255,255,255,0) 100%)"
            : "linear-gradient(90deg, rgba(172, 182, 200, 0.00) 0%, #ACB6C8 28.37%, rgba(172, 182, 200, 0.00) 100%)",
        }}
      />
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatEmploymentDate(item: {
  from: string;
  to: string;
  isPresent: boolean;
}) {
  if (!item.from && !item.to && !item.isPresent) return "";
  const to = item.isPresent ? "Present" : item.to;
  return `${item.from}${item.from && to ? " - " : ""}${to}`;
}

function formatEmploymentRole(item: { role: string; company: string }) {
  return `${item.role}${item.role && item.company ? ", " : ""}${item.company}`;
}

// ─── Section items renderer ────────────────────────────────────────────────

function SectionItems({
  block,
  employee,
}: {
  block: PageSectionBlock;
  employee: Employee;
}) {
  switch (block.sectionId) {
    case "summary":
      return (
        <div className="text-[#3f4a5a] text-[12px] leading-[1.3] whitespace-pre-wrap">
          {employee.summary}
        </div>
      );
    case "employment":
      return (
        <>
          {block.itemIndices.map((idx) => {
            const item = employee.employmentHistory[idx];
            if (!item) return null;
            return (
              <EmploymentItem
                key={item.id}
                date={formatEmploymentDate(item)}
                role={formatEmploymentRole(item)}
              />
            );
          })}
        </>
      );
    case "responsibilities":
      return (
        <>
          {block.itemIndices.map((idx) => {
            const item = employee.responsibilities[idx];
            if (!item) return null;
            return (
              <ResponsibilityItem
                key={item.id}
                title={item.title}
                description={item.description}
              />
            );
          })}
        </>
      );
    case "projects":
      return (
        <>
          {block.itemIndices.map((idx) => {
            const item = employee.projects[idx];
            if (!item) return null;
            return (
              <ProjectItem
                key={item.id}
                title={item.title}
                description={item.description}
                technologies={item.technologies}
              />
            );
          })}
        </>
      );
    default:
      return null;
  }
}

// ─── Page shell ────────────────────────────────────────────────────────────

function PageShell({
  pageIndex,
  rightColumnSections,
  employee,
  children,
}: {
  pageIndex: number;
  rightColumnSections: RightColumnSections;
  employee: Employee;
  children: React.ReactNode;
}) {
  const hasRightContent =
    rightColumnSections.education ||
    rightColumnSections.languages ||
    rightColumnSections.strengths ||
    rightColumnSections.technologies;

  return (
    <div
      data-page-index={pageIndex}
      className="bg-white w-[595px] h-[842px] overflow-hidden relative shadow-lg shrink-0"
    >
      {/* Right blue gradient column */}
      <div
        className="absolute right-0 top-0 w-[200px] h-full overflow-hidden"
        style={{
          backgroundImage: "url(/cv-bg-right.png)",
          backgroundSize: "cover",
        }}
      >
        {/* ABH Logo — always shown */}
        <div className="absolute left-7 top-[43px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/abh-logo.svg" alt="Atlantbh" className="h-6" />
        </div>

        {/* Right column sections */}
        {hasRightContent && (
          <div className="absolute left-7 top-[105px] w-36 flex flex-col gap-10">
            {rightColumnSections.education &&
              employee.education.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <CVSectionHeader title="Education" dark />
                  {employee.education.map((edu) => (
                    <EducationItem
                      key={edu.id}
                      date={`${edu.from}${edu.from && edu.to ? " - " : ""}${edu.to}`}
                      degree={edu.degree}
                      university={edu.school}
                    />
                  ))}
                </div>
              )}

            {rightColumnSections.languages &&
              employee.languages.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <CVSectionHeader title="Languages" dark />
                  <div className="flex flex-col gap-1 text-[#e8ebf3] text-[12px] leading-[1.3]">
                    {employee.languages.map((lang) => (
                      <p key={lang}>{lang}</p>
                    ))}
                  </div>
                </div>
              )}

            {rightColumnSections.strengths &&
              employee.strengths.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <CVSectionHeader title="Strengths" dark />
                  <div className="flex flex-col gap-1 text-[#e8ebf3] text-[12px] leading-[1.3]">
                    {employee.strengths.map((s) => (
                      <p key={s}>{s}</p>
                    ))}
                  </div>
                </div>
              )}

            {rightColumnSections.technologies &&
              employee.technologies.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <CVSectionHeader title="Technologies" dark />
                  <div className="flex flex-col gap-1 text-[#e8ebf3] text-[12px] leading-[1.3]">
                    {employee.technologies.map((tech) => (
                      <p key={tech}>{tech}</p>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Left content column — clamped so content never reaches the footer */}
      <div className="absolute left-10 top-10 w-[327px] max-h-[706px] overflow-hidden">
        {children}
      </div>

      {/* Footer */}
      <div className="absolute left-10 bottom-[44px] w-[327px] border-t border-[rgba(172,182,200,0.3)] pt-2.5">
        <p className="text-[#222831] text-[12px] leading-none italic">
          Classification level: Confidential
        </p>
      </div>
    </div>
  );
}

// ─── Hidden measuring container ────────────────────────────────────────────

function MeasuringContainer({
  measureRef,
  employee,
}: {
  measureRef: (el: HTMLDivElement | null) => void;
  employee: Employee;
}) {
  return (
    <div
      ref={measureRef}
      aria-hidden
      className="absolute w-[327px]"
      style={{ left: -9999, top: 0, visibility: "hidden" }}
    >
      {/*
        Page-1 header sentinel — overflow:hidden forces getBoundingClientRect to
        include the child's mb-[48px] in the reported height, giving the hook the
        exact space the header consumes so it can derive page1Available dynamically.
      */}
      <div data-measure-id="page1-header" style={{ overflow: "hidden" }}>
        <div className="flex flex-col gap-2 mb-[28px]">
          <h1 className="text-[24px] font-bold text-[#222831] leading-6">A</h1>
          <p className="text-[12px] text-[#222831] leading-[1.1]">A</p>
        </div>
      </div>

      {/* Summary */}
      {employee.summary && (
        <>
          <div data-measure-id="header-summary" style={{ overflow: "hidden" }}>
            <CVSectionHeader title="Summary" />
          </div>
          <div data-measure-id="item-summary">
            <div className="text-[#3f4a5a] text-[12px] leading-[1.3] whitespace-pre-wrap">
              {employee.summary}
            </div>
          </div>
        </>
      )}

      {/* Employment Experience */}
      {employee.employmentHistory.length > 0 && (
        <>
          <div data-measure-id="header-employment" style={{ overflow: "hidden" }}>
            <CVSectionHeader title="Employment Experience" />
          </div>
          {employee.employmentHistory.map((item) => (
            <div key={item.id} data-measure-id={`item-emp-${item.id}`}>
              <EmploymentItem
                date={formatEmploymentDate(item)}
                role={formatEmploymentRole(item)}
              />
            </div>
          ))}
        </>
      )}

      {/* Current Responsibilities */}
      {employee.responsibilities.length > 0 && (
        <>
          <div data-measure-id="header-responsibilities" style={{ overflow: "hidden" }}>
            <CVSectionHeader title="Current Responsibilities" />
          </div>
          {employee.responsibilities.map((item) => (
            <div key={item.id} data-measure-id={`item-resp-${item.id}`}>
              <ResponsibilityItem
                title={item.title}
                description={item.description}
              />
            </div>
          ))}
        </>
      )}

      {/* Projects Implemented */}
      {employee.projects.length > 0 && (
        <>
          <div data-measure-id="header-projects" style={{ overflow: "hidden" }}>
            <CVSectionHeader title="Projects Implemented" />
          </div>
          {employee.projects.map((item) => (
            <div key={item.id} data-measure-id={`item-proj-${item.id}`}>
              <ProjectItem
                title={item.title}
                description={item.description}
                technologies={item.technologies}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ─── CV Preview (main export) ──────────────────────────────────────────────

export function CVPreview({
  employee,
  onTotalPagesChange,
  column = false,
}: {
  employee: Employee;
  onTotalPagesChange?: (total: number) => void;
  /** Stack pages vertically (for PDF export). Default: false (row layout). */
  column?: boolean;
}) {
  const { pages, measureCallbackRef } = useCVPagination(employee);

  // Stable callback ref to avoid stale closures
  const onTotalPagesChangeRef = useRef(onTotalPagesChange);
  onTotalPagesChangeRef.current = onTotalPagesChange;

  useEffect(() => {
    onTotalPagesChangeRef.current?.(pages.length);
  }, [pages.length]);

  return (
    <div
      className={`relative flex items-start ${
        column ? "flex-col gap-0" : "flex-row gap-10"
      }`}
    >
      {/* Hidden measuring container */}
      <MeasuringContainer measureRef={measureCallbackRef} employee={employee} />

      {/* Rendered pages */}
      {pages.map((page) => (
        <PageShell
          key={page.pageIndex}
          pageIndex={page.pageIndex}
          rightColumnSections={page.rightColumnSections}
          employee={employee}
        >
          {/* Header — only on page 1 */}
          {page.showHeader && (
            <div className="flex flex-col gap-2 mb-[28px]">
              <h1 className="text-[24px] font-bold text-[#222831] leading-6">
                {employee.name}
              </h1>
              {employee.showRole && (
                <p className="text-[12px] text-[#222831] leading-[1.1]">
                  Position: {employee.role}
                </p>
              )}
            </div>
          )}

          {/* Section blocks */}
          <div className="flex flex-col gap-10">
            {page.sections.map((block, i) => (
              <div
                key={`${block.sectionId}-${block.type}-${i}`}
                className="flex flex-col gap-2.5"
              >
                {block.type === "section" && (
                  <CVSectionHeader title={block.title} />
                )}
                <div
                  className={
                    block.sectionId === "summary" ? "" : "flex flex-col gap-4"
                  }
                >
                  <SectionItems block={block} employee={employee} />
                </div>
              </div>
            ))}
          </div>
        </PageShell>
      ))}
    </div>
  );
}
