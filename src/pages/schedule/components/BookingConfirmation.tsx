
import React from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface BookingConfirmationProps {
  date: Date;
  time: string;
  address: string;
  price: number;
}

const BookingConfirmation = ({ date, time, address, price }: BookingConfirmationProps) => {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold text-[#0066B3]">BOOKING CONFIRMED</h2>
      <div className="space-y-2 text-[#1B365D]">
        <p>WE WILL SEE YOU ON {format(date, "EEEE")},</p>
        <p>{format(date, "MMMM do")} AT {time}</p>
        <p className="mt-4">{address}</p>
        <p className="mt-4 text-lg font-semibold">Total: ${price.toFixed(2)}</p>
      </div>
      <Button
        variant="outline"
        className="w-full border-[#0066B3] text-[#0066B3]"
      >
        REFER A FRIEND
      </Button>
    </div>
  );
};

export default BookingConfirmation;
