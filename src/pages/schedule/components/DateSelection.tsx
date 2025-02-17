
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { isAfter, startOfDay } from "date-fns";

interface DateSelectionProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onNext: () => void;
}

const DateSelection = ({ date, onDateSelect, onNext }: DateSelectionProps) => {
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && isAfter(startOfDay(selectedDate), startOfDay(new Date()))) {
      onDateSelect(selectedDate);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0066B3] text-center">PICK A DAY</h2>
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          disabled={(date) => !isAfter(startOfDay(date), startOfDay(new Date()))}
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
