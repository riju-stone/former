"use client";

import * as React from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar1 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePickerComponent({ disabled, value, onChange }: { disabled: boolean; value?: Date; onChange?: (date?: Date) => void }) {
  const [date, setDate] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleSelect = (selected?: Date) => {
    setDate(selected);
    onChange?.(selected);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={"outline"}
          className={cn(
            "w-full min-w-[150px] justify-between text-left font-normal bg-transparent",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(date, "P") : <span className="opacity-50">MM/DD/YYYY</span>}
          <Calendar1 />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleSelect} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
