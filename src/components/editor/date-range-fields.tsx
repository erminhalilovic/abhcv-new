"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type DateRangeFieldsProps = {
  from: string;
  to: string;
  isPresent: boolean;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onPresentChange: (checked: boolean) => void;
};

export function DateRangeFields({
  from,
  to,
  isPresent,
  onFromChange,
  onToChange,
  onPresentChange,
}: DateRangeFieldsProps) {
  return (
    <div className="flex gap-1">
      <div className="flex-1 space-y-1">
        <Label className="text-xs">From</Label>
        <Input
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          placeholder="2016"
          className="text-sm h-9"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <Label className="text-xs">To</Label>
          <label className="flex items-center gap-1 cursor-pointer">
            <Checkbox
              checked={isPresent}
              onCheckedChange={(checked) =>
                onPresentChange(checked === true)
              }
              className="size-3.5"
            />
            <span className="text-xs text-muted-foreground">Present</span>
          </label>
        </div>
        <Input
          value={isPresent ? "Present" : to}
          onChange={(e) => onToChange(e.target.value)}
          placeholder="2021"
          disabled={isPresent}
          className="text-sm h-9 disabled:opacity-60"
        />
      </div>
    </div>
  );
}
