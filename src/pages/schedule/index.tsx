import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/App";
import { Loadable } from "@/components/ui/loadable";
import { useToast } from "@/hooks/use-toast";
import BookingHeader from "./components/BookingHeader";
import DateSelection from "./components/DateSelection";
import TimeSelection from "./components/TimeSelection";
import AddressAndNotes from "./components/AddressAndNotes";
import BookingConfirmation from "./components/BookingConfirmation";
import { Autocomplete } from "@react-google-maps/api";

type BookingStep = "date" | "time" | "address" | "confirmation";

const SchedulePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userId } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<BookingStep>("date");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && selectedDate < new Date()) {
      toast({
        variant: "destructive",
        title: "Invalid Date",
        description: "Please select a future date"
      });
      return;
    }
    setDate(selectedDate);
  };

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      setAddress(place.formatted_address || "");
    }
  };

  const handleBook = async () => {
    if (!userId || !date || !time || !address) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: userId,
          date: date.toISOString().split('T')[0],
          time,
          address,
          notes,
          status: 'pending'
        });

      if (error) throw error;

      setCurrentStep("confirmation");
      toast({
        title: "Booking Successful",
        description: "Your cleaning service has been scheduled"
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "There was an error scheduling your cleaning service. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "date":
        return (
          <DateSelection
            date={date}
            onDateSelect={handleDateSelect}
            onNext={() => setCurrentStep("time")}
          />
        );
      case "time":
        return (
          <TimeSelection
            time={time}
            onTimeSelect={setTime}
            onNext={() => setCurrentStep("address")}
          />
        );
      case "address":
        return (
          <AddressAndNotes
            address={address}
            notes={notes}
            onAddressChange={setAddress}
            onNotesChange={setNotes}
            onBook={handleBook}
            onLoad={setAutocomplete}
            onPlaceChanged={handlePlaceSelect}
          />
        );
      case "confirmation":
        return (
          <BookingConfirmation
            date={date!}
            time={time!}
            address={address}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BookingHeader currentStep={currentStep} />
      <div className="max-w-md mx-auto mt-8">
        <Loadable loading={isSubmitting}>
          {renderStep()}
        </Loadable>
      </div>
    </div>
  );
};

export default SchedulePage;
