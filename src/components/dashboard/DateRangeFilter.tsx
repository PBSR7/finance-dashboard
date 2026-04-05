import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateRangeFilterProps {
  from: Date | undefined;
  to: Date | undefined;
  onChange: (from: Date | undefined, to: Date | undefined) => void;
}

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);

  const hasFilter = from || to;

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 gap-2 bg-secondary border-border text-sm font-normal",
              hasFilter && "border-primary/50 text-foreground"
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            {from && to
              ? `${format(from, "MMM d")} – ${format(to, "MMM d")}`
              : from
              ? `From ${format(from, "MMM d")}`
              : "Date Range"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={from && to ? { from, to } : from ? { from, to: undefined } : undefined}
            onSelect={(range) => {
              onChange(range?.from, range?.to);
              if (range?.from && range?.to) setOpen(false);
            }}
            numberOfMonths={1}
            className={cn("p-3 pointer-events-auto")}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => onChange(undefined, undefined)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
