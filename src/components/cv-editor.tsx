"use client";

import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type {
  Employee,
  Education,
  EmploymentHistory,
  Responsibility,
  Project,
} from "@/components/cv-app";
import { SortableBlock } from "@/components/editor/sortable-block";
import { SortableList } from "@/components/editor/sortable-list";
import { DateRangeFields } from "@/components/editor/date-range-fields";
import { MultiSelect } from "@/components/editor/multi-select";
import { SummaryExpandDialog } from "@/components/editor/summary-expand-dialog";

type CVEditorProps = {
  employee: Employee;
  onUpdate: (fields: Partial<Employee>) => void;
};

const LANGUAGE_OPTIONS = [
  "English",
  "Bosnian",
  "German",
  "French",
  "Spanish",
  "Croatian",
  "Serbian",
  "Arabic",
  "Chinese",
  "Japanese",
];

const TECHNOLOGY_OPTIONS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "Tailwind CSS",
  "PostgreSQL",
  "Docker",
  "AWS",
  "GraphQL",
  "REST API",
  "Java",
  "C#",
  ".NET",
  "Angular",
  "Vue.js",
  "MongoDB",
  "Redis",
  "Kubernetes",
];

const STRENGTH_OPTIONS = [
  "Teamwork",
  "Mentorship Skills",
  "Critical Thinking",
  "Context Switching",
  "Problem Solving",
  "Communication",
  "Leadership",
  "Adaptability",
  "Time Management",
  "Creativity",
];

export function CVEditor({ employee, onUpdate }: CVEditorProps) {
  const [customTechnologies, setCustomTechnologies] = useState<string[]>([]);
  const [customStrengths, setCustomStrengths] = useState<string[]>([]);

  const allTechnologies = [
    ...new Set([...TECHNOLOGY_OPTIONS, ...customTechnologies]),
  ];
  const allStrengths = [...new Set([...STRENGTH_OPTIONS, ...customStrengths])];

  // --- Employment History helpers ---
  function addEmployment() {
    const newItem: EmploymentHistory = {
      id: `emp-${Date.now()}`,
      from: "",
      to: "",
      isPresent: false,
      role: "",
      company: "",
    };
    onUpdate({
      employmentHistory: [newItem, ...employee.employmentHistory],
    });
  }

  function updateEmployment(id: string, fields: Partial<EmploymentHistory>) {
    onUpdate({
      employmentHistory: employee.employmentHistory.map((e) =>
        e.id === id ? { ...e, ...fields } : e
      ),
    });
  }

  function removeEmployment(id: string) {
    onUpdate({
      employmentHistory: employee.employmentHistory.filter((e) => e.id !== id),
    });
  }

  // --- Education helpers ---
  function addEducation() {
    const newItem: Education = {
      id: `edu-${Date.now()}`,
      from: "",
      to: "",
      isPresent: false,
      degree: "",
      school: "",
    };
    onUpdate({ education: [newItem, ...employee.education] });
  }

  function updateEducation(id: string, fields: Partial<Education>) {
    onUpdate({
      education: employee.education.map((e) =>
        e.id === id ? { ...e, ...fields } : e
      ),
    });
  }

  function removeEducation(id: string) {
    onUpdate({ education: employee.education.filter((e) => e.id !== id) });
  }

  // --- Responsibility helpers ---
  function addResponsibility() {
    const newItem: Responsibility = {
      id: `resp-${Date.now()}`,
      title: "",
      description: "",
      technologies: [],
    };
    onUpdate({
      responsibilities: [newItem, ...employee.responsibilities],
    });
  }

  function updateResponsibility(
    id: string,
    fields: Partial<Responsibility>
  ) {
    onUpdate({
      responsibilities: employee.responsibilities.map((e) =>
        e.id === id ? { ...e, ...fields } : e
      ),
    });
  }

  function removeResponsibility(id: string) {
    onUpdate({
      responsibilities: employee.responsibilities.filter((e) => e.id !== id),
    });
  }

  // --- Project helpers ---
  function addProject() {
    const newItem: Project = {
      id: `proj-${Date.now()}`,
      title: "",
      description: "",
      technologies: [],
    };
    onUpdate({ projects: [newItem, ...employee.projects] });
  }

  function updateProject(id: string, fields: Partial<Project>) {
    onUpdate({
      projects: employee.projects.map((e) =>
        e.id === id ? { ...e, ...fields } : e
      ),
    });
  }

  function removeProject(id: string) {
    onUpdate({ projects: employee.projects.filter((e) => e.id !== id) });
  }

  return (
    <div className="w-[359px] shrink-0 border-l border-border bg-background flex flex-col h-full overflow-hidden">
      <Tabs defaultValue="general" className="flex flex-col h-full">
        <div className="border-b border-border px-4 py-2 shrink-0">
          <TabsList className="h-9">
            <TabsTrigger value="general" className="text-sm">
              General
            </TabsTrigger>
            <TabsTrigger value="education" className="text-sm">
              Education &amp; Work
            </TabsTrigger>
            <TabsTrigger value="skills" className="text-sm">
              Skills
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ===== Tab 1: General ===== */}
        <TabsContent
          value="general"
          className="flex-1 overflow-y-auto p-4 space-y-4 mt-0 data-[state=inactive]:hidden"
        >
          {/* Employee Name */}
          <div className="flex flex-col gap-3">
            <Label className="text-sm">Employee Name</Label>
            <Input
              value={employee.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Employee Name..."
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Role</Label>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">
                  Show on CV
                </Label>
                <Switch
                  checked={employee.showRole}
                  onCheckedChange={(v) => onUpdate({ showRole: v })}
                />
              </div>
            </div>
            <Input
              value={employee.role}
              onChange={(e) => onUpdate({ role: e.target.value })}
              placeholder="Employee Role..."
            />
          </div>

          {/* Summary with expand */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Summary</Label>
              <SummaryExpandDialog
                value={employee.summary}
                onSave={(val) => onUpdate({ summary: val })}
              />
            </div>
            <Textarea
              value={employee.summary}
              onChange={(e) => onUpdate({ summary: e.target.value })}
              placeholder="Insert a summary..."
              className="min-h-[120px] resize-y"
            />
          </div>

          {/* Employment History */}
          <div className="space-y-3">
            <button
              type="button"
              className="group/add flex items-center justify-between w-full cursor-pointer"
              onClick={addEmployment}
            >
              <span className="text-sm font-medium">Employment History</span>
              <span className="size-6 flex items-center justify-center rounded-md group-hover/add:bg-accent group-hover/add:text-foreground transition-colors">
                <Plus className="size-4" />
              </span>
            </button>
            <SortableList
              items={employee.employmentHistory}
              onReorder={(items) => onUpdate({ employmentHistory: items })}
            >
              {employee.employmentHistory.map((item) => (
                <SortableBlock
                  key={item.id}
                  id={item.id}
                  onRemove={() => removeEmployment(item.id)}
                >
                  <DateRangeFields
                    from={item.from}
                    to={item.to}
                    isPresent={item.isPresent}
                    onFromChange={(v) =>
                      updateEmployment(item.id, { from: v })
                    }
                    onToChange={(v) =>
                      updateEmployment(item.id, { to: v })
                    }
                    onPresentChange={(v) =>
                      updateEmployment(item.id, {
                        isPresent: v,
                        to: v ? "" : item.to,
                      })
                    }
                  />
                  <div className="space-y-1">
                    <Label className="text-xs">Role</Label>
                    <Input
                      value={item.role}
                      onChange={(e) =>
                        updateEmployment(item.id, {
                          role: e.target.value,
                        })
                      }
                      placeholder="Role"
                      className="text-sm h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Company</Label>
                    <Input
                      value={item.company}
                      onChange={(e) =>
                        updateEmployment(item.id, {
                          company: e.target.value,
                        })
                      }
                      placeholder="Company"
                      className="text-sm h-9"
                    />
                  </div>
                </SortableBlock>
              ))}
            </SortableList>
          </div>
        </TabsContent>

        {/* ===== Tab 2: Education & Work ===== */}
        <TabsContent
          value="education"
          className="flex-1 overflow-y-auto p-4 space-y-6 mt-0 data-[state=inactive]:hidden"
        >
          {/* Education */}
          <div className="space-y-3">
            <button
              type="button"
              className="group/add flex items-center justify-between w-full cursor-pointer"
              onClick={addEducation}
            >
              <span className="text-sm font-medium">Education</span>
              <span className="size-6 flex items-center justify-center rounded-md group-hover/add:bg-accent group-hover/add:text-foreground transition-colors">
                <Plus className="size-4" />
              </span>
            </button>
            <SortableList
              items={employee.education}
              onReorder={(items) => onUpdate({ education: items })}
            >
              {employee.education.map((item) => (
                <SortableBlock
                  key={item.id}
                  id={item.id}
                  onRemove={() => removeEducation(item.id)}
                >
                  <DateRangeFields
                    from={item.from}
                    to={item.to}
                    isPresent={item.isPresent}
                    onFromChange={(v) =>
                      updateEducation(item.id, { from: v })
                    }
                    onToChange={(v) =>
                      updateEducation(item.id, { to: v })
                    }
                    onPresentChange={(v) =>
                      updateEducation(item.id, {
                        isPresent: v,
                        to: v ? "" : item.to,
                      })
                    }
                  />
                  <div className="space-y-1">
                    <Label className="text-xs">Degree</Label>
                    <Input
                      value={item.degree}
                      onChange={(e) =>
                        updateEducation(item.id, {
                          degree: e.target.value,
                        })
                      }
                      placeholder="Degree"
                      className="text-sm h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">School</Label>
                    <Input
                      value={item.school}
                      onChange={(e) =>
                        updateEducation(item.id, {
                          school: e.target.value,
                        })
                      }
                      placeholder="School"
                      className="text-sm h-9"
                    />
                  </div>
                </SortableBlock>
              ))}
            </SortableList>
          </div>

          {/* Current Responsibilities */}
          <div className="space-y-3">
            <button
              type="button"
              className="group/add flex items-center justify-between w-full cursor-pointer"
              onClick={addResponsibility}
            >
              <span className="text-sm font-medium">Current Responsibilities</span>
              <span className="size-6 flex items-center justify-center rounded-md group-hover/add:bg-accent group-hover/add:text-foreground transition-colors">
                <Plus className="size-4" />
              </span>
            </button>
            <SortableList
              items={employee.responsibilities}
              onReorder={(items) => onUpdate({ responsibilities: items })}
            >
              {employee.responsibilities.map((item) => (
                <SortableBlock
                  key={item.id}
                  id={item.id}
                  onRemove={() => removeResponsibility(item.id)}
                >
                  <div className="space-y-1">
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        updateResponsibility(item.id, {
                          title: e.target.value,
                        })
                      }
                      placeholder="Title"
                      className="text-sm h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        updateResponsibility(item.id, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Description"
                      className="text-sm min-h-[60px] resize-y"
                    />
                  </div>
                </SortableBlock>
              ))}
            </SortableList>
          </div>

          {/* Projects Implemented */}
          <div className="space-y-3">
            <button
              type="button"
              className="group/add flex items-center justify-between w-full cursor-pointer"
              onClick={addProject}
            >
              <span className="text-sm font-medium">Projects Implemented</span>
              <span className="size-6 flex items-center justify-center rounded-md group-hover/add:bg-accent group-hover/add:text-foreground transition-colors">
                <Plus className="size-4" />
              </span>
            </button>
            <SortableList
              items={employee.projects}
              onReorder={(items) => onUpdate({ projects: items })}
            >
              {employee.projects.map((item) => (
                <SortableBlock
                  key={item.id}
                  id={item.id}
                  onRemove={() => removeProject(item.id)}
                >
                  <div className="space-y-1">
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        updateProject(item.id, {
                          title: e.target.value,
                        })
                      }
                      placeholder="Title"
                      className="text-sm h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        updateProject(item.id, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Description"
                      className="text-sm min-h-[60px] resize-y"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Technologies</Label>
                    <MultiSelect
                      selected={item.technologies}
                      options={allTechnologies}
                      onChange={(techs) =>
                        updateProject(item.id, {
                          technologies: techs,
                        })
                      }
                      creatable
                      onCreateOption={(val) =>
                        setCustomTechnologies((prev) => [...prev, val])
                      }
                      placeholder="Select technologies..."
                    />
                  </div>
                </SortableBlock>
              ))}
            </SortableList>
          </div>
        </TabsContent>

        {/* ===== Tab 3: Skills ===== */}
        <TabsContent
          value="skills"
          className="flex-1 overflow-y-auto p-4 space-y-4 mt-0 data-[state=inactive]:hidden"
        >
          {/* Languages */}
          <div className="space-y-3">
            <Label className="text-sm">Languages</Label>
            <MultiSelect
              selected={employee.languages}
              options={LANGUAGE_OPTIONS}
              onChange={(langs) => onUpdate({ languages: langs })}
              placeholder="Select languages..."
            />
          </div>

          {/* Technologies */}
          <div className="space-y-3">
            <Label className="text-sm">Technologies</Label>
            <MultiSelect
              selected={employee.technologies}
              options={allTechnologies}
              onChange={(techs) => onUpdate({ technologies: techs })}
              creatable
              onCreateOption={(val) =>
                setCustomTechnologies((prev) => [...prev, val])
              }
              placeholder="Select technologies..."
            />
          </div>

          {/* Strengths */}
          <div className="space-y-3">
            <Label className="text-sm">Strengths</Label>
            <MultiSelect
              selected={employee.strengths}
              options={allStrengths}
              onChange={(s) => onUpdate({ strengths: s })}
              creatable
              onCreateOption={(val) =>
                setCustomStrengths((prev) => [...prev, val])
              }
              placeholder="Select strengths..."
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
