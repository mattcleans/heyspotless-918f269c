
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DateSelectionProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onNext: () => void;
}

const DateSelection = ({ date, onDateSelect, onNext }: DateSelectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0066B3] text-center">PICK A DAY</h2>
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateSelect}
          className="rounded-md border"
        />
      </div>
      <Button
        onClick={onNext}
        disabled={!date}
        className="w-full bg-[#0066B3] hover:bg-[#0066B3]/90"
      >
        Next <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default DateSelection;
