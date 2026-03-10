"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronsUpDown,
  FileText,
  Plus,
  Settings,
  SquareTerminal,
  Trash2,
} from "lucide-react";
import type { Employee } from "@/components/cv-app";

type AppSidebarProps = {
  employees: Employee[];
  onAdd: () => void;
  onNameChange: (id: number, name: string) => void;
  onCommitEdit: (id: number) => void;
  onSelect: (id: number) => void;
  onRemove: (id: number) => void;
};

export function AppSidebar({
  employees,
  onAdd,
  onNameChange,
  onCommitEdit,
  onSelect,
  onRemove,
}: AppSidebarProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const pendingEmployee = employees.find((e) => e.id === pendingDeleteId);

  function handleConfirmDelete() {
    if (pendingDeleteId !== null) {
      onRemove(pendingDeleteId);
      setPendingDeleteId(null);
    }
  }

  return (
    <>
      <Sidebar collapsible="none" className="w-[260px] border-r">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
                  A
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Atlantbh</span>
                  <span className="truncate text-xs text-muted-foreground tracking-wide">
                    Enterprise
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 shrink-0" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between">
              <span>Employees</span>
              <button
                className="size-6 flex items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-foreground transition-colors"
                onClick={onAdd}
              >
                <Plus className="size-4" />
              </button>
            </SidebarGroupLabel>
            <SidebarMenu>
              {employees.map((employee) =>
                employee.editing ? (
                  <SidebarMenuItem key={employee.id}>
                    <div className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                      <FileText className="size-4 shrink-0" />
                      <input
                        autoFocus
                        value={employee.name}
                        onChange={(e) =>
                          onNameChange(employee.id, e.target.value)
                        }
                        onFocus={(e) => e.target.select()}
                        onBlur={() => onCommitEdit(employee.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onCommitEdit(employee.id);
                        }}
                        className="bg-transparent border-none outline-none p-0 text-sm font-medium w-full min-w-0"
                      />
                    </div>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={employee.id}>
                    <SidebarMenuButton
                      isActive={employee.active}
                      onClick={() => onSelect(employee.id)}
                    >
                      <FileText className="size-4 shrink-0" />
                      <span>{employee.name}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      showOnHover
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingDeleteId(employee.id);
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>App</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <SquareTerminal className="size-4 shrink-0" />
                  <span>Changelog</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="size-4 shrink-0" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <Avatar className="size-8 rounded-lg shrink-0">
                  <AvatarFallback className="rounded-lg bg-muted text-foreground text-sm font-medium">
                    EH
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Ermin Halilović
                  </span>
                  <span className="truncate text-xs text-muted-foreground tracking-wide">
                    ermin.halilovic@atlantbh.com
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 shrink-0" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <AlertDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
      >
        <AlertDialogContent onOverlayClick={() => setPendingDeleteId(null)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove {pendingEmployee?.name}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this CV. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              variant="destructive"
            >
              Remove {pendingEmployee?.name}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
