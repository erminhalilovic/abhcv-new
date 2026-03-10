"use client";

import { useState, useEffect, useRef } from "react";
import type { Employee } from "@/components/cv-app";

// ─── Layout constants (px) ─────────────────────────────────────────────────

/**
 * Maximum height of the left content column on every page.
 * ⚠️  Must stay in sync with `max-h-[706px]` on the left content div in PageShell
 *     (cv-preview.tsx). This is the only layout constant that needs to be kept
 *     in sync manually; all other heights are derived from DOM measurements.
 */
const LEFT_COL_MAX_H = 706;

/** Vertical gap between consecutive sections (Tailwind gap-10). */
const SECTION_GAP = 40;

/** Vertical gap between items inside a section (Tailwind gap-4). */
const ITEM_GAP = 16;

/** Gap between a section header and the first item (Tailwind gap-2.5). */
const HEADER_ITEM_GAP = 10;

// ─── Public types ──────────────────────────────────────────────────────────

export type RightColumnSections = {
  education: boolean;
  languages: boolean;
  strengths: boolean;
  technologies: boolean;
};

export type PageSectionBlock = {
  type: "section" | "section-continuation";
  sectionId: string;
  title: string;
  /** Indices into the original array for this section in the Employee object. */
  itemIndices: number[];
};

export type PageContent = {
  pageIndex: number;
  showHeader: boolean;
  sections: PageSectionBlock[];
  rightColumnSections: RightColumnSections;
};

// ─── Internal types ────────────────────────────────────────────────────────

type SectionDef = {
  id: string;
  title: string;
  itemCount: number;
  headerMeasureId: string;
  itemMeasureIds: string[];
};

// ─── Section builder ───────────────────────────────────────────────────────

function buildSections(employee: Employee): SectionDef[] {
  const sections: SectionDef[] = [];

  if (employee.summary) {
    sections.push({
      id: "summary",
      title: "Summary",
      itemCount: 1,
      headerMeasureId: "header-summary",
      itemMeasureIds: ["item-summary"],
    });
  }

  if (employee.employmentHistory.length > 0) {
    sections.push({
      id: "employment",
      title: "Employment Experience",
      itemCount: employee.employmentHistory.length,
      headerMeasureId: "header-employment",
      itemMeasureIds: employee.employmentHistory.map(
        (e) => `item-emp-${e.id}`
      ),
    });
  }

  if (employee.responsibilities.length > 0) {
    sections.push({
      id: "responsibilities",
      title: "Current Responsibilities",
      itemCount: employee.responsibilities.length,
      headerMeasureId: "header-responsibilities",
      itemMeasureIds: employee.responsibilities.map(
        (r) => `item-resp-${r.id}`
      ),
    });
  }

  if (employee.projects.length > 0) {
    sections.push({
      id: "projects",
      title: "Projects Implemented",
      itemCount: employee.projects.length,
      headerMeasureId: "header-projects",
      itemMeasureIds: employee.projects.map((p) => `item-proj-${p.id}`),
    });
  }

  return sections;
}

// ─── Measurement collector ─────────────────────────────────────────────────

function collectMeasurements(container: HTMLElement): Map<string, number> {
  const m = new Map<string, number>();
  // Compensate for CSS transforms (e.g. react-zoom-pan-pinch) that scale
  // getBoundingClientRect values. offsetWidth gives unscaled CSS pixels.
  const scale =
    container.getBoundingClientRect().width / container.offsetWidth || 1;
  container
    .querySelectorAll<HTMLElement>("[data-measure-id]")
    .forEach((el) => {
      m.set(el.dataset.measureId!, el.getBoundingClientRect().height / scale);
    });
  return m;
}

// ─── Right-column assignment ───────────────────────────────────────────────

const EMPTY_RIGHT: RightColumnSections = {
  education: false,
  languages: false,
  strengths: false,
  technologies: false,
};

function assignRightColumns(pages: PageContent[]): void {
  const n = pages.length;
  for (const p of pages) {
    if (p.pageIndex === 0) {
      // Page 1 always gets Education + Languages
      p.rightColumnSections = {
        ...EMPTY_RIGHT,
        education: true,
        languages: true,
      };
    } else if (n === 2) {
      // 2-page CV: page 2 gets Strengths + Technologies
      p.rightColumnSections = {
        ...EMPTY_RIGHT,
        strengths: true,
        technologies: true,
      };
    } else if (n >= 3 && p.pageIndex === 1) {
      // 3+ pages: page 2 gets Strengths only
      p.rightColumnSections = { ...EMPTY_RIGHT, strengths: true };
    } else if (n >= 3 && p.pageIndex === 2) {
      // 3+ pages: page 3 gets Technologies only
      p.rightColumnSections = { ...EMPTY_RIGHT, technologies: true };
    } else {
      // Pages 4+: logo only
      p.rightColumnSections = { ...EMPTY_RIGHT };
    }
  }
}

// ─── Pagination algorithm ──────────────────────────────────────────────────

function paginateContent(
  sections: SectionDef[],
  measurements: Map<string, number>
): PageContent[] {
  // Derive available heights from measurements so the algorithm self-corrects
  // whenever CSS changes — no more hardcoded per-page heights.
  //
  // "page1-header" is measured in MeasuringContainer with overflow:hidden so
  // getBoundingClientRect().height captures the inner height AND mb-[45px].
  // Fallback (90) is inner(~45) + mb(45) at typical browser defaults.
  const headerSpace = measurements.get("page1-header") ?? 90;
  const page1Available = LEFT_COL_MAX_H - headerSpace;
  const page2PlusAvailable = LEFT_COL_MAX_H;

  const pages: PageContent[] = [
    {
      pageIndex: 0,
      showHeader: true,
      sections: [],
      rightColumnSections: { ...EMPTY_RIGHT },
    },
  ];

  let pageIdx = 0;
  let remaining = page1Available;
  let hasContent = false;

  function newPage() {
    pageIdx++;
    pages.push({
      pageIndex: pageIdx,
      showHeader: false,
      sections: [],
      rightColumnSections: { ...EMPTY_RIGHT },
    });
    remaining = page2PlusAvailable;
    hasContent = false;
  }

  for (const section of sections) {
    if (section.itemCount === 0) continue;

    const headerH = measurements.get(section.headerMeasureId) ?? 0;
    const firstItemH = measurements.get(section.itemMeasureIds[0]) ?? 0;
    const gap = hasContent ? SECTION_GAP : 0;

    // Orphan prevention: header + first item must fit together.
    // Only push to next page if there is already content on this page;
    // the first section on any page is always placed (PageShell clips if needed).
    if (hasContent && remaining < gap + headerH + HEADER_ITEM_GAP + firstItemH) {
      newPage();
    }

    // Consume section header
    const actualGap = hasContent ? SECTION_GAP : 0;
    remaining -= actualGap + headerH + HEADER_ITEM_GAP;
    hasContent = true;

    let block: PageSectionBlock = {
      type: "section",
      sectionId: section.id,
      title: section.title,
      itemIndices: [],
    };
    pages[pageIdx].sections.push(block);

    // Place items one by one
    for (let i = 0; i < section.itemCount; i++) {
      const itemH = measurements.get(section.itemMeasureIds[i]) ?? 0;
      const itemGap = block.itemIndices.length > 0 ? ITEM_GAP : 0;

      if (remaining < itemGap + itemH) {
        // Split: continue this section on a new page
        newPage();
        hasContent = true;

        block = {
          type: "section-continuation",
          sectionId: section.id,
          title: section.title,
          itemIndices: [],
        };
        pages[pageIdx].sections.push(block);

        // First item on the new page — no preceding gap
        remaining -= itemH;
      } else {
        remaining -= itemGap + itemH;
      }

      block.itemIndices.push(i);
    }
  }

  assignRightColumns(pages);
  return pages;
}

// ─── Default page (shown before first measurement completes) ───────────────

const DEFAULT_PAGES: PageContent[] = [
  {
    pageIndex: 0,
    showHeader: true,
    sections: [],
    rightColumnSections: {
      education: true,
      languages: true,
      strengths: false,
      technologies: false,
    },
  },
];

// ─── Hook ──────────────────────────────────────────────────────────────────

/**
 * Measures CV content in a hidden container and returns a paginated layout.
 *
 * Returns `measureCallbackRef` — pass it as `ref={measureCallbackRef}` on the
 * hidden measuring container div. React calls it when the element mounts,
 * which reliably triggers measurement.
 */
export function useCVPagination(employee: Employee) {
  // Using state (not useRef) for the measure element so that when the hidden
  // container mounts and sets the element, a re-render fires the useEffect.
  const [measureEl, setMeasureEl] = useState<HTMLDivElement | null>(null);
  const [pages, setPages] = useState<PageContent[]>(DEFAULT_PAGES);

  // Keep a stable ref so the effect always reads the latest employee data
  // without needing to list complex objects in the dependency array.
  const employeeRef = useRef(employee);
  employeeRef.current = employee;

  // Run pagination whenever the measure element becomes available OR
  // whenever the employee data that affects layout changes.
  useEffect(() => {
    if (!measureEl) return;

    const measurements = collectMeasurements(measureEl);
    if (measurements.size === 0) return;

    const sections = buildSections(employeeRef.current);
    const result = paginateContent(sections, measurements);
    setPages(result);
  }, [
    measureEl,
    employee.summary,
    employee.employmentHistory,
    employee.responsibilities,
    employee.projects,
  ]);

  return { pages, measureCallbackRef: setMeasureEl };
}
