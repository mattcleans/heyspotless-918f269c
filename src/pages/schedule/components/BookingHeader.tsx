
import React from "react";

type BookingStep = "date" | "time" | "address" | "confirmation";

interface BookingHeaderProps {
  currentStep: BookingStep;
}

const BookingHeader = ({ currentStep }: BookingHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-2">
        <img 
          src="/lovable-uploads/bbb5176c-dbed-4e4a-8029-a3982064c2ea.png" 
          alt="Hey Spotless Logo" 
          className="h-12 object-contain"
        />
      </div>
      <p className="text-[#1B365D]">Dallas Cleaning Professionals</p>
      <p className="text-sm text-[#1B365D]/60 mt-1">GOODBYE SPOTS • HELLO SPARKLE</p>
    </div>
  );
};

export default BookingHeader;
