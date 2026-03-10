"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type MultiSelectProps = {
  selected: string[];
  options: string[];
  onChange: (selected: string[]) => void;
  onCreateOption?: (value: string) => void;
  creatable?: boolean;
  placeholder?: string;
};

export function MultiSelect({
  selected,
  options,
  onChange,
  onCreateOption,
  creatable = false,
  placeholder = "Select...",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const availableOptions = options.filter((opt) => !selected.includes(opt));

  function handleSelect(value: string) {
    onChange([...selected, value]);
    setInputValue("");
  }

  function handleRemove(value: string) {
    onChange(selected.filter((s) => s !== value));
  }

  function handleCreate() {
    const trimmed = inputValue.trim();
    if (trimmed && !options.includes(trimmed) && !selected.includes(trimmed)) {
      onCreateOption?.(trimmed);
      onChange([...selected, trimmed]);
      setInputValue("");
    }
  }

  return (
    <div className="space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-sm h-9 font-normal"
          >
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <span className="truncate">
                {selected.length} selected
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Search..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>
                {creatable && inputValue.trim() ? (
                  <button
                    onClick={handleCreate}
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                  >
                    Create &ldquo;{inputValue.trim()}&rdquo;
                  </button>
                ) : (
                  <span>No results found.</span>
                )}
              </CommandEmpty>
              <CommandGroup>
                {availableOptions
                  .filter((opt) =>
                    opt.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((opt) => (
                    <CommandItem
                      key={opt}
                      value={opt}
                      onSelect={() => handleSelect(opt)}
                    >
                      {opt}
                    </CommandItem>
                  ))}
                {creatable &&
                  inputValue.trim() &&
                  !options.includes(inputValue.trim()) &&
                  !selected.includes(inputValue.trim()) && (
                    <CommandItem
                      value={`create-${inputValue.trim()}`}
                      onSelect={handleCreate}
                    >
                      Create &ldquo;{inputValue.trim()}&rdquo;
                    </CommandItem>
                  )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className="gap-1 text-xs"
            >
              {item}
              <button
                onClick={() => handleRemove(item)}
                className="hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
