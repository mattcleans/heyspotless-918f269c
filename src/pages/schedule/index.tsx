
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/App";
import { Loadable } from "@/components/ui/loadable";
import { useToast } from "@/hooks/use-toast";
import { MapsLoader } from "@/components/ui/maps-loader";
import BookingHeader, { BookingStep } from "./components/BookingHeader";
import DateSelection from "./components/DateSelection";
import TimeSelection from "./components/TimeSelection";
import AddressAndNotes from "./components/AddressAndNotes";
import BookingConfirmation from "./components/BookingConfirmation";
import { QuoteSummary } from "../quotes/components/QuoteSummary";
import { Button } from "@/components/ui/button";

const SchedulePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { userId } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<BookingStep>("date");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedFrequency, setSelectedFrequency] = useState("one-time");
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  useEffect(() => {
    const checkPaymentMethods = async () => {
      if (!userId) return;
      
      const { data, error } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      if (!error && data) {
        setHasPaymentMethod(data.length > 0);
      }
    };

    checkPaymentMethods();
  }, [userId]);

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

  const handleQuoteComplete = (price: number, frequency: string) => {
    setTotalPrice(price);
    setSelectedFrequency(frequency);
    setCurrentStep("address");
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
      
      // Create the booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: userId,
          date: date.toISOString().split('T')[0],
          time,
          address,
          notes,
          status: 'pending',
          price: totalPrice
        });

      if (bookingError) throw bookingError;

      setCurrentStep("confirmation");
      toast({
        title: "Booking Successful",
        description: "Your cleaning service has been scheduled."
      });
    } catch (error: any) {
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
    const content = (() => {
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
              onNext={() => setCurrentStep("quote")}
            />
          );
        case "quote":
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#0066B3] text-center">Select Your Service</h2>
              <Button
                className="w-full"
                onClick={() => navigate('/quotes', { state: { date, time } })}
              >
                Build New Quote
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCurrentStep("address")}
              >
                Rebook Previous Service
              </Button>
            </div>
          );
        case "address":
          return (
            <MapsLoader>
              <AddressAndNotes
                address={address}
                notes={notes}
                onAddressChange={setAddress}
                onNotesChange={setNotes}
                onBook={() => setCurrentStep(hasPaymentMethod ? "confirmation" : "payment")}
                onLoad={setAutocomplete}
                onPlaceChanged={handlePlaceSelect}
              />
            </MapsLoader>
          );
        case "payment":
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#0066B3] text-center">Add Payment Method</h2>
              <Button
                className="w-full"
                onClick={() => {
                  // This will be implemented when we add payment processing
                  setCurrentStep("confirmation");
                }}
              >
                Add Payment Method
              </Button>
            </div>
          );
        case "confirmation":
          return (
            <BookingConfirmation
              date={date!}
              time={time!}
              address={address}
              price={totalPrice}
            />
          );
        default:
          return null;
      }
    })();

    return <Loadable loading={isSubmitting}>{content}</Loadable>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BookingHeader currentStep={currentStep} />
      <div className="max-w-md mx-auto mt-8">
        {renderStep()}
      </div>
    </div>
  );
};

export default SchedulePage;
