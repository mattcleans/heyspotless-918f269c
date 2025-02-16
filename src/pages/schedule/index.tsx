
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Star } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const BookingPage = () => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBook = () => {
    // TODO: Implement booking logic
    console.log({
      date,
      time,
      address,
      notes,
    });
    setStep(step + 1);
  };

  return (
    <div className="mx-auto max-w-xl animate-fade-in">
      {/* Logo and Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <Star className="w-8 h-8 text-[#FFD700] mr-2" />
          <h1 className="text-3xl font-bold text-[#0066B3]">Hey Spotless</h1>
        </div>
        <p className="text-[#1B365D]">Dallas Cleaning Professionals</p>
        <p className="text-sm text-[#1B365D]/60 mt-1">GOODBYE SPOTS • HELLO SPARKLE</p>
      </div>

      {/* Step 1: Date Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0066B3] text-center">PICK A DAY</h2>
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          <Button
            onClick={handleNext}
            disabled={!date}
            className="w-full bg-[#0066B3] hover:bg-[#0066B3]/90"
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 2: Time Selection */}
      {step === 2 && (
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
                onClick={() => setTime(slot)}
              >
                {slot}
              </Button>
            ))}
          </div>
          <Button
            onClick={handleNext}
            disabled={!time}
            className="w-full bg-[#0066B3] hover:bg-[#0066B3]/90"
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 3: Address and Notes */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-[#0066B3] mb-2">ADDRESS:</h3>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                className="w-full"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#0066B3] mb-2">ANY NOTES FOR US?</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special instructions or requests..."
                className="w-full h-32"
              />
            </div>
          </div>
          <Button
            onClick={handleBook}
            disabled={!address}
            className="w-full bg-[#0066B3] hover:bg-[#0066B3]/90"
          >
            BOOK
          </Button>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-[#0066B3]">BOOKING CONFIRMED</h2>
          <div className="space-y-2 text-[#1B365D]">
            <p>WE WILL SEE YOU ON {format(date!, "EEEE")},</p>
            <p>{format(date!, "MMMM do")} AT {time}</p>
          </div>
          <Button
            variant="outline"
            className="w-full border-[#0066B3] text-[#0066B3]"
          >
            REFER A FRIEND
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
