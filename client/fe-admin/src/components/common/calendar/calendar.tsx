// Calendar22.tsx
"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
interface Calendar22Props {
  value?: Date;
  onChange: (date: Date) => void;
}

export function Calendar22({ value, onChange }: Calendar22Props) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState();
  const displayValue = () => {
    if (value) {
      return format(value, "LLL d, y", { locale: vi });
    }
    return "Chọn ngày";
  };
  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal flex items-center">
            {displayValue()}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (date) {
                onChange(date);
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
