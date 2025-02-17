
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSelectionProps {
  time: string | undefined;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
}

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const TimeSelection = ({ time, onTimeSelect, onNext }: TimeSelectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0066B3] text-center">PICK A TIME</h2>
      <div className="grid grid-cols-2 gap-4">
        {timeSlots.map((slot) => (
          <Button
            key={slot}
            variant={time === slot ? "default" : "outline"}
            className={cn(
              "h-12",
              time === slot && "bg-[#0066B3] hover:bg-[#0066B3]/90"
            )}
            onClick={() => onTimeSelect(slot)}
          >
            {slot}
          </Button>
        ))}
      </div>
      <Button
        onClick={onNext}
        disabled={!time}
        className="w-full bg-[#0066B3] hover:bg-[#0066B3]/90"
      >
        Next <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default TimeSelection;
